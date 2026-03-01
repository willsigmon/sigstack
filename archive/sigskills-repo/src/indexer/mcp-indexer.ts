/**
 * MCP Tool Indexer
 *
 * Discovers and indexes MCP tools from configured servers:
 * - Parses MCP client configs (~/.config/claude-code/mcp_settings.json, etc.)
 * - Introspects MCP servers to extract available tools
 * - Stores tool schemas and metadata in database
 * - Supports stdio, SSE, and HTTP MCP server types
 * - Tracks skill dependencies on MCP tools
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { createHash } from 'crypto';
import { homedir } from 'os';
import { Logger } from '../utils/logger.js';
import type { SkillsDatabase } from '../db/index.js';

const logger = new Logger({ prefix: 'mcp-indexer' });

// ============================================================================
// Types
// ============================================================================

export interface MCPServerConfig {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  transport?: 'stdio' | 'sse' | 'http';
}

export interface MCPClientConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

export interface MCPToolSchema {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, any>;
    required?: string[];
    [key: string]: any;
  };
}

export interface MCPListToolsResponse {
  tools: MCPToolSchema[];
}

export interface IndexedMCPTool {
  id: string;
  server_name: string;
  tool_name: string;
  description: string;
  parameters: string; // JSON string
  source: string;
}

// ============================================================================
// MCP Config Locations
// ============================================================================

const MCP_CONFIG_PATHS = [
  // Claude Code
  '~/.config/claude-code/mcp_settings.json',
  '~/.config/claude/mcp.json',

  // Codex CLI
  '~/.config/codex/mcp.json',

  // Perplexity
  '~/.config/perplexity/mcp_settings.json',
  '~/.config/perplexity/mcp.json',

  // Warp
  '~/.config/warp/mcp_settings.json',
  '~/.config/warp/mcp.json',

  // Custom
  '~/.mcp/config.json',
];

// ============================================================================
// MCPIndexer Class
// ============================================================================

export class MCPIndexer {
  private db: SkillsDatabase;
  private configPaths: string[];

  constructor(db: SkillsDatabase, customConfigPaths?: string[]) {
    this.db = db;
    this.configPaths = customConfigPaths || MCP_CONFIG_PATHS;
  }

  /**
   * Index all MCP tools from all configured servers
   */
  async indexAll(): Promise<{ indexed: number; errors: string[] }> {
    logger.info('Starting MCP tool indexing...');

    let totalIndexed = 0;
    const errors: string[] = [];

    // Discover all MCP configs
    const configs = await this.discoverConfigs();
    logger.info(`Found ${configs.length} MCP config files`);

    // Index each config
    for (const { path: configPath, config } of configs) {
      try {
        const count = await this.indexConfig(configPath, config);
        totalIndexed += count;
        logger.info(`Indexed ${count} tools from ${configPath}`);
      } catch (error) {
        const errorMsg = `Failed to index ${configPath}: ${error}`;
        logger.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    logger.info(`MCP indexing complete: ${totalIndexed} tools indexed`);
    return { indexed: totalIndexed, errors };
  }

  /**
   * Discover all MCP config files
   */
  private async discoverConfigs(): Promise<Array<{ path: string; config: MCPClientConfig }>> {
    const configs: Array<{ path: string; config: MCPClientConfig }> = [];

    for (const configPath of this.configPaths) {
      const expandedPath = this.expandPath(configPath);

      try {
        const exists = await this.fileExists(expandedPath);
        if (!exists) {
          logger.debug(`Config not found: ${expandedPath}`);
          continue;
        }

        const content = await fs.readFile(expandedPath, 'utf-8');
        const config = JSON.parse(content) as MCPClientConfig;

        if (!config.mcpServers || typeof config.mcpServers !== 'object') {
          logger.warn(`Invalid config format in ${expandedPath}`);
          continue;
        }

        configs.push({ path: expandedPath, config });
        logger.debug(`Loaded config: ${expandedPath}`);
      } catch (error) {
        logger.debug(`Error reading ${expandedPath}: ${error}`);
      }
    }

    return configs;
  }

  /**
   * Index tools from a single config file
   */
  private async indexConfig(configPath: string, config: MCPClientConfig): Promise<number> {
    let indexed = 0;

    for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
      try {
        logger.debug(`Introspecting server: ${serverName}`);
        const tools = await this.introspectServer(serverName, serverConfig);

        for (const tool of tools) {
          this.storeToolInDB(serverName, tool, configPath);
          indexed++;
        }

        logger.debug(`Indexed ${tools.length} tools from ${serverName}`);
      } catch (error) {
        logger.error(`Failed to introspect ${serverName}: ${error}`);
      }
    }

    return indexed;
  }

  /**
   * Introspect an MCP server to discover its tools
   *
   * Note: Full introspection requires spawning the server process or making HTTP requests.
   * For MVP, we'll support:
   * 1. HTTP/SSE servers (via URL introspection)
   * 2. Known server patterns (hardcoded tool schemas)
   * 3. Manual tool registration
   */
  private async introspectServer(
    serverName: string,
    config: MCPServerConfig
  ): Promise<MCPToolSchema[]> {
    // Determine transport type
    const transport = this.detectTransport(config);

    switch (transport) {
      case 'http':
      case 'sse':
        return this.introspectHTTPServer(config.url!);

      case 'stdio':
        // For stdio servers, we need to spawn the process
        // This is more complex and requires proper MCP protocol handling
        // For MVP, return known tools or empty array
        return this.getKnownServerTools(serverName);

      default:
        logger.warn(`Unknown transport type for ${serverName}`);
        return [];
    }
  }

  /**
   * Detect transport type from server config
   */
  private detectTransport(config: MCPServerConfig): 'stdio' | 'sse' | 'http' | 'unknown' {
    if (config.url) {
      // URLs typically indicate HTTP or SSE transport
      return 'sse'; // Most remote MCP servers use SSE
    }

    if (config.command || config.args) {
      return 'stdio';
    }

    return 'unknown';
  }

  /**
   * Introspect HTTP/SSE MCP server
   *
   * Note: This is a simplified implementation. Full implementation would:
   * 1. Connect to the SSE endpoint
   * 2. Send tools/list request via MCP protocol
   * 3. Parse response
   *
   * For MVP, we return empty array (manual registration required)
   */
  private async introspectHTTPServer(url: string): Promise<MCPToolSchema[]> {
    logger.debug(`HTTP/SSE introspection not yet implemented for ${url}`);
    // TODO: Implement actual HTTP/SSE introspection
    // For now, return known tools if we recognize the URL

    if (url.includes('sosumi.ai')) {
      return this.getSosumiTools();
    }

    if (url.includes('omi.me')) {
      return this.getOmiTools();
    }

    return [];
  }

  /**
   * Get known tools for well-known MCP servers
   * This is a fallback until we implement full introspection
   */
  private getKnownServerTools(serverName: string): MCPToolSchema[] {
    const lowerName = serverName.toLowerCase();

    if (lowerName.includes('sosumi')) {
      return this.getSosumiTools();
    }

    if (lowerName.includes('github')) {
      return this.getGitHubTools();
    }

    if (lowerName.includes('memory')) {
      return this.getMemoryTools();
    }

    if (lowerName.includes('puppeteer')) {
      return this.getPuppeteerTools();
    }

    if (lowerName.includes('xcode')) {
      return this.getXcodeTools();
    }

    if (lowerName.includes('omi')) {
      return this.getOmiTools();
    }

    // Unknown server - return empty array
    // User can manually register tools via database
    logger.debug(`No known tools for server: ${serverName}`);
    return [];
  }

  /**
   * Sosumi (Apple Documentation) tools
   */
  private getSosumiTools(): MCPToolSchema[] {
    return [
      {
        name: 'searchAppleDocumentation',
        description: 'Search Apple developer documentation (Swift, SwiftUI, UIKit, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
            framework: { type: 'string', description: 'Optional framework filter (e.g., SwiftUI, UIKit)' },
          },
          required: ['query'],
        },
      },
      {
        name: 'fetchAppleDocumentation',
        description: 'Fetch specific Apple documentation page',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'Documentation URL' },
          },
          required: ['url'],
        },
      },
    ];
  }

  /**
   * GitHub MCP tools
   */
  private getGitHubTools(): MCPToolSchema[] {
    return [
      {
        name: 'create_or_update_file',
        description: 'Create or update a file in a GitHub repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string' },
            repo: { type: 'string' },
            path: { type: 'string' },
            content: { type: 'string' },
            message: { type: 'string' },
            branch: { type: 'string' },
          },
          required: ['owner', 'repo', 'path', 'content', 'message'],
        },
      },
      {
        name: 'create_pull_request',
        description: 'Create a pull request in a GitHub repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string' },
            repo: { type: 'string' },
            title: { type: 'string' },
            body: { type: 'string' },
            head: { type: 'string' },
            base: { type: 'string' },
          },
          required: ['owner', 'repo', 'title', 'head', 'base'],
        },
      },
    ];
  }

  /**
   * Memory MCP tools
   */
  private getMemoryTools(): MCPToolSchema[] {
    return [
      {
        name: 'create_memory',
        description: 'Create a new memory entry',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            value: { type: 'string' },
          },
          required: ['key', 'value'],
        },
      },
      {
        name: 'get_memory',
        description: 'Retrieve a memory entry',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string' },
          },
          required: ['key'],
        },
      },
    ];
  }

  /**
   * Puppeteer MCP tools
   */
  private getPuppeteerTools(): MCPToolSchema[] {
    return [
      {
        name: 'puppeteer_navigate',
        description: 'Navigate to a URL',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string' },
          },
          required: ['url'],
        },
      },
      {
        name: 'puppeteer_screenshot',
        description: 'Take a screenshot of the current page',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            fullPage: { type: 'boolean' },
          },
          required: ['name'],
        },
      },
    ];
  }

  /**
   * Xcode MCP tools
   */
  private getXcodeTools(): MCPToolSchema[] {
    return [
      {
        name: 'getDiagnostics',
        description: 'Get Swift/Xcode compiler diagnostics',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string' },
          },
        },
      },
      {
        name: 'executeCode',
        description: 'Execute Swift code',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string' },
          },
          required: ['code'],
        },
      },
    ];
  }

  /**
   * Omi (Lifelogs) MCP tools
   */
  private getOmiTools(): MCPToolSchema[] {
    return [
      {
        name: 'search_memories',
        description: 'Search through lifelog memories and conversations',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            limit: { type: 'number' },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_recent_memories',
        description: 'Get recent lifelog entries',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number' },
          },
        },
      },
    ];
  }

  /**
   * Store tool in database
   */
  private storeToolInDB(serverName: string, tool: MCPToolSchema, source: string): void {
    const id = this.generateToolId(serverName, tool.name);

    try {
      this.db.upsertMCPTool({
        id,
        server_name: serverName,
        tool_name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
        source,
      });

      logger.debug(`Stored tool: ${serverName}:${tool.name}`);
    } catch (error) {
      logger.error(`Failed to store tool ${serverName}:${tool.name}: ${error}`);
      throw error;
    }
  }

  /**
   * Generate unique tool ID
   */
  private generateToolId(serverName: string, toolName: string): string {
    return createHash('sha256')
      .update(`${serverName}:${toolName}`)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Get all indexed MCP tools
   */
  getAllTools(): IndexedMCPTool[] {
    const tools = this.db.listMCPTools();
    return tools.map(tool => ({
      id: tool.id,
      server_name: tool.server_name,
      tool_name: tool.tool_name,
      description: tool.description,
      parameters: JSON.stringify(tool.parameters),
      source: tool.source,
    }));
  }

  /**
   * Search MCP tools by query
   */
  searchTools(query: string, options?: { server?: string; limit?: number }): IndexedMCPTool[] {
    const limit = options?.limit || 10;

    // Use database search method
    const tools = this.db.searchMCPToolsKeyword(query, limit);

    // Filter by server if specified
    const filtered = options?.server
      ? tools.filter(t => t.server_name === options.server)
      : tools;

    return filtered.map(tool => ({
      id: tool.id,
      server_name: tool.server_name,
      tool_name: tool.tool_name,
      description: tool.description,
      parameters: JSON.stringify(tool.parameters),
      source: tool.source,
    }));
  }

  /**
   * Get tools by server name
   */
  getToolsByServer(serverName: string): IndexedMCPTool[] {
    const tools = this.db.listMCPTools({ serverName });
    return tools.map(tool => ({
      id: tool.id,
      server_name: tool.server_name,
      tool_name: tool.tool_name,
      description: tool.description,
      parameters: JSON.stringify(tool.parameters),
      source: tool.source,
    }));
  }

  /**
   * Get tool by ID
   */
  getToolById(id: string): IndexedMCPTool | undefined {
    const tool = this.db.getMCPTool(id);
    if (!tool) return undefined;

    return {
      id: tool.id,
      server_name: tool.server_name,
      tool_name: tool.tool_name,
      description: tool.description,
      parameters: JSON.stringify(tool.parameters),
      source: tool.source,
    };
  }

  /**
   * Find skills that use a specific MCP tool
   */
  findSkillsUsingTool(serverName: string, toolName: string): Array<{ id: string; name: string }> {
    const toolReference = `${serverName}__${toolName}`;

    // Search in skills where metadata.mcp_tools array contains the tool
    const skills = this.db.listSkills();
    return skills
      .filter(skill => {
        const mcpTools = skill.metadata.mcp_tools || [];
        return mcpTools.includes(toolReference);
      })
      .map(skill => ({ id: skill.id, name: skill.name }));
  }

  /**
   * Update skill's MCP tool dependencies
   */
  updateSkillToolDependencies(skillId: string, mcpTools: string[]): void {
    const skill = this.db.getSkill(skillId);

    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`);
    }

    const updatedSkill = {
      ...skill,
      metadata: {
        ...skill.metadata,
        mcp_tools: mcpTools,
      },
    };

    this.db.upsertSkill(updatedSkill);
    logger.debug(`Updated MCP tool dependencies for skill ${skillId}`);
  }

  /**
   * Helper: Expand ~ in paths
   */
  private expandPath(filePath: string): string {
    if (filePath.startsWith('~')) {
      return path.join(homedir(), filePath.slice(1));
    }
    return filePath;
  }

  /**
   * Helper: Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// Exports
// ============================================================================

export default MCPIndexer;
