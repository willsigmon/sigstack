/**
 * GitHub Source Manager
 *
 * Manages GitHub repositories as skill sources:
 * - Add/remove GitHub repos
 * - Authenticate with tokens
 * - Track sync state
 * - Configure repo settings (branch, paths, etc.)
 */

import { createHash } from 'crypto';
import { Logger } from '../utils/logger.js';
import { GitHubIndexer, type GitHubRepoConfig } from './github-indexer.js';

export interface GitHubSource {
  id: string;
  owner: string;
  repo: string;
  branch?: string;
  tag?: string;
  commit?: string;
  skillPaths?: string[];
  auth?: string;
  enabled: boolean;
  lastSyncedAt?: Date;
  lastSyncCommit?: string;
  skillCount: number;
  config: {
    autoSync?: boolean;
    syncInterval?: number; // minutes
    watchBranch?: boolean;
  };
}

export interface AddGitHubSourceParams {
  owner: string;
  repo: string;
  branch?: string;
  tag?: string;
  commit?: string;
  skillPaths?: string[];
  auth?: string;
  autoSync?: boolean;
  syncInterval?: number;
}

export interface GitHubSourceUpdate {
  branch?: string;
  tag?: string;
  commit?: string;
  skillPaths?: string[];
  enabled?: boolean;
  autoSync?: boolean;
  syncInterval?: number;
}

export interface SyncResult {
  sourceId: string;
  success: boolean;
  skillsAdded: number;
  skillsUpdated: number;
  skillsRemoved: number;
  errors: string[];
  lastCommit?: string;
}

/**
 * GitHub source manager for handling repository-based skill sources
 */
export class GitHubSourceManager {
  private logger: Logger;
  private indexer: GitHubIndexer;
  private sources: Map<string, GitHubSource> = new Map();

  constructor(logger?: Logger) {
    this.logger = logger || new Logger({ prefix: 'github-source-manager' });
    this.indexer = new GitHubIndexer(undefined, this.logger.child('indexer'));
  }

  /**
   * Add a GitHub repository as a skill source
   */
  async addSource(params: AddGitHubSourceParams): Promise<GitHubSource> {
    this.logger.info(`Adding GitHub source: ${params.owner}/${params.repo}`);

    // Generate source ID
    const id = this.generateSourceId(params.owner, params.repo);

    // Check if source already exists
    if (this.sources.has(id)) {
      throw new Error(`GitHub source already exists: ${params.owner}/${params.repo}`);
    }

    // Validate repository access
    const indexer = new GitHubIndexer(params.auth, this.logger.child('validator'));
    try {
      await indexer.getRepositoryMetadata({
        owner: params.owner,
        repo: params.repo,
        branch: params.branch,
        auth: params.auth,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to access repository: ${errorMsg}`);
    }

    // Create source object
    const source: GitHubSource = {
      id,
      owner: params.owner,
      repo: params.repo,
      branch: params.branch,
      tag: params.tag,
      commit: params.commit,
      skillPaths: params.skillPaths,
      auth: params.auth,
      enabled: true,
      skillCount: 0,
      config: {
        autoSync: params.autoSync ?? false,
        syncInterval: params.syncInterval ?? 60, // Default: 1 hour
        watchBranch: true,
      },
    };

    this.sources.set(id, source);
    this.logger.info(`GitHub source added: ${id}`);

    return source;
  }

  /**
   * Remove a GitHub source
   */
  async removeSource(sourceId: string): Promise<boolean> {
    this.logger.info(`Removing GitHub source: ${sourceId}`);

    if (!this.sources.has(sourceId)) {
      throw new Error(`GitHub source not found: ${sourceId}`);
    }

    this.sources.delete(sourceId);
    this.logger.info(`GitHub source removed: ${sourceId}`);

    return true;
  }

  /**
   * Update a GitHub source configuration
   */
  async updateSource(sourceId: string, update: GitHubSourceUpdate): Promise<GitHubSource> {
    this.logger.info(`Updating GitHub source: ${sourceId}`);

    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error(`GitHub source not found: ${sourceId}`);
    }

    // Update fields
    if (update.branch !== undefined) source.branch = update.branch;
    if (update.tag !== undefined) source.tag = update.tag;
    if (update.commit !== undefined) source.commit = update.commit;
    if (update.skillPaths !== undefined) source.skillPaths = update.skillPaths;
    if (update.enabled !== undefined) source.enabled = update.enabled;
    if (update.autoSync !== undefined) source.config.autoSync = update.autoSync;
    if (update.syncInterval !== undefined) source.config.syncInterval = update.syncInterval;

    this.sources.set(sourceId, source);
    this.logger.info(`GitHub source updated: ${sourceId}`);

    return source;
  }

  /**
   * Get a GitHub source by ID
   */
  getSource(sourceId: string): GitHubSource | undefined {
    return this.sources.get(sourceId);
  }

  /**
   * Get all GitHub sources
   */
  getAllSources(): GitHubSource[] {
    return Array.from(this.sources.values());
  }

  /**
   * Get enabled GitHub sources
   */
  getEnabledSources(): GitHubSource[] {
    return Array.from(this.sources.values()).filter((s) => s.enabled);
  }

  /**
   * Check if a source needs syncing
   */
  needsSync(source: GitHubSource): boolean {
    if (!source.enabled || !source.config.autoSync) {
      return false;
    }

    if (!source.lastSyncedAt) {
      return true; // Never synced
    }

    const now = Date.now();
    const lastSync = source.lastSyncedAt.getTime();
    const intervalMs = (source.config.syncInterval || 60) * 60 * 1000;

    return now - lastSync >= intervalMs;
  }

  /**
   * Sync a GitHub source (fetch and index skills)
   */
  async syncSource(
    sourceId: string,
    onSkillsIndexed?: (skills: any[]) => Promise<void>
  ): Promise<SyncResult> {
    this.logger.info(`Syncing GitHub source: ${sourceId}`);

    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error(`GitHub source not found: ${sourceId}`);
    }

    if (!source.enabled) {
      throw new Error(`GitHub source is disabled: ${sourceId}`);
    }

    const result: SyncResult = {
      sourceId,
      success: false,
      skillsAdded: 0,
      skillsUpdated: 0,
      skillsRemoved: 0,
      errors: [],
    };

    try {
      // Create indexer with source auth
      const indexer = new GitHubIndexer(source.auth, this.logger.child('sync'));

      // Build repo config
      const config: GitHubRepoConfig = {
        owner: source.owner,
        repo: source.repo,
        branch: source.branch,
        tag: source.tag,
        commit: source.commit,
        skillPaths: source.skillPaths,
        auth: source.auth,
      };

      // Check if there are upstream changes (if we've synced before)
      if (source.lastSyncCommit) {
        const hasChanges = await indexer.hasUpstreamChanges(config, source.lastSyncCommit);
        if (!hasChanges) {
          this.logger.info(`No upstream changes detected for ${sourceId}`);
          result.success = true;
          return result;
        }
        this.logger.info(`Upstream changes detected for ${sourceId}, syncing...`);
      }

      // Index repository
      const indexResult = await indexer.indexRepository(config);

      // Process indexed skills
      if (onSkillsIndexed && indexResult.skills.length > 0) {
        await onSkillsIndexed(indexResult.skills);
      }

      // Update sync result
      result.skillsAdded = indexResult.stats.indexed;
      result.errors = indexResult.errors.map((e) => e.error);
      result.success = true;

      // Get latest commit for tracking
      const repoMeta = await indexer.getRepositoryMetadata(config);
      result.lastCommit = repoMeta.lastCommit;

      // Update source metadata
      source.lastSyncedAt = new Date();
      source.lastSyncCommit = repoMeta.lastCommit;
      source.skillCount = indexResult.stats.indexed;
      this.sources.set(sourceId, source);

      this.logger.info(
        `GitHub source synced: ${sourceId} (${result.skillsAdded} skills indexed)`
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to sync GitHub source ${sourceId}: ${errorMsg}`);
      result.errors.push(errorMsg);
      result.success = false;
    }

    return result;
  }

  /**
   * Sync all enabled sources that need syncing
   */
  async syncAllSources(
    onSkillsIndexed?: (sourceId: string, skills: any[]) => Promise<void>
  ): Promise<SyncResult[]> {
    const sources = this.getEnabledSources().filter((s) => this.needsSync(s));

    this.logger.info(`Syncing ${sources.length} GitHub sources...`);

    const results: SyncResult[] = [];

    for (const source of sources) {
      const result = await this.syncSource(source.id, async (skills) => {
        if (onSkillsIndexed) {
          await onSkillsIndexed(source.id, skills);
        }
      });
      results.push(result);
    }

    return results;
  }

  /**
   * Authenticate with GitHub (validate token)
   */
  async authenticateWithToken(token: string): Promise<{ username: string; scopes: string[] }> {
    try {
      const indexer = new GitHubIndexer(token, this.logger.child('auth'));
      const octokit = (indexer as any).octokit;

      const { data: user } = await octokit.users.getAuthenticated();

      // Try to get token scopes (may not be available)
      let scopes: string[] = [];
      try {
        const { headers } = await octokit.request('GET /user');
        if (headers['x-oauth-scopes']) {
          scopes = headers['x-oauth-scopes'].split(',').map((s: string) => s.trim());
        }
      } catch {
        // Scopes not available, continue
      }

      this.logger.info(`Authenticated as: ${user.login}`);
      return { username: user.login, scopes };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`GitHub authentication failed: ${errorMsg}`);
    }
  }

  /**
   * Search for repositories by owner or query
   */
  async searchRepositories(
    query: string,
    owner?: string
  ): Promise<Array<{ owner: string; repo: string; description: string }>> {
    const indexer = new GitHubIndexer(undefined, this.logger.child('search'));

    if (owner) {
      // List repositories for specific owner
      return indexer.listRepositories(owner);
    }

    // Search repositories by query
    try {
      const octokit = (indexer as any).octokit;
      const { data } = await octokit.search.repos({
        q: query,
        per_page: 50,
        sort: 'stars',
      });

      return data.items.map((repo: any) => ({
        owner: repo.owner.login,
        repo: repo.name,
        description: repo.description || '',
      }));
    } catch (error) {
      this.logger.error('Repository search failed:', error);
      throw error;
    }
  }

  /**
   * Generate a deterministic source ID from owner/repo
   */
  private generateSourceId(owner: string, repo: string): string {
    return createHash('sha256')
      .update(`github:${owner}/${repo}`)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Load sources from database (to be called during initialization)
   */
  loadSources(sources: GitHubSource[]): void {
    this.sources.clear();
    for (const source of sources) {
      this.sources.set(source.id, source);
    }
    this.logger.info(`Loaded ${sources.length} GitHub sources`);
  }

  /**
   * Export sources for database persistence
   */
  exportSources(): GitHubSource[] {
    return Array.from(this.sources.values());
  }
}
