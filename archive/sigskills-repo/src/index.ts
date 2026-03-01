#!/usr/bin/env node

/**
 * SigSkills MCP Server Entry Point
 * Starts the MCP server with stdio transport for Claude Code compatibility
 */

import { runServer } from './mcp/server.js';
import { config } from 'dotenv';

// Load environment variables
config();

// Start the server
runServer().catch((error) => {
  console.error('[SigSkills] Fatal error:', error);
  process.exit(1);
});
