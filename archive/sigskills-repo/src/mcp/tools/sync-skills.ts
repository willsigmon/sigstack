/**
 * Sync Skills Tool Handler
 * Handles bi-directional sync between local and remote skill sources
 */

import { getDatabase } from '../../db/index.js';
import {
  SyncSkillsParams,
  SyncSkillsParamsSchema,
  SyncSkillsResult,
  SyncConflictError,
} from '../types.js';
import { logger } from '../../utils/logger.js';
import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';

const log = logger.child('sync-skills');

interface SyncState {
  skill_id: string;
  source_id: string;
  checksum: string;
  synced_at: number;
}

interface SourceRow {
  id: string;
  type: string;
  path: string | null;
  repo: string | null;
  branch: string | null;
  enabled: number;
}

interface SkillRow {
  id: string;
  name: string;
  content: string;
  checksum: string;
  source_type: string;
  source_path: string | null;
}

/**
 * Sync skills between local and remote sources
 */
export async function handleSyncSkills(
  params: unknown
): Promise<SyncSkillsResult> {
  const validated = SyncSkillsParamsSchema.parse(params);
  const db = getDatabase();

  log.info(`Starting skill sync: ${validated.direction || 'pull'}`);

  // Get sources to sync
  const sources = await getSourcesToSync(db, validated.source);

  if (sources.length === 0) {
    log.warn('No sources found to sync');
    return {
      added: 0,
      updated: 0,
      skipped: 0,
      conflicts: [],
    };
  }

  let totalAdded = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  const allConflicts: SyncSkillsResult['conflicts'] = [];

  // Sync each source
  for (const source of sources) {
    try {
      const result = await syncSource(db, source, validated);
      totalAdded += result.added;
      totalUpdated += result.updated;
      totalSkipped += result.skipped;
      allConflicts.push(...result.conflicts);
    } catch (error) {
      log.error(`Failed to sync source ${source.id}:`, error);
      allConflicts.push({
        skill: source.id,
        reason: `Source sync failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  log.info(
    `Sync complete: ${totalAdded} added, ${totalUpdated} updated, ${totalSkipped} skipped, ${allConflicts.length} conflicts`
  );

  return {
    added: totalAdded,
    updated: totalUpdated,
    skipped: totalSkipped,
    conflicts: allConflicts,
  };
}

/**
 * Get sources to sync based on parameters
 */
async function getSourcesToSync(
  db: ReturnType<typeof getDatabase>,
  sourceId?: string
): Promise<SourceRow[]> {
  let sql = 'SELECT id, type, path, repo, branch, enabled FROM sources WHERE enabled = 1';
  const params: any[] = [];

  if (sourceId) {
    sql += ' AND id = ?';
    params.push(sourceId);
  }

  return db.query<SourceRow>(sql, params);
}

/**
 * Sync a single source
 */
async function syncSource(
  db: ReturnType<typeof getDatabase>,
  source: SourceRow,
  params: SyncSkillsParams
): Promise<SyncSkillsResult> {
  log.info(`Syncing source: ${source.type} - ${source.path || source.repo}`);

  const result: SyncSkillsResult = {
    added: 0,
    updated: 0,
    skipped: 0,
    conflicts: [],
  };

  switch (source.type) {
    case 'local':
      return await syncLocalSource(db, source, params);

    case 'github':
      return await syncGithubSource(db, source, params);

    case 'codex':
      return await syncCodexSource(db, source, params);

    default:
      log.warn(`Unsupported source type: ${source.type}`);
      return result;
  }
}

/**
 * Sync local file system source
 */
async function syncLocalSource(
  db: ReturnType<typeof getDatabase>,
  source: SourceRow,
  params: SyncSkillsParams
): Promise<SyncSkillsResult> {
  const result: SyncSkillsResult = {
    added: 0,
    updated: 0,
    skipped: 0,
    conflicts: [],
  };

  if (!source.path) {
    throw new Error('Local source missing path');
  }

  if (params.direction === 'pull' || params.direction === 'both') {
    // Pull: Local filesystem → Database
    // This is handled by the indexer, so we just trigger a re-index
    log.info(`Pull sync for local source not implemented - use update_skills instead`);
  }

  if (params.direction === 'push' || params.direction === 'both') {
    // Push: Database → Local filesystem
    const skills = await getSkillsForSource(db, source.id);

    for (const skill of skills) {
      try {
        if (params.dry_run) {
          log.info(`[DRY RUN] Would write skill ${skill.name} to ${skill.source_path}`);
          continue;
        }

        // Check for conflicts
        const conflict = await checkForConflict(db, skill, source, params.strategy);
        if (conflict) {
          result.conflicts.push(conflict);
          result.skipped++;
          continue;
        }

        // Write skill to file
        if (skill.source_path) {
          writeFileSync(skill.source_path, skill.content, 'utf-8');

          // Update sync state
          await updateSyncState(db, skill.id, source.id, skill.checksum);

          result.updated++;
          log.debug(`Pushed skill ${skill.name} to ${skill.source_path}`);
        } else {
          log.warn(`Skill ${skill.name} has no source path, skipping`);
          result.skipped++;
        }
      } catch (error) {
        log.error(`Failed to push skill ${skill.name}:`, error);
        result.conflicts.push({
          skill: skill.name,
          reason: `Write failed: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }
  }

  return result;
}

/**
 * Sync GitHub repository source
 */
async function syncGithubSource(
  db: ReturnType<typeof getDatabase>,
  source: SourceRow,
  params: SyncSkillsParams
): Promise<SyncSkillsResult> {
  // GitHub sync requires Octokit integration
  // For now, return placeholder
  log.warn('GitHub sync not yet implemented');

  return {
    added: 0,
    updated: 0,
    skipped: 0,
    conflicts: [
      {
        skill: source.repo || 'unknown',
        reason: 'GitHub sync not yet implemented',
      },
    ],
  };
}

/**
 * Sync Codex CLI source
 */
async function syncCodexSource(
  db: ReturnType<typeof getDatabase>,
  source: SourceRow,
  params: SyncSkillsParams
): Promise<SyncSkillsResult> {
  // Codex sync requires Codex CLI integration
  // For now, return placeholder
  log.warn('Codex sync not yet implemented');

  return {
    added: 0,
    updated: 0,
    skipped: 0,
    conflicts: [
      {
        skill: source.path || 'unknown',
        reason: 'Codex sync not yet implemented',
      },
    ],
  };
}

/**
 * Get skills for a specific source
 */
async function getSkillsForSource(
  db: ReturnType<typeof getDatabase>,
  sourceId: string
): Promise<SkillRow[]> {
  const sql = `
    SELECT s.id, s.name, s.content, s.checksum, s.source_type, s.source_path
    FROM skills s
    INNER JOIN sync_state ss ON s.id = ss.skill_id
    WHERE ss.source_id = ?
  `;

  return db.query<SkillRow>(sql, [sourceId]);
}

/**
 * Check for sync conflicts
 */
async function checkForConflict(
  db: ReturnType<typeof getDatabase>,
  skill: SkillRow,
  source: SourceRow,
  strategy: string = 'merge'
): Promise<SyncSkillsResult['conflicts'][0] | null> {
  // Check if file exists and has been modified
  if (!skill.source_path) {
    return null;
  }

  try {
    const fileContent = readFileSync(skill.source_path, 'utf-8');
    const fileChecksum = createHash('sha256').update(fileContent).digest('hex');

    // Get last synced checksum
    const syncState = db.queryOne<SyncState>(
      'SELECT checksum FROM sync_state WHERE skill_id = ? AND source_id = ?',
      [skill.id, source.id]
    );

    if (!syncState) {
      // No sync state, consider it new
      return null;
    }

    // Check if file has been modified since last sync
    if (fileChecksum !== syncState.checksum && fileChecksum !== skill.checksum) {
      // Conflict: both database and file have been modified
      if (strategy === 'skip') {
        return {
          skill: skill.name,
          reason: 'File modified locally, database modified remotely',
          resolution: 'Skipped due to strategy',
        };
      }

      if (strategy === 'overwrite') {
        return null; // Allow overwrite
      }

      // TODO: Implement merge strategy
      return {
        skill: skill.name,
        reason: 'File modified locally, database modified remotely',
        resolution: 'Merge strategy not yet implemented',
      };
    }

    return null;
  } catch (error) {
    // File doesn't exist, no conflict
    return null;
  }
}

/**
 * Update sync state after successful sync
 */
async function updateSyncState(
  db: ReturnType<typeof getDatabase>,
  skillId: string,
  sourceId: string,
  checksum: string
): Promise<void> {
  const sql = `
    INSERT INTO sync_state (skill_id, source_id, checksum, synced_at)
    VALUES (?, ?, ?, unixepoch())
    ON CONFLICT(skill_id, source_id) DO UPDATE SET
      checksum = excluded.checksum,
      synced_at = excluded.synced_at
  `;

  db.execute(sql, [skillId, sourceId, checksum]);
}
