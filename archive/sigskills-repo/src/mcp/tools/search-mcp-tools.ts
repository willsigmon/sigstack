/**
 * Search MCP Tools Handler
 * Searches indexed MCP tools across all configured servers
 */

import { getDatabase } from '../../db/index.js';
import {
  SearchMCPToolsParams,
  SearchMCPToolsParamsSchema,
  SearchMCPToolsResult,
} from '../types.js';
import { logger } from '../../utils/logger.js';

const log = logger.child('search-mcp-tools');

interface MCPToolRow {
  id: string;
  server_name: string;
  tool_name: string;
  description: string;
  parameters: string; // JSON
  source: string;
  score: number;
}

/**
 * Search MCP tools using FTS5 keyword search
 */
export async function handleSearchMCPTools(
  params: unknown
): Promise<SearchMCPToolsResult> {
  const validated = SearchMCPToolsParamsSchema.parse(params);
  const db = getDatabase();

  log.info(`Searching MCP tools: "${validated.query}"`);

  // Build FTS5 query
  const ftsQuery = buildFTS5Query(validated.query);

  // Build WHERE clause for filters
  const filters: string[] = [];
  const filterParams: any[] = [];

  // Filter by server
  if (validated.server) {
    filters.push('t.server_name = ?');
    filterParams.push(validated.server);
  }

  // Filter by capability (search in description)
  if (validated.capability) {
    filters.push('t.description LIKE ?');
    filterParams.push(`%${validated.capability}%`);
  }

  const whereClause = filters.length > 0 ? `AND ${filters.join(' AND ')}` : '';

  // Execute FTS5 search
  const sql = `
    SELECT
      t.id,
      t.server_name,
      t.tool_name,
      t.description,
      t.parameters,
      t.source,
      fts.rank AS score
    FROM mcp_tools_fts fts
    INNER JOIN mcp_tools t ON t.rowid = fts.rowid
    WHERE mcp_tools_fts MATCH ?
    ${whereClause}
    ORDER BY fts.rank ASC
    LIMIT 50
  `;

  const params_array = [ftsQuery, ...filterParams];

  try {
    const results = db.query<MCPToolRow>(sql, params_array);

    log.info(`Found ${results.length} MCP tools matching query`);

    // Format results
    const tools = results.map((row) => {
      // Parse parameters JSON
      let parameters: object = {};
      try {
        parameters = JSON.parse(row.parameters);
      } catch (error) {
        log.warn(`Failed to parse parameters for tool ${row.tool_name}`);
      }

      return {
        server: row.server_name,
        tool: row.tool_name,
        description: row.description,
        parameters,
        example_usage: generateExampleUsage(row.server_name, row.tool_name, parameters),
      };
    });

    return {
      tools,
    };
  } catch (error) {
    log.error('MCP tool search failed:', error);
    throw new Error(
      `MCP tool search failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Build FTS5 query from user input
 */
function buildFTS5Query(query: string): string {
  // Escape special FTS5 characters
  let escaped = query.replace(/['"]/g, '');

  // Split into words and create phrase query
  const words = escaped.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word - use prefix matching
    return `${words[0]}*`;
  }

  // Multi-word - search for words with OR
  const wordQuery = words.map((w) => `${w}*`).join(' OR ');
  const phraseQuery = `"${words.join(' ')}"`;

  return `(${phraseQuery}) OR (${wordQuery})`;
}

/**
 * Generate example usage for an MCP tool
 */
function generateExampleUsage(
  server: string,
  tool: string,
  parameters: object
): string | undefined {
  // Generate simple example based on common patterns
  const paramNames = Object.keys(parameters);

  if (paramNames.length === 0) {
    return `mcp__${server}__${tool}()`;
  }

  // Create example with placeholder values
  const exampleParams = paramNames
    .slice(0, 3) // Show max 3 params in example
    .map((param) => {
      // Infer placeholder from parameter name
      if (param.toLowerCase().includes('query')) {
        return `${param}: "search term"`;
      } else if (param.toLowerCase().includes('id')) {
        return `${param}: "123"`;
      } else if (param.toLowerCase().includes('path') || param.toLowerCase().includes('file')) {
        return `${param}: "/path/to/file"`;
      } else if (param.toLowerCase().includes('url')) {
        return `${param}: "https://example.com"`;
      } else {
        return `${param}: "value"`;
      }
    })
    .join(', ');

  return `mcp__${server}__${tool}({ ${exampleParams} })`;
}
