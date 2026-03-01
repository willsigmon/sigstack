/**
 * List Sources Tool Handler
 * Lists all configured skill sources with status and sync information
 */

import { getDatabase } from '../../db/index.js';
import { ListSourcesResult } from '../types.js';
import { logger } from '../../utils/logger.js';

const log = logger.child('list-sources');

interface SourceRow {
  id: string;
  type: 'local' | 'github' | 'codex' | 'custom';
  path: string | null;
  repo: string | null;
  branch: string | null;
  url: string | null;
  enabled: number; // SQLite boolean (0 or 1)
  skill_count: number;
  last_synced_at: number | null;
}

/**
 * List all configured skill sources
 */
export async function handleListSources(): Promise<ListSourcesResult> {
  const db = getDatabase();

  log.info('Listing all skill sources');

  try {
    // Query all sources
    const sql = `
      SELECT
        id,
        type,
        path,
        repo,
        branch,
        url,
        enabled,
        skill_count,
        last_synced_at
      FROM sources
      ORDER BY
        enabled DESC,
        type ASC,
        id ASC
    `;

    const results = db.query<SourceRow>(sql);

    log.info(`Found ${results.length} sources`);

    // Format results
    const sources = results.map((row) => {
      return {
        id: row.id,
        type: row.type,
        path: row.path || undefined,
        repo: row.repo || undefined,
        skill_count: row.skill_count,
        last_synced: row.last_synced_at
          ? new Date(row.last_synced_at * 1000)
          : undefined,
        enabled: row.enabled === 1,
      };
    });

    return {
      sources,
    };
  } catch (error) {
    log.error('Failed to list sources:', error);
    throw new Error(
      `Failed to list sources: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
