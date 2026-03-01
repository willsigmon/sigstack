/**
 * GitHub Database Adapter
 *
 * Bridges GitHub indexer/source manager with the database layer
 * Handles persistence of GitHub sources and skills
 */

import { createHash } from 'crypto';
import { SkillsDatabase, type Skill as DBSkill, type Source } from '../db/index.js';
import { GitHubSourceManager, type GitHubSource } from './github-source-manager.js';
import type { Skill } from '../mcp/types.js';
import { Logger } from '../utils/logger.js';

/**
 * Adapter for GitHub source and skill persistence
 */
export class GitHubDatabaseAdapter {
  private db: SkillsDatabase;
  private sourceManager: GitHubSourceManager;
  private logger: Logger;

  constructor(db: SkillsDatabase, sourceManager: GitHubSourceManager, logger?: Logger) {
    this.db = db;
    this.sourceManager = sourceManager;
    this.logger = logger || new Logger({ prefix: 'github-db-adapter' });
  }

  /**
   * Initialize adapter - load GitHub sources from database
   */
  async initialize(): Promise<void> {
    this.logger.info('Initializing GitHub database adapter');

    // Load sources from database
    const dbSources = this.db.listSources().filter((s) => s.type === 'github');

    // Convert to GitHubSource format
    const githubSources = dbSources.map((s) => this.dbSourceToGitHubSource(s));

    // Load into source manager
    this.sourceManager.loadSources(githubSources);

    this.logger.info(`Loaded ${githubSources.length} GitHub sources from database`);
  }

  /**
   * Persist a GitHub source to database
   */
  async persistSource(source: GitHubSource): Promise<void> {
    const dbSource: Omit<Source, 'created_at' | 'updated_at'> = {
      id: source.id,
      type: 'github',
      repo: `${source.owner}/${source.repo}`,
      branch: source.branch,
      config: {
        autoSync: source.config.autoSync,
        syncInterval: source.config.syncInterval,
        watchBranch: source.config.watchBranch,
        auth: source.auth,
        skillPaths: source.skillPaths,
        tag: source.tag,
        commit: source.commit,
        lastSyncCommit: source.lastSyncCommit,
      } as any,
      enabled: source.enabled,
      skill_count: source.skillCount,
      last_synced_at: source.lastSyncedAt
        ? Math.floor(source.lastSyncedAt.getTime() / 1000)
        : undefined,
    };

    this.db.upsertSource(dbSource);
    this.logger.debug(`Persisted GitHub source: ${source.id}`);
  }

  /**
   * Delete a GitHub source from database
   */
  async deleteSource(sourceId: string): Promise<void> {
    // Delete associated skills first (via sync_state cascade)
    const syncStates = this.db.listSyncStates(sourceId);
    for (const state of syncStates) {
      this.db.deleteSkill(state.skill_id);
    }

    // Delete source
    this.db.deleteSource(sourceId);
    this.logger.info(`Deleted GitHub source: ${sourceId}`);
  }

  /**
   * Persist skills from GitHub source to database
   */
  async persistSkills(sourceId: string, skills: Skill[]): Promise<void> {
    this.logger.info(`Persisting ${skills.length} skills for source ${sourceId}`);

    const transaction = this.db.transaction(() => {
      for (const skill of skills) {
        // Convert to DB skill format
        const dbSkill = this.mcpSkillToDBSkill(skill);

        // Upsert skill
        this.db.upsertSkill(dbSkill);

        // Update sync state
        this.db.upsertSyncState({
          skill_id: skill.id,
          source_id: sourceId,
          checksum: skill.checksum,
        });
      }

      // Update source skill count
      this.db.updateSourceSkillCount(sourceId);
    });

    this.logger.info(`Persisted ${skills.length} skills for source ${sourceId}`);
  }

  /**
   * Get skills for a GitHub source
   */
  async getSkillsForSource(sourceId: string): Promise<Skill[]> {
    const source = this.db.getSource(sourceId);
    if (!source || source.type !== 'github') {
      return [];
    }

    const dbSkills = this.db.listSkills({ sourceType: 'github' });

    // Filter skills that belong to this source
    const syncStates = this.db.listSyncStates(sourceId);
    const skillIds = new Set(syncStates.map((s) => s.skill_id));

    return dbSkills
      .filter((s) => skillIds.has(s.id))
      .map((s) => this.dbSkillToMCPSkill(s));
  }

  /**
   * Check if skills have changed (checksum comparison)
   */
  async detectChanges(
    sourceId: string,
    newSkills: Skill[]
  ): Promise<{
    added: Skill[];
    updated: Skill[];
    unchanged: Skill[];
    removed: string[];
  }> {
    const syncStates = this.db.listSyncStates(sourceId);
    const existingSkills = new Map(syncStates.map((s) => [s.skill_id, s.checksum]));
    const newSkillIds = new Set(newSkills.map((s) => s.id));

    const added: Skill[] = [];
    const updated: Skill[] = [];
    const unchanged: Skill[] = [];

    for (const skill of newSkills) {
      const existingChecksum = existingSkills.get(skill.id);

      if (!existingChecksum) {
        added.push(skill);
      } else if (existingChecksum !== skill.checksum) {
        updated.push(skill);
      } else {
        unchanged.push(skill);
      }
    }

    // Find removed skills
    const removed: string[] = [];
    for (const skillId of Array.from(existingSkills.keys())) {
      if (!newSkillIds.has(skillId)) {
        removed.push(skillId);
      }
    }

    return { added, updated, unchanged, removed };
  }

  /**
   * Sync all GitHub sources
   */
  async syncAllSources(): Promise<void> {
    this.logger.info('Syncing all GitHub sources');

    const results = await this.sourceManager.syncAllSources(
      async (sourceId, skills) => {
        await this.persistSkills(sourceId, skills);

        // Persist updated source metadata
        const source = this.sourceManager.getSource(sourceId);
        if (source) {
          await this.persistSource(source);
        }
      }
    );

    const totalSkills = results.reduce((sum, r) => sum + r.skillsAdded, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

    this.logger.info(`Sync complete: ${totalSkills} skills indexed, ${totalErrors} errors`);
  }

  /**
   * Sync a specific source
   */
  async syncSource(sourceId: string): Promise<void> {
    this.logger.info(`Syncing GitHub source: ${sourceId}`);

    const result = await this.sourceManager.syncSource(sourceId, async (skills) => {
      // Detect changes
      const changes = await this.detectChanges(sourceId, skills);

      this.logger.info(
        `Changes detected: ${changes.added.length} added, ${changes.updated.length} updated, ${changes.removed.length} removed`
      );

      // Persist new/updated skills
      await this.persistSkills(sourceId, [...changes.added, ...changes.updated]);

      // Remove deleted skills
      for (const skillId of changes.removed) {
        this.db.deleteSkill(skillId);
        this.db.deleteSyncState(skillId, sourceId);
      }

      // Persist updated source metadata
      const source = this.sourceManager.getSource(sourceId);
      if (source) {
        await this.persistSource(source);
      }
    });

    this.logger.info(`Sync complete: ${result.skillsAdded} skills indexed`);
  }

  // ============================================================================
  // Conversion Helpers
  // ============================================================================

  /**
   * Convert database source to GitHubSource
   */
  private dbSourceToGitHubSource(source: Source): GitHubSource {
    const [owner, repo] = (source.repo || '').split('/');
    const config = source.config as any;

    return {
      id: source.id,
      owner: owner || '',
      repo: repo || '',
      branch: source.branch,
      tag: config.tag,
      commit: config.commit,
      skillPaths: config.skillPaths,
      auth: config.auth,
      enabled: source.enabled,
      lastSyncedAt: source.last_synced_at
        ? new Date(source.last_synced_at * 1000)
        : undefined,
      lastSyncCommit: config.lastSyncCommit,
      skillCount: source.skill_count,
      config: {
        autoSync: config.autoSync || false,
        syncInterval: config.syncInterval || 60,
        watchBranch: config.watchBranch !== false,
      },
    };
  }

  /**
   * Convert MCP skill to database skill
   */
  private mcpSkillToDBSkill(skill: Skill): Omit<DBSkill, 'created_at' | 'updated_at'> {
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
      last_synced_at: Math.floor(Date.now() / 1000),
    };
  }

  /**
   * Convert database skill to MCP skill
   */
  private dbSkillToMCPSkill(skill: DBSkill): Skill {
    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      content: skill.content,
      source: {
        type: skill.source_type,
        path: skill.source_path,
        repo: skill.source_repo,
        branch: skill.source_branch,
        commit: skill.source_commit,
        url: skill.source_url,
      },
      format: skill.format,
      metadata: skill.metadata,
      checksum: skill.checksum,
    };
  }

  /**
   * Export GitHub sources for backup/export
   */
  exportSources(): GitHubSource[] {
    return this.sourceManager.exportSources();
  }

  /**
   * Get database instance
   */
  getDatabase(): SkillsDatabase {
    return this.db;
  }

  /**
   * Get source manager instance
   */
  getSourceManager(): GitHubSourceManager {
    return this.sourceManager;
  }
}
