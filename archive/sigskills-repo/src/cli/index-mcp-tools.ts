#!/usr/bin/env node
/**
 * CLI tool for indexing MCP tools
 *
 * Usage:
 *   node dist/cli/index-mcp-tools.js            # Index all MCP tools
 *   node dist/cli/index-mcp-tools.js --analyze  # Analyze skill dependencies
 *   node dist/cli/index-mcp-tools.js --stats    # Show tool usage statistics
 */

import { getDatabase, createDatabase } from '../db/index.js';
import { MCPIndexer } from '../indexer/mcp-indexer.js';
import { MCPDependencyMapper } from '../indexer/mcp-dependency-mapper.js';
import { Logger, LogLevel } from '../utils/logger.js';

const logger = new Logger({ prefix: 'cli', level: LogLevel.INFO });

// ============================================================================
// Commands
// ============================================================================

async function indexMCPTools(db: ReturnType<typeof getDatabase>) {
  logger.info('=== Indexing MCP Tools ===');

  const indexer = new MCPIndexer(db);
  const result = await indexer.indexAll();

  logger.info(`Indexed ${result.indexed} tools`);

  if (result.errors.length > 0) {
    logger.warn(`Encountered ${result.errors.length} errors:`);
    result.errors.forEach((error) => logger.error(`  - ${error}`));
  }

  // Show summary
  const tools = indexer.getAllTools();
  const serverGroups = new Map<string, number>();

  for (const tool of tools) {
    serverGroups.set(tool.server_name, (serverGroups.get(tool.server_name) || 0) + 1);
  }

  console.log('\nTools by server:');
  for (const [server, count] of Array.from(serverGroups.entries()).sort()) {
    console.log(`  ${server}: ${count} tools`);
  }
}

async function analyzeSkillDependencies(db: ReturnType<typeof getDatabase>) {
  logger.info('=== Analyzing Skill Dependencies ===');

  const mapper = new MCPDependencyMapper(db);
  const result = await mapper.analyzeAllSkills();

  logger.info(`Analyzed ${result.analyzed} skills, updated ${result.updated} with MCP tool dependencies`);

  // Show dependency graph
  const graph = mapper.getDependencyGraph();

  if (graph.size > 0) {
    console.log('\nSkill → MCP Tool Dependencies:');
    for (const [skillName, tools] of Array.from(graph.entries()).sort()) {
      console.log(`  ${skillName}:`);
      tools.forEach((tool) => console.log(`    - ${tool}`));
    }
  } else {
    console.log('\nNo skills with MCP tool dependencies found.');
  }
}

async function showToolUsageStats(db: ReturnType<typeof getDatabase>) {
  logger.info('=== MCP Tool Usage Statistics ===');

  const mapper = new MCPDependencyMapper(db);
  const stats = mapper.getToolUsageStats();

  if (stats.length === 0) {
    console.log('\nNo MCP tool usage found in skills.');
    return;
  }

  console.log('\nMost used MCP tools:');
  for (const stat of stats.slice(0, 10)) {
    console.log(`\n${stat.server_name}::${stat.tool_name} (${stat.usage_count} skills)`);
    stat.skills.slice(0, 5).forEach((skill) => {
      console.log(`  - ${skill.name}`);
    });
    if (stat.skills.length > 5) {
      console.log(`  ... and ${stat.skills.length - 5} more`);
    }
  }
}

async function listAllTools(db: ReturnType<typeof getDatabase>) {
  logger.info('=== Listing All MCP Tools ===');

  const indexer = new MCPIndexer(db);
  const tools = indexer.getAllTools();

  if (tools.length === 0) {
    console.log('\nNo MCP tools indexed. Run without arguments to index tools.');
    return;
  }

  console.log(`\nFound ${tools.length} MCP tools:\n`);

  let currentServer = '';
  for (const tool of tools) {
    if (tool.server_name !== currentServer) {
      currentServer = tool.server_name;
      console.log(`\n${currentServer}:`);
    }

    console.log(`  ${tool.tool_name}`);
    console.log(`    ${tool.description}`);

    const params = JSON.parse(tool.parameters);
    if (params.properties) {
      const required = params.required || [];
      console.log(`    Parameters:`);
      for (const [paramName, paramSchema] of Object.entries(params.properties)) {
        const isRequired = required.includes(paramName);
        const schema = paramSchema as any;
        const type = schema.type || 'any';
        const desc = schema.description || '';
        console.log(`      - ${paramName} (${type})${isRequired ? ' *required*' : ''}: ${desc}`);
      }
    }
  }
}

async function searchTools(db: ReturnType<typeof getDatabase>, query: string) {
  logger.info(`=== Searching MCP Tools: "${query}" ===`);

  const indexer = new MCPIndexer(db);
  const results = indexer.searchTools(query);

  if (results.length === 0) {
    console.log('\nNo matching tools found.');
    return;
  }

  console.log(`\nFound ${results.length} matching tools:\n`);

  for (const tool of results) {
    console.log(`${tool.server_name}::${tool.tool_name}`);
    console.log(`  ${tool.description}`);

    const params = JSON.parse(tool.parameters);
    if (params.properties) {
      const required = params.required || [];
      const paramNames = Object.keys(params.properties);
      const requiredParams = paramNames.filter((name) => required.includes(name));

      if (requiredParams.length > 0) {
        console.log(`  Required: ${requiredParams.join(', ')}`);
      }
    }

    console.log();
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const db = await createDatabase();

  try {
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
SigSkills MCP Tool Indexer

Usage:
  index-mcp-tools              Index all MCP tools from configs
  index-mcp-tools --analyze    Analyze skill dependencies on MCP tools
  index-mcp-tools --stats      Show MCP tool usage statistics
  index-mcp-tools --list       List all indexed MCP tools
  index-mcp-tools --search <query>  Search for MCP tools

Examples:
  index-mcp-tools
  index-mcp-tools --analyze
  index-mcp-tools --stats
  index-mcp-tools --list
  index-mcp-tools --search "Apple documentation"
      `);
      process.exit(0);
    }

    if (args.includes('--analyze')) {
      await analyzeSkillDependencies(db);
    } else if (args.includes('--stats')) {
      await showToolUsageStats(db);
    } else if (args.includes('--list')) {
      await listAllTools(db);
    } else if (args.includes('--search')) {
      const queryIndex = args.indexOf('--search') + 1;
      const query = args[queryIndex];
      if (!query) {
        logger.error('Please provide a search query');
        process.exit(1);
      }
      await searchTools(db, query);
    } else {
      // Default: index all MCP tools
      await indexMCPTools(db);
    }

    logger.info('Done!');
  } catch (error) {
    logger.error('Error:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();
