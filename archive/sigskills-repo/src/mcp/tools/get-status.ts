/**
 * Get Status Tool Handler
 * Returns basic server and database health information
 */

import { getDatabase } from '../../db/index.js';
import { GetStatusParamsSchema, GetStatusResult } from '../types.js';
import { logger } from '../../utils/logger.js';
import { ConfigManager } from '../../config.js';

const log = logger.child('get-status');

interface CountRow {
  count: number;
}

/**
 * Get basic server status and DB counts
 */
export async function handleGetStatus(params: unknown): Promise<GetStatusResult> {
  GetStatusParamsSchema.parse(params ?? {});
  const db = getDatabase();
  const config = ConfigManager.getInstance();

  log.info('Fetching server status');

  const skills = db.queryOne<CountRow>('SELECT COUNT(*) AS count FROM skills');
  const sources = db.queryOne<CountRow>('SELECT COUNT(*) AS count FROM sources');
  const sourcesEnabled = db.queryOne<CountRow>(
    'SELECT COUNT(*) AS count FROM sources WHERE enabled = 1'
  );
  const mcpTools = db.queryOne<CountRow>('SELECT COUNT(*) AS count FROM mcp_tools');

  return {
    db_path: config.getDbPath(),
    uptime_seconds: Math.floor(process.uptime()),
    skills_total: skills?.count ?? 0,
    sources_total: sources?.count ?? 0,
    sources_enabled: sourcesEnabled?.count ?? 0,
    mcp_tools_total: mcpTools?.count ?? 0,
  };
}
