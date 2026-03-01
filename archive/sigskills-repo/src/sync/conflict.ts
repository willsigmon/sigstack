/**
 * Conflict resolution for bi-directional sync
 * Handles cases where both local and remote skills have changed
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { logger } from '../utils/logger.js';
import type { Skill } from '../types/skill.js';

export interface Conflict {
  skill_id: string;
  skill_name: string;
  local_checksum: string;
  remote_checksum: string;
  local_updated_at: Date;
  remote_updated_at: Date;
  local_skill?: Skill;
  remote_skill?: Skill;
  reason: string;
}

export interface ConflictResolution {
  skill_id: string;
  action: 'use_local' | 'use_remote' | 'merge' | 'skip' | 'backup';
  result?: Skill;
  backup_path?: string;
  error?: string;
}

export type ConflictStrategy = 'overwrite' | 'merge' | 'skip' | 'backup' | 'newest' | 'manual';

export class ConflictResolver {
  private log = logger.child('conflict');
  private backupDir: string;

  constructor(backupDir?: string) {
    this.backupDir = backupDir || join(process.env.HOME || '~', '.sigskills', 'backups');
  }

  /**
   * Detect conflicts between local and remote skills
   */
  detectConflict(local: Skill, remote: Skill): Conflict | null {
    // No conflict if checksums match
    if (local.checksum === remote.checksum) {
      return null;
    }

    // Check if both have been modified since last sync
    const localUpdated = new Date(local.metadata.updated_at);
    const remoteUpdated = new Date(remote.metadata.updated_at);

    // If one is clearly newer and the other hasn't been modified, no conflict
    const timeDiff = Math.abs(localUpdated.getTime() - remoteUpdated.getTime());
    if (timeDiff < 1000) {
      // Less than 1 second difference, likely same update
      return null;
    }

    return {
      skill_id: local.id,
      skill_name: local.name,
      local_checksum: local.checksum,
      remote_checksum: remote.checksum,
      local_updated_at: localUpdated,
      remote_updated_at: remoteUpdated,
      local_skill: local,
      remote_skill: remote,
      reason: 'Both local and remote have been modified',
    };
  }

  /**
   * Resolve a conflict using the specified strategy
   */
  async resolve(
    conflict: Conflict,
    strategy: ConflictStrategy
  ): Promise<ConflictResolution> {
    this.log.info(`Resolving conflict for skill ${conflict.skill_name} using strategy: ${strategy}`);

    try {
      switch (strategy) {
        case 'overwrite':
          return await this.resolveOverwrite(conflict);
        case 'merge':
          return await this.resolveMerge(conflict);
        case 'skip':
          return this.resolveSkip(conflict);
        case 'backup':
          return await this.resolveBackup(conflict);
        case 'newest':
          return await this.resolveNewest(conflict);
        case 'manual':
          return this.resolveManual(conflict);
        default:
          throw new Error(`Unknown conflict strategy: ${strategy}`);
      }
    } catch (error) {
      this.log.error(`Failed to resolve conflict for ${conflict.skill_name}:`, error);
      return {
        skill_id: conflict.skill_id,
        action: 'skip',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Overwrite: Use remote version, backup local
   */
  private async resolveOverwrite(conflict: Conflict): Promise<ConflictResolution> {
    if (!conflict.local_skill || !conflict.remote_skill) {
      throw new Error('Missing skill data for overwrite resolution');
    }

    // Backup local version first
    const backupPath = await this.backupSkill(conflict.local_skill);

    return {
      skill_id: conflict.skill_id,
      action: 'use_remote',
      result: conflict.remote_skill,
      backup_path: backupPath,
    };
  }

  /**
   * Merge: Combine local and remote changes (simple field-level merge)
   */
  private async resolveMerge(conflict: Conflict): Promise<ConflictResolution> {
    if (!conflict.local_skill || !conflict.remote_skill) {
      throw new Error('Missing skill data for merge resolution');
    }

    const local = conflict.local_skill;
    const remote = conflict.remote_skill;

    // Simple merge strategy: prefer newer content, combine metadata
    const merged: Skill = {
      ...local,
      // Use remote content if it's newer
      content:
        conflict.remote_updated_at > conflict.local_updated_at ? remote.content : local.content,
      description:
        conflict.remote_updated_at > conflict.local_updated_at
          ? remote.description
          : local.description,
      // Merge metadata
      metadata: {
        ...local.metadata,
        ...remote.metadata,
        // Combine tags (unique)
        tags: Array.from(
          new Set([...(local.metadata.tags || []), ...(remote.metadata.tags || [])])
        ),
        // Combine dependencies (unique)
        dependencies: Array.from(
          new Set([
            ...(local.metadata.dependencies || []),
            ...(remote.metadata.dependencies || []),
          ])
        ),
        // Combine mcp_tools (unique)
        mcp_tools: Array.from(
          new Set([...(local.metadata.mcp_tools || []), ...(remote.metadata.mcp_tools || [])])
        ),
        // Use latest timestamp
        updated_at:
          conflict.remote_updated_at > conflict.local_updated_at
            ? remote.metadata.updated_at
            : local.metadata.updated_at,
      },
      // Update checksum to reflect merged content
      checksum: this.generateChecksum(
        conflict.remote_updated_at > conflict.local_updated_at ? remote.content : local.content
      ),
    };

    // Backup local version before merge
    const backupPath = await this.backupSkill(local);

    return {
      skill_id: conflict.skill_id,
      action: 'merge',
      result: merged,
      backup_path: backupPath,
    };
  }

  /**
   * Skip: Leave local as-is, don't sync
   */
  private resolveSkip(conflict: Conflict): ConflictResolution {
    this.log.warn(`Skipping conflict for skill ${conflict.skill_name}`);
    return {
      skill_id: conflict.skill_id,
      action: 'skip',
    };
  }

  /**
   * Backup: Create backup and use remote
   */
  private async resolveBackup(conflict: Conflict): Promise<ConflictResolution> {
    if (!conflict.local_skill || !conflict.remote_skill) {
      throw new Error('Missing skill data for backup resolution');
    }

    const backupPath = await this.backupSkill(conflict.local_skill);

    return {
      skill_id: conflict.skill_id,
      action: 'backup',
      result: conflict.remote_skill,
      backup_path: backupPath,
    };
  }

  /**
   * Newest: Use whichever skill was updated most recently
   */
  private async resolveNewest(conflict: Conflict): Promise<ConflictResolution> {
    if (!conflict.local_skill || !conflict.remote_skill) {
      throw new Error('Missing skill data for newest resolution');
    }

    const useRemote = conflict.remote_updated_at > conflict.local_updated_at;
    const backupPath = useRemote ? await this.backupSkill(conflict.local_skill) : undefined;

    return {
      skill_id: conflict.skill_id,
      action: useRemote ? 'use_remote' : 'use_local',
      result: useRemote ? conflict.remote_skill : conflict.local_skill,
      backup_path: backupPath,
    };
  }

  /**
   * Manual: Return conflict for user resolution
   */
  private resolveManual(conflict: Conflict): ConflictResolution {
    this.log.warn(`Conflict for skill ${conflict.skill_name} requires manual resolution`);
    return {
      skill_id: conflict.skill_id,
      action: 'skip',
      error: 'Manual resolution required - conflict details logged',
    };
  }

  /**
   * Backup a skill to the backup directory
   */
  private async backupSkill(skill: Skill): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${skill.name}-${timestamp}.json`;
    const backupPath = join(this.backupDir, filename);

    // Ensure backup directory exists
    mkdirSync(dirname(backupPath), { recursive: true });

    // Write skill as JSON
    const backupData = {
      ...skill,
      metadata: {
        ...skill.metadata,
        created_at: skill.metadata.created_at.toISOString(),
        updated_at: skill.metadata.updated_at.toISOString(),
        last_used: skill.metadata.last_used?.toISOString(),
      },
    };

    writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
    this.log.info(`Backed up skill ${skill.name} to ${backupPath}`);

    return backupPath;
  }

  /**
   * Generate checksum for content
   */
  private generateChecksum(content: string): string {
    const { createHash } = require('crypto');
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Batch resolve multiple conflicts
   */
  async resolveAll(
    conflicts: Conflict[],
    strategy: ConflictStrategy
  ): Promise<ConflictResolution[]> {
    this.log.info(`Resolving ${conflicts.length} conflicts with strategy: ${strategy}`);

    const resolutions = await Promise.all(
      conflicts.map((conflict) => this.resolve(conflict, strategy))
    );

    const successful = resolutions.filter((r) => !r.error).length;
    const failed = resolutions.filter((r) => r.error).length;

    this.log.info(`Resolved ${successful} conflicts, ${failed} failed`);

    return resolutions;
  }

  /**
   * Get conflict summary for logging/display
   */
  getConflictSummary(conflict: Conflict): string {
    return [
      `Skill: ${conflict.skill_name}`,
      `Reason: ${conflict.reason}`,
      `Local updated: ${conflict.local_updated_at.toISOString()}`,
      `Remote updated: ${conflict.remote_updated_at.toISOString()}`,
      `Local checksum: ${conflict.local_checksum.substring(0, 8)}...`,
      `Remote checksum: ${conflict.remote_checksum.substring(0, 8)}...`,
    ].join('\n');
  }
}

// Export singleton instance
export const conflictResolver = new ConflictResolver();
