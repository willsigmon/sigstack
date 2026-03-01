/**
 * GitHub Sync Engine
 *
 * Orchestrates syncing between GitHub repositories and local database:
 * - Scheduled auto-sync for sources
 * - Manual sync on-demand
 * - Upstream change detection
 * - Conflict resolution
 * - Sync state tracking
 */

import { EventEmitter } from 'events';
import { GitHubDatabaseAdapter } from '../indexer/github-db-adapter.js';
import { GitHubSourceManager } from '../indexer/github-source-manager.js';
import { Logger } from '../utils/logger.js';

export interface SyncProgress {
  sourceId: string;
  sourceName: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  progress: {
    scanned: number;
    indexed: number;
    skipped: number;
    errors: number;
  };
  error?: string;
}

export interface SyncSchedule {
  enabled: boolean;
  intervalMinutes: number;
  lastRun?: Date;
  nextRun?: Date;
}

/**
 * GitHub sync engine with scheduling and progress tracking
 */
export class GitHubSyncEngine extends EventEmitter {
  private adapter: GitHubDatabaseAdapter;
  private sourceManager: GitHubSourceManager;
  private logger: Logger;
  private syncInterval?: NodeJS.Timeout;
  private schedule: SyncSchedule;
  private syncing = false;

  constructor(
    adapter: GitHubDatabaseAdapter,
    sourceManager: GitHubSourceManager,
    logger?: Logger
  ) {
    super();
    this.adapter = adapter;
    this.sourceManager = sourceManager;
    this.logger = logger || new Logger({ prefix: 'github-sync-engine' });

    this.schedule = {
      enabled: false,
      intervalMinutes: 60, // Default: 1 hour
    };
  }

  /**
   * Start scheduled auto-sync
   */
  startScheduler(intervalMinutes: number = 60): void {
    if (this.syncInterval) {
      this.logger.warn('Scheduler already running');
      return;
    }

    this.schedule.enabled = true;
    this.schedule.intervalMinutes = intervalMinutes;

    this.logger.info(`Starting sync scheduler (interval: ${intervalMinutes}m)`);

    // Run immediately on start
    this.runScheduledSync();

    // Schedule periodic syncs
    const intervalMs = intervalMinutes * 60 * 1000;
    this.syncInterval = setInterval(() => {
      this.runScheduledSync();
    }, intervalMs);
  }

  /**
   * Stop scheduled auto-sync
   */
  stopScheduler(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
      this.schedule.enabled = false;
      this.logger.info('Sync scheduler stopped');
    }
  }

  /**
   * Run scheduled sync
   */
  private async runScheduledSync(): Promise<void> {
    this.schedule.lastRun = new Date();
    this.schedule.nextRun = new Date(
      Date.now() + this.schedule.intervalMinutes * 60 * 1000
    );

    this.logger.info('Running scheduled sync');
    this.emit('schedule:start', this.schedule);

    try {
      await this.syncAll();
      this.emit('schedule:complete', this.schedule);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error('Scheduled sync failed:', errorMsg);
      this.emit('schedule:error', { schedule: this.schedule, error: errorMsg });
    }
  }

  /**
   * Sync all enabled GitHub sources
   */
  async syncAll(): Promise<SyncProgress[]> {
    if (this.syncing) {
      throw new Error('Sync already in progress');
    }

    this.syncing = true;
    this.logger.info('Starting sync for all sources');
    this.emit('sync:start');

    const sources = this.sourceManager.getEnabledSources();
    const progress: SyncProgress[] = sources.map((s) => ({
      sourceId: s.id,
      sourceName: `${s.owner}/${s.repo}`,
      status: 'pending' as const,
      progress: {
        scanned: 0,
        indexed: 0,
        skipped: 0,
        errors: 0,
      },
    }));

    try {
      // Sync sources one by one (could be parallelized with concurrency limit)
      for (let index = 0; index < sources.length; index++) {
        const source = sources[index];
        const currentProgress = progress[index];
        currentProgress.status = 'syncing';
        this.emit('sync:progress', currentProgress);

        try {
          await this.syncSource(source.id);
          currentProgress.status = 'completed';
          this.emit('sync:source-complete', currentProgress);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          currentProgress.status = 'failed';
          currentProgress.error = errorMsg;
          this.logger.error(`Failed to sync source ${source.id}:`, errorMsg);
          this.emit('sync:source-error', { ...currentProgress, error: errorMsg });
        }
      }

      this.logger.info('Sync completed for all sources');
      this.emit('sync:complete', progress);
    } finally {
      this.syncing = false;
    }

    return progress;
  }

  /**
   * Sync a specific GitHub source
   */
  async syncSource(sourceId: string): Promise<void> {
    this.logger.info(`Syncing source: ${sourceId}`);

    const source = this.sourceManager.getSource(sourceId);
    if (!source) {
      throw new Error(`Source not found: ${sourceId}`);
    }

    this.emit('sync:source-start', { sourceId, sourceName: `${source.owner}/${source.repo}` });

    try {
      await this.adapter.syncSource(sourceId);
      this.emit('sync:source-complete', { sourceId });
    } catch (error) {
      this.emit('sync:source-error', { sourceId, error });
      throw error;
    }
  }

  /**
   * Check for upstream changes without syncing
   */
  async checkUpstreamChanges(
    sourceId: string
  ): Promise<{ hasChanges: boolean; lastCommit?: string }> {
    const source = this.sourceManager.getSource(sourceId);
    if (!source) {
      throw new Error(`Source not found: ${sourceId}`);
    }

    if (!source.lastSyncCommit) {
      return { hasChanges: true }; // Never synced before
    }

    const result = await this.sourceManager.syncSource(sourceId);

    return {
      hasChanges: result.lastCommit !== source.lastSyncCommit,
      lastCommit: result.lastCommit,
    };
  }

  /**
   * Force sync a source (ignore upstream check)
   */
  async forceSyncSource(sourceId: string): Promise<void> {
    this.logger.info(`Force syncing source: ${sourceId}`);

    const source = this.sourceManager.getSource(sourceId);
    if (!source) {
      throw new Error(`Source not found: ${sourceId}`);
    }

    // Temporarily clear last sync commit to force sync
    const originalCommit = source.lastSyncCommit;
    source.lastSyncCommit = undefined;

    try {
      await this.syncSource(sourceId);
    } finally {
      // Restore original commit if sync failed
      if (source.lastSyncCommit === undefined) {
        source.lastSyncCommit = originalCommit;
      }
    }
  }

  /**
   * Get sync schedule status
   */
  getSchedule(): SyncSchedule {
    return { ...this.schedule };
  }

  /**
   * Check if sync is currently running
   */
  isSyncing(): boolean {
    return this.syncing;
  }

  /**
   * Get sync statistics
   */
  async getSyncStats(): Promise<{
    totalSources: number;
    enabledSources: number;
    lastSyncedAt?: Date;
    skillCount: number;
  }> {
    const sources = this.sourceManager.getAllSources();
    const enabledSources = sources.filter((s) => s.enabled);

    // Find most recent sync
    let lastSyncedAt: Date | undefined;
    for (const source of sources) {
      if (source.lastSyncedAt) {
        if (!lastSyncedAt || source.lastSyncedAt > lastSyncedAt) {
          lastSyncedAt = source.lastSyncedAt;
        }
      }
    }

    const skillCount = sources.reduce((sum, s) => sum + s.skillCount, 0);

    return {
      totalSources: sources.length,
      enabledSources: enabledSources.length,
      lastSyncedAt,
      skillCount,
    };
  }

  /**
   * Cleanup - stop scheduler and release resources
   */
  cleanup(): void {
    this.stopScheduler();
    this.removeAllListeners();
  }
}

/**
 * Create a configured GitHub sync engine
 */
export function createGitHubSyncEngine(
  adapter: GitHubDatabaseAdapter,
  sourceManager: GitHubSourceManager,
  options?: {
    autoStartScheduler?: boolean;
    schedulerIntervalMinutes?: number;
    logger?: Logger;
  }
): GitHubSyncEngine {
  const logger = options?.logger || new Logger({ prefix: 'github-sync-engine' });
  const engine = new GitHubSyncEngine(adapter, sourceManager, logger);

  if (options?.autoStartScheduler) {
    engine.startScheduler(options.schedulerIntervalMinutes || 60);
  }

  return engine;
}
