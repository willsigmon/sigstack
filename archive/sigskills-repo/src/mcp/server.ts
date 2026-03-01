/**
 * SigSkills MCP Server
 * Main server implementation using @modelcontextprotocol/sdk
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import type { SkillsDatabase, SourceConfig as DbSourceConfig } from '../db/index.js';
import { createDatabase } from '../db/index.js';
import {
  handleSearchSkills,
  handleFetchSkill,
  handleGenerateSkill,
  handleSyncSkills,
  handleSearchMCPTools,
  handleGetStatus,
  handleListSources,
  handleUpdateSkills,
} from './tools/index.js';
import { ConfigManager, type SourceConfig as AppSourceConfig } from '../config.js';
import { createHash } from 'crypto';
import { homedir } from 'os';
import { resolve } from 'path';

// ============================================================================
// Tool Definitions
// ============================================================================

const TOOLS: Tool[] = [
  {
    name: 'search_skills',
    description:
      'Search for skills using hybrid search (keyword + semantic with auto-fallback). Returns ranked results with snippets.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (supports both keyword and semantic matching)',
        },
        source: {
          type: 'string',
          enum: ['local', 'github', 'codex', 'all'],
          description: 'Filter by skill source (default: all)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10)',
        },
        format: {
          type: 'string',
          enum: ['claude', 'codex', 'both'],
          description: 'Filter by skill format',
        },
        include_content: {
          type: 'boolean',
          description: 'Include full skill content vs snippets (default: false)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'fetch_skill',
    description:
      'Fetch full skill content by ID with optional format conversion and metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        skill_id: {
          type: 'string',
          description: 'Unique skill identifier',
        },
        format: {
          type: 'string',
          enum: ['claude', 'codex', 'raw'],
          description: 'Auto-convert to target format',
        },
        include_metadata: {
          type: 'boolean',
          description: 'Include skill metadata (default: true)',
        },
      },
      required: ['skill_id'],
    },
  },
  {
    name: 'generate_skill',
    description:
      'Generate a new skill from a natural language prompt using Claude API.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Natural language description of desired skill',
        },
        template: {
          type: 'string',
          description: 'Base template to use for generation',
        },
        format: {
          type: 'string',
          enum: ['claude', 'codex'],
          description: 'Target skill format (default: claude)',
        },
        name: {
          type: 'string',
          description: 'Suggested skill name',
        },
        save: {
          type: 'boolean',
          description: 'Auto-save to local skills directory (default: false)',
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'sync_skills',
    description:
      'Synchronize skills between local and remote sources with conflict resolution.',
    inputSchema: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          description: 'Specific source to sync (default: all)',
        },
        direction: {
          type: 'string',
          enum: ['pull', 'push', 'both'],
          description: 'Sync direction (default: pull)',
        },
        dry_run: {
          type: 'boolean',
          description: 'Preview changes without applying (default: false)',
        },
        strategy: {
          type: 'string',
          enum: ['overwrite', 'merge', 'skip'],
          description: 'Conflict resolution strategy (default: merge)',
        },
      },
    },
  },
  {
    name: 'search_mcp_tools',
    description:
      'Search available MCP tools across all configured servers by capability or name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for tool name or description',
        },
        capability: {
          type: 'string',
          description: 'Filter by capability type',
        },
        server: {
          type: 'string',
          description: 'Filter by server name',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_status',
    description: 'Get basic server health information and database counts.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_sources',
    description:
      'List all configured skill sources with status and sync information.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'update_skills',
    description: 'Re-index and update skills from configured sources.',
    inputSchema: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          description: 'Update specific source (default: all)',
        },
        force: {
          type: 'boolean',
          description: 'Force complete re-index (default: false)',
        },
      },
    },
  },
];

// ============================================================================
// Source bootstrap
// ============================================================================

function expandHomePath(inputPath: string): string {
  return inputPath.replace(/^~(?=$|\/|\\)/, homedir());
}

function makeSourceId(source: AppSourceConfig, normalizedPath?: string): string {
  const identity = [
    source.type,
    normalizedPath || source.path || '',
    source.repo || '',
    source.branch || '',
    source.url || '',
  ].join('|');

  return createHash('sha256').update(identity).digest('hex').slice(0, 16);
}

async function seedSourcesFromConfig(db: SkillsDatabase): Promise<void> {
  const config = ConfigManager.getInstance().getConfig();
  const sources = config.sources || [];

  if (sources.length === 0) {
    return;
  }

  for (const source of sources) {
    const normalizedPath = source.path
      ? resolve(expandHomePath(source.path))
      : undefined;
    const id = makeSourceId(source, normalizedPath);

    const dbConfig: DbSourceConfig = {
      watch: source.watch,
      sync_interval: source.sync_interval,
    };

    db.upsertSource({
      id,
      type: source.type,
      path: normalizedPath,
      repo: source.repo,
      branch: source.branch,
      url: source.url,
      config: dbConfig,
      enabled: source.enabled,
      skill_count: 0,
      last_synced_at: undefined,
    });
  }
}

// ============================================================================
// MCP Server Setup
// ============================================================================

export function createServer(): Server {
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

  // Register tool list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: TOOLS,
    };
  });

  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'search_skills': {
          const result = await handleSearchSkills(args);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'fetch_skill': {
          const result = await handleFetchSkill(args);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'generate_skill': {
          const result = await handleGenerateSkill(args);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'sync_skills': {
          const result = await handleSyncSkills(args);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'search_mcp_tools': {
          const result = await handleSearchMCPTools(args);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'get_status': {
          const result = await handleGetStatus(args);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'list_sources': {
          const result = await handleListSources();
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'update_skills': {
          const result = await handleUpdateSkills(args);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      // Proper error handling with stack traces for debugging
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      console.error(`[${name}] Error:`, errorMessage);
      if (errorStack) {
        console.error(errorStack);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                error: errorMessage,
                tool: name,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

// ============================================================================
// Server Lifecycle
// ============================================================================

export async function runServer(): Promise<void> {
  const db = await createDatabase();
  await seedSourcesFromConfig(db);
  const server = createServer();
  const transport = new StdioServerTransport();

  console.error('[SigSkills] MCP Server starting...');
  console.error('[SigSkills] Version: 0.1.0');
  console.error('[SigSkills] Tools:', TOOLS.length);

  await server.connect(transport);

  console.error('[SigSkills] Server connected and ready');

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.error('[SigSkills] Shutting down...');
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.error('[SigSkills] Shutting down...');
    await server.close();
    process.exit(0);
  });
}
