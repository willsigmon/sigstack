/**
 * Bi-directional sync engine for skills
 * Coordinates syncing between local and remote sources (GitHub, Codex, custom registries)
 */

import { getDatabase, SkillsDatabase } from '../db/index.js';
import type { Skill as DbSkill } from '../db/index.js';
import { logger } from '../utils/logger.js';
import { conflictResolver, ConflictResolver, Conflict, ConflictResolution } from './conflict.js';
import type { Skill, SkillSource } from '../types/skill.js';
import type { SyncSkillsParams, SyncSkillsResult } from '../mcp/types.js';

export interface SyncChange {
  type: 'add' | 'update' | 'delete';
  skill_id: string;
  skill_name: string;
  local_checksum?: string;
  remote_checksum?: string;
  skill?: Skill;
}

export interface SyncState {
  skill_id: string;
  source_id: string;
  checksum: string;
  synced_at: number; // Unix timestamp
}

export interface SourceIndexer {
  /**
   * Fetch all skills from the source
   */
  fetchSkills(): Promise<Skill[]>;

  /**
   * Fetch a specific skill by ID
   */
  fetchSkill(skillId: string): Promise<Skill | null>;

  /**
   * Push a skill to the source (if supported)
   */
  pushSkill?(skill: Skill): Promise<void>;

  /**
   * Delete a skill from the source (if supported)
   */
  deleteSkill?(skillId: string): Promise<void>;

  /**
   * Check if source supports push operations
   */
  canPush(): boolean;
}

export class SyncEngine {
  private db: SkillsDatabase;
  private log = logger.child('sync');
  private resolver: ConflictResolver;
  private indexers: Map<string, SourceIndexer> = new Map();

  constructor(db?: SkillsDatabase, resolver?: ConflictResolver) {
    this.db = db || getDatabase();
    this.resolver = resolver || conflictResolver;
  }

  /**
   * Register a source indexer for syncing
   */
  registerIndexer(sourceId: string, indexer: SourceIndexer): void {
    this.indexers.set(sourceId, indexer);
    this.log.debug(`Registered indexer for source: ${sourceId}`);
  }

  /**
   * Main sync entry point - coordinates pull/push operations
   */
  async sync(params: SyncSkillsParams): Promise<SyncSkillsResult> {
    this.log.info('Starting sync operation', {
      source: params.source || 'all',
      direction: params.direction || 'pull',
      dry_run: params.dry_run || false,
      strategy: params.strategy || 'merge',
    });

    const result: SyncSkillsResult = {
      added: 0,
      updated: 0,
      skipped: 0,
      conflicts: [],
    };

    try {
      // Get sources to sync
      const sources = await this.getSourcesToSync(params.source);

      if (sources.length === 0) {
        this.log.warn('No sources found to sync');
        return result;
      }

      // Sync each source
      for (const source of sources) {
        const sourceResult = await this.syncSource(source, params);
        result.added += sourceResult.added;
        result.updated += sourceResult.updated;
        result.skipped += sourceResult.skipped;
        result.conflicts.push(...sourceResult.conflicts);
      }

      this.log.info('Sync completed', result);
      return result;
    } catch (error) {
      this.log.error('Sync failed:', error);
      throw error;
    }
  }

  /**
   * Sync a single source
   */
  private async syncSource(
    source: { id: string; type: string; path?: string; repo?: string },
    params: SyncSkillsParams
  ): Promise<SyncSkillsResult> {
    this.log.info(`Syncing source: ${source.id} (${source.type})`);

    const result: SyncSkillsResult = {
      added: 0,
      updated: 0,
      skipped: 0,
      conflicts: [],
    };

    const indexer = this.indexers.get(source.id);
    if (!indexer) {
      this.log.warn(`No indexer registered for source: ${source.id}`);
      return result;
    }

    // Pull changes from remote
    if (params.direction === 'pull' || params.direction === 'both') {
      const pullResult = await this.pullChanges(source, indexer, params);
      result.added += pullResult.added;
      result.updated += pullResult.updated;
      result.skipped += pullResult.skipped;
      result.conflicts.push(...pullResult.conflicts);
    }

    // Push changes to remote
    if (params.direction === 'push' || params.direction === 'both') {
      if (!indexer.canPush()) {
        this.log.warn(`Source ${source.id} does not support push operations`);
      } else {
        const pushResult = await this.pushChanges(source, indexer, params);
        result.updated += pushResult.updated;
        result.skipped += pushResult.skipped;
        result.conflicts.push(...pushResult.conflicts);
      }
    }

    return result;
  }

  /**
   * Pull changes from remote to local
   */
  private async pullChanges(
    source: { id: string; type: string },
    indexer: SourceIndexer,
    params: SyncSkillsParams
  ): Promise<SyncSkillsResult> {
    this.log.debug(`Pulling changes from source: ${source.id}`);

    const result: SyncSkillsResult = {
      added: 0,
      updated: 0,
      skipped: 0,
      conflicts: [],
    };

    // Fetch remote skills
    const remoteSkills = await indexer.fetchSkills();
    this.log.debug(`Fetched ${remoteSkills.length} skills from remote`);

    // Get local skills for this source
    const localSkills = await this.getLocalSkillsForSource(source.id);
    const localSkillsMap = new Map(localSkills.map((s) => [s.id, s]));

    // Detect changes
    const changes = this.detectChanges(localSkillsMap, remoteSkills, source.id);
    this.log.debug(`Detected ${changes.length} changes`);

    if (params.dry_run) {
      // Dry run - just report what would happen
      this.logDryRunChanges(changes);
      return this.countChanges(changes);
    }

    // Apply changes
    for (const change of changes) {
      try {
        const changeResult = await this.applyChange(change, source.id, params.strategy || 'merge');

        switch (changeResult.type) {
          case 'added':
            result.added++;
            break;
          case 'updated':
            result.updated++;
            break;
          case 'skipped':
            result.skipped++;
            break;
          case 'conflict':
            result.conflicts.push({
              skill: change.skill_name,
              reason: changeResult.reason || 'Conflict detected',
              resolution: changeResult.resolution,
            });
            break;
        }
      } catch (error) {
        this.log.error(`Failed to apply change for ${change.skill_name}:`, error);
        result.skipped++;
      }
    }

    return result;
  }

  /**
   * Push local changes to remote
   */
  private async pushChanges(
    source: { id: string; type: string },
    indexer: SourceIndexer,
    params: SyncSkillsParams
  ): Promise<SyncSkillsResult> {
    this.log.debug(`Pushing changes to source: ${source.id}`);

    const result: SyncSkillsResult = {
      added: 0,
      updated: 0,
      skipped: 0,
      conflicts: [],
    };

    if (!indexer.pushSkill) {
      this.log.warn(`Source ${source.id} does not implement pushSkill`);
      return result;
    }

    // Get local skills that need pushing
    const localSkills = await this.getLocalSkillsForSource(source.id);
    const syncStates = await this.getSyncStates(source.id);
    const syncStateMap = new Map(syncStates.map((s) => [s.skill_id, s]));

    for (const skill of localSkills) {
      const syncState = syncStateMap.get(skill.id);

      // Check if skill needs syncing
      if (syncState && syncState.checksum === skill.checksum) {
        continue; // Already synced
      }

      if (params.dry_run) {
        this.log.info(`[DRY RUN] Would push skill: ${skill.name}`);
        result.updated++;
        continue;
      }

      try {
        await indexer.pushSkill(skill);
        await this.updateSyncState(skill.id, source.id, skill.checksum);
        result.updated++;
        this.log.info(`Pushed skill: ${skill.name}`);
      } catch (error) {
        this.log.error(`Failed to push skill ${skill.name}:`, error);
        result.skipped++;
      }
    }

    return result;
  }

  /**
   * Detect changes between local and remote
   */
  private detectChanges(
    localSkillsMap: Map<string, Skill>,
    remoteSkills: Skill[],
    sourceId: string
  ): SyncChange[] {
    const changes: SyncChange[] = [];
    const syncStates = this.getSyncStatesSync(sourceId);
    const syncStateMap = new Map(syncStates.map((s) => [s.skill_id, s]));

    // Check remote skills
    for (const remoteSkill of remoteSkills) {
      const localSkill = localSkillsMap.get(remoteSkill.id);
      const syncState = syncStateMap.get(remoteSkill.id);

      if (!localSkill) {
        // New skill from remote
        changes.push({
          type: 'add',
          skill_id: remoteSkill.id,
          skill_name: remoteSkill.name,
          remote_checksum: remoteSkill.checksum,
          skill: remoteSkill,
        });
      } else if (localSkill.checksum !== remoteSkill.checksum) {
        // Skill modified
        changes.push({
          type: 'update',
          skill_id: remoteSkill.id,
          skill_name: remoteSkill.name,
          local_checksum: localSkill.checksum,
          remote_checksum: remoteSkill.checksum,
          skill: remoteSkill,
        });
      }
    }

    return changes;
  }

  /**
   * Apply a sync change
   */
  private async applyChange(
    change: SyncChange,
    sourceId: string,
    strategy: 'overwrite' | 'merge' | 'skip'
  ): Promise<{ type: 'added' | 'updated' | 'skipped' | 'conflict'; reason?: string; resolution?: string }> {
    if (!change.skill) {
      throw new Error('Change missing skill data');
    }

    if (change.type === 'add') {
      // Add new skill
      await this.addSkillToDatabase(change.skill, sourceId);
      await this.updateSyncState(change.skill_id, sourceId, change.skill.checksum);
      return { type: 'added' };
    }

    if (change.type === 'update') {
      // Check for conflicts
      const localSkill = await this.getLocalSkill(change.skill_id);
      if (!localSkill) {
        // No local skill, just add
        await this.addSkillToDatabase(change.skill, sourceId);
        await this.updateSyncState(change.skill_id, sourceId, change.skill.checksum);
        return { type: 'added' };
      }

      // Detect conflict
      const conflict = this.resolver.detectConflict(localSkill, change.skill);
      if (conflict) {
        // Resolve conflict
        const resolution = await this.resolver.resolve(conflict, strategy);

        if (resolution.error || resolution.action === 'skip') {
          return {
            type: 'skipped',
            reason: resolution.error || 'Conflict skipped',
          };
        }

        if (resolution.result) {
          await this.updateSkillInDatabase(resolution.result, sourceId);
          await this.updateSyncState(change.skill_id, sourceId, resolution.result.checksum);
        }

        return {
          type: 'conflict',
          reason: 'Conflict resolved',
          resolution: resolution.action,
        };
      }

      // No conflict, update
      await this.updateSkillInDatabase(change.skill, sourceId);
      await this.updateSyncState(change.skill_id, sourceId, change.skill.checksum);
      return { type: 'updated' };
    }

    return { type: 'skipped', reason: 'Unknown change type' };
  }

  /**
   * Get sources to sync based on parameters
   */
  private async getSourcesToSync(
    sourceFilter?: string
  ): Promise<Array<{ id: string; type: string; path?: string; repo?: string }>> {
    const sources = this.db.listSources(true); // enabledOnly = true

    if (sourceFilter) {
      const filtered = sources.filter(s => s.id === sourceFilter);
      return filtered.map(s => ({ id: s.id, type: s.type, path: s.path, repo: s.repo }));
    }

    return sources.map(s => ({ id: s.id, type: s.type, path: s.path, repo: s.repo }));
  }

  /**
   * Get local skills for a specific source
   */
  private async getLocalSkillsForSource(sourceId: string): Promise<Skill[]> {
    const source = this.db.getSource(sourceId);
    if (!source) {
      return [];
    }

    const dbSkills = this.db.listSkills({ sourceType: source.type });
    return dbSkills.map(s => this.dbSkillToSkill(s));
  }

  /**
   * Get a single local skill by ID
   */
  private async getLocalSkill(skillId: string): Promise<Skill | null> {
    const dbSkill = this.db.getSkill(skillId);
    return dbSkill ? this.dbSkillToSkill(dbSkill) : null;
  }

  /**
   * Get sync states for a source
   */
  private async getSyncStates(sourceId: string): Promise<SyncState[]> {
    return this.db.listSyncStates(sourceId);
  }

  /**
   * Get sync states synchronously (for detectChanges)
   */
  private getSyncStatesSync(sourceId: string): SyncState[] {
    return this.db.listSyncStates(sourceId);
  }

  /**
   * Update sync state for a skill
   */
  private async updateSyncState(skillId: string, sourceId: string, checksum: string): Promise<void> {
    this.db.upsertSyncState({ skill_id: skillId, source_id: sourceId, checksum });
  }

  /**
   * Add a skill to the database
   */
  private async addSkillToDatabase(skill: Skill, sourceId: string): Promise<void> {
    // Convert Skill to database format
    const dbSkill = this.skillToDbFormat(skill);
    this.db.upsertSkill(dbSkill);
    this.log.debug(`Added skill to database: ${skill.name}`);
  }

  /**
   * Update a skill in the database
   */
  private async updateSkillInDatabase(skill: Skill, sourceId: string): Promise<void> {
    // Convert Skill to database format
    const dbSkill = this.skillToDbFormat(skill);
    this.db.upsertSkill(dbSkill);
    this.log.debug(`Updated skill in database: ${skill.name}`);
  }

  /**
   * Convert Skill to database format
   */
  private skillToDbFormat(skill: Skill): Omit<DbSkill, 'created_at' | 'updated_at'> {
    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      content: skill.content,
      format: skill.format,
      source_type: skill.source.type,
      source_path: skill.source.path,
      source_repo: skill.source.repo,
      source_branch: skill.source.branch,
      source_commit: skill.source.commit,
      source_url: skill.source.url,
      metadata: skill.metadata,
      checksum: skill.checksum,
      embedding: skill.embedding ? Buffer.from(new Float64Array(skill.embedding).buffer) : undefined,
    };
  }

  /**
   * Convert database Skill to Skill format
   */
  private dbSkillToSkill(dbSkill: DbSkill): Skill {
    return {
      id: dbSkill.id,
      name: dbSkill.name,
      description: dbSkill.description,
      content: dbSkill.content,
      format: dbSkill.format,
      source: {
        type: dbSkill.source_type,
        path: dbSkill.source_path,
        repo: dbSkill.source_repo,
        branch: dbSkill.source_branch,
        commit: dbSkill.source_commit,
        url: dbSkill.source_url,
      },
      metadata: dbSkill.metadata,
      checksum: dbSkill.checksum,
      embedding: dbSkill.embedding ? Array.from(new Float64Array(dbSkill.embedding.buffer)) : undefined,
    };
  }

  /**
   * Log dry run changes
   */
  private logDryRunChanges(changes: SyncChange[]): void {
    this.log.info('[DRY RUN] Sync changes that would be applied:');
    for (const change of changes) {
      this.log.info(
        `  ${change.type.toUpperCase()}: ${change.skill_name} (${change.skill_id.substring(0, 8)}...)`
      );
    }
  }

  /**
   * Count changes by type
   */
  private countChanges(changes: SyncChange[]): SyncSkillsResult {
    const result: SyncSkillsResult = {
      added: 0,
      updated: 0,
      skipped: 0,
      conflicts: [],
    };

    for (const change of changes) {
      if (change.type === 'add') {
        result.added++;
      } else if (change.type === 'update') {
        result.updated++;
      }
    }

    return result;
  }
}

// Export singleton instance
export const syncEngine = new SyncEngine();
