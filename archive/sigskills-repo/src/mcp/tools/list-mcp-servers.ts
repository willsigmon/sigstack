/**
 * list_mcp_servers MCP Tool Handler
 *
 * Lists all configured MCP servers and their available tools.
 * Useful for discovering what tools are available.
 */

import { Logger } from '../../utils/logger.js';
import type { ToolHandler } from '../types.js';
import { MCPIndexer } from '../../indexer/mcp-indexer.js';
import type { SkillsDatabase } from '../../db/index.js';

const logger = new Logger({ prefix: 'list-mcp-servers' });

export interface ListMCPServersParams {
  server?: string; // Optional: filter by server name
}

export interface ListMCPServersResult {
  servers: Array<{
    name: string;
    tool_count: number;
    tools: Array<{
      name: string;
      description: string;
    }>;
  }>;
}

/**
 * List all configured MCP servers and their tools
 */
export const listMCPServersHandler: ToolHandler<ListMCPServersParams, ListMCPServersResult> = async (
  params
) => {
  logger.info('Listing MCP servers', params);

  // Get database from global context
  const db = (global as any).__sigskills_db as SkillsDatabase;
  if (!db) {
    throw new Error('Database not initialized');
  }

  const indexer = new MCPIndexer(db);

  try {
    const allTools = indexer.getAllTools();

    // Group by server
    const serverMap = new Map<string, Array<{ name: string; description: string }>>();

    for (const tool of allTools) {
      if (params.server && tool.server_name !== params.server) {
        continue;
      }

      if (!serverMap.has(tool.server_name)) {
        serverMap.set(tool.server_name, []);
      }

      serverMap.get(tool.server_name)!.push({
        name: tool.tool_name,
        description: tool.description,
      });
    }

    // Format result
    const servers = Array.from(serverMap.entries())
      .map(([name, tools]) => ({
        name,
        tool_count: tools.length,
        tools: tools.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    logger.info(`Found ${servers.length} MCP servers with ${allTools.length} total tools`);

    return { servers };
  } catch (error) {
    logger.error('Error listing MCP servers:', error);
    throw new Error(`Failed to list MCP servers: ${error}`);
  }
};

export default listMCPServersHandler;
