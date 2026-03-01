/**
 * Example: Integrating MCP Tool Indexer with SigSkills MCP Server
 *
 * This example shows how to:
 * 1. Initialize the MCP tool indexer on server startup
 * 2. Expose tool search via MCP tools
 * 3. Use dependency information to suggest tools for skills
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createDatabase } from '../src/db/index.js';
import { MCPIndexer } from '../src/indexer/mcp-indexer.js';
import { MCPDependencyMapper } from '../src/indexer/mcp-dependency-mapper.js';
import { logger } from '../src/utils/logger.js';

// ============================================================================
// Server Setup
// ============================================================================

async function main() {
  logger.info('Starting SigSkills MCP Server with Tool Indexing...');

  // Initialize database
  const db = await createDatabase();

  // Initialize MCP tool indexer
  const mcpIndexer = new MCPIndexer(db);
  const dependencyMapper = new MCPDependencyMapper(db);

  // Index MCP tools on startup
  logger.info('Indexing MCP tools from configs...');
  const indexResult = await mcpIndexer.indexAll();
  logger.info(`Indexed ${indexResult.indexed} MCP tools`);

  if (indexResult.errors.length > 0) {
    logger.warn(`Encountered ${indexResult.errors.length} errors during indexing`);
  }

  // Analyze existing skills for tool dependencies
  logger.info('Analyzing skill dependencies...');
  const analyzeResult = await dependencyMapper.analyzeAllSkills();
  logger.info(`Analyzed ${analyzeResult.analyzed} skills, updated ${analyzeResult.updated}`);

  // Make database available globally for MCP tools
  (global as any).__sigskills_db = db;

  // Create MCP server
  const server = new Server(
    {
      name: 'sigskills',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // ============================================================================
  // Register MCP Tools
  // ============================================================================

  // search_skills tool (with MCP tool suggestions)
  server.setRequestHandler('tools/call', async (request) => {
    if (request.params.name === 'search_skills') {
      const { query } = request.params.arguments as { query: string };

      // Perform skill search
      const skills = db.searchSkillsKeyword(query, 10);

      // For each skill, suggest relevant MCP tools
      const results = skills.map((skill) => {
        const suggestions = dependencyMapper.suggestToolsForSkill(skill.id);
        const dependencies = dependencyMapper.getSkillToolDependencies(skill.id);

        return {
          id: skill.id,
          name: skill.name,
          description: skill.description,
          mcp_tools: dependencies,
          suggested_tools: suggestions,
        };
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    // search_mcp_tools tool
    if (request.params.name === 'search_mcp_tools') {
      const { query, server, capability } = request.params.arguments as {
        query: string;
        server?: string;
        capability?: string;
      };

      // Search MCP tools
      const tools = mcpIndexer.searchTools(query, { server, limit: 50 });

      // Filter by capability if specified
      const filtered = capability
        ? tools.filter((tool) => tool.description.toLowerCase().includes(capability.toLowerCase()))
        : tools;

      // For each tool, find which skills use it
      const results = filtered.map((tool) => {
        const skills = mcpIndexer.findSkillsUsingTool(tool.server_name, tool.tool_name);

        return {
          server: tool.server_name,
          tool: tool.tool_name,
          description: tool.description,
          parameters: JSON.parse(tool.parameters),
          used_by: skills.length > 0 ? skills.slice(0, 5).map((s) => s.name) : undefined,
          usage_count: skills.length,
        };
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                tools: results,
                total: results.length,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // list_mcp_servers tool
    if (request.params.name === 'list_mcp_servers') {
      const allTools = mcpIndexer.getAllTools();

      // Group by server
      const serverMap = new Map<string, any[]>();
      for (const tool of allTools) {
        if (!serverMap.has(tool.server_name)) {
          serverMap.set(tool.server_name, []);
        }
        serverMap.get(tool.server_name)!.push({
          name: tool.tool_name,
          description: tool.description,
        });
      }

      const servers = Array.from(serverMap.entries()).map(([name, tools]) => ({
        name,
        tool_count: tools.length,
        tools: tools.sort((a, b) => a.name.localeCompare(b.name)),
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                servers,
                total_tools: allTools.length,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // generate_skill tool (with MCP tool recommendations)
    if (request.params.name === 'generate_skill') {
      const { prompt } = request.params.arguments as { prompt: string };

      // Suggest relevant MCP tools based on prompt
      const promptLower = prompt.toLowerCase();
      const suggestedTools: string[] = [];

      if (promptLower.includes('ios') || promptLower.includes('swift')) {
        suggestedTools.push('sosumi__searchAppleDocumentation');
      }
      if (promptLower.includes('github') || promptLower.includes('pull request')) {
        suggestedTools.push('github__create_pull_request');
      }
      if (promptLower.includes('browser') || promptLower.includes('web')) {
        suggestedTools.push('puppeteer__puppeteer_navigate');
      }

      // Get tool details
      const toolDetails = suggestedTools
        .map((toolRef) => {
          const [server, tool] = toolRef.split('__');
          return mcpIndexer.getToolsByServer(server).find((t) => t.tool_name === tool);
        })
        .filter((t) => t !== undefined);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                message: 'Skill generation would happen here',
                suggested_mcp_tools: toolDetails.map((tool) => ({
                  server: tool!.server_name,
                  tool: tool!.tool_name,
                  description: tool!.description,
                  reason: 'Based on prompt content analysis',
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
  });

  // ============================================================================
  // Register Tool Definitions
  // ============================================================================

  server.setRequestHandler('tools/list', async () => {
    return {
      tools: [
        {
          name: 'search_skills',
          description: 'Search for skills by query, with MCP tool suggestions',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'search_mcp_tools',
          description: 'Search available MCP tools by capability or description',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
              server: {
                type: 'string',
                description: 'Optional: Filter by server name',
              },
              capability: {
                type: 'string',
                description: 'Optional: Filter by capability',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'list_mcp_servers',
          description: 'List all configured MCP servers and their tools',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'generate_skill',
          description: 'Generate a new skill from a prompt, with MCP tool recommendations',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'Natural language description of the skill',
              },
            },
            required: ['prompt'],
          },
        },
      ],
    };
  });

  // ============================================================================
  // Start Server
  // ============================================================================

  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info('SigSkills MCP Server running with MCP tool indexing');

  // Optional: Re-index tools periodically
  setInterval(
    async () => {
      logger.info('Re-indexing MCP tools...');
      const result = await mcpIndexer.indexAll();
      logger.info(`Re-indexed ${result.indexed} tools`);
    },
    1000 * 60 * 60
  ); // Every hour
}

// ============================================================================
// Run
// ============================================================================

main().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});
