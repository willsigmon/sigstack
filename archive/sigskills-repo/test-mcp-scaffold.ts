/**
 * Quick test to verify MCP scaffold compiles and exports correctly
 */

import { createServer } from './src/mcp/server.js';
import type {
  SearchSkillsParams,
  FetchSkillParams,
  GenerateSkillParams,
  SyncSkillsParams,
  SearchMCPToolsParams,
  UpdateSkillsParams,
  Skill,
  MCPTool,
} from './src/mcp/types.js';

console.log('✓ MCP server exports imported successfully');
console.log('✓ MCP type definitions imported successfully');

// Test server creation (don't start it)
const server = createServer();
console.log('✓ MCP server instance created');
console.log(`  Server name: ${(server as any).serverInfo?.name}`);
console.log(`  Server version: ${(server as any).serverInfo?.version}`);

// Test type validation
const testSearchParams: SearchSkillsParams = {
  query: 'test',
  limit: 10,
};
console.log('✓ SearchSkillsParams type validated');

const testFetchParams: FetchSkillParams = {
  skill_id: 'test-id',
};
console.log('✓ FetchSkillParams type validated');

console.log('\n✅ All MCP scaffold tests passed!');
