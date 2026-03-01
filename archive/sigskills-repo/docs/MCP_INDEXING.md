# MCP Tool Indexing Guide

The MCP Tool Indexer discovers, catalogs, and analyzes MCP tools from your configured MCP servers, making them searchable and tracking which skills depend on them.

## Features

- **Auto-discovery**: Scans multiple MCP config locations (Claude Code, Codex, Perplexity, Warp)
- **Multi-transport**: Supports stdio, SSE, and HTTP MCP servers
- **Known servers**: Pre-configured tool schemas for common servers (Sosumi, GitHub, Memory, Puppeteer, Xcode, Omi)
- **Semantic search**: Full-text search across tool names and descriptions
- **Dependency tracking**: Maps which skills use which MCP tools
- **Usage statistics**: Shows most-used tools and which skills depend on them

## Quick Start

### 1. Index MCP Tools

```bash
# Build the project first
npm run build

# Index all MCP tools from your configs
node dist/cli/index-mcp-tools.js

# Output:
# [INFO] Found 6 MCP config files
# [INFO] Indexed 12 tools from /Users/wsig/.config/claude-code/mcp_settings.json
#
# Tools by server:
#   github: 2 tools
#   memory: 2 tools
#   puppeteer: 2 tools
#   sosumi: 2 tools
#   xcode: 2 tools
#   omi: 2 tools
```

### 2. List All Indexed Tools

```bash
node dist/cli/index-mcp-tools.js --list
```

Output:
```
Found 12 MCP tools:

github:
  create_pull_request
    Create a pull request in a GitHub repository
    Parameters:
      - owner (string) *required*
      - repo (string) *required*
      - title (string) *required*
      - head (string) *required*: Source branch
      - base (string) *required*: Target branch
      - body (string): PR description

sosumi:
  searchAppleDocumentation
    Search Apple developer documentation (Swift, SwiftUI, UIKit, etc.)
    Parameters:
      - query (string) *required*: Search query
      - framework (string): Optional framework filter
```

### 3. Search for Tools

```bash
node dist/cli/index-mcp-tools.js --search "Apple documentation"
```

Output:
```
Found 2 matching tools:

sosumi::searchAppleDocumentation
  Search Apple developer documentation (Swift, SwiftUI, UIKit, etc.)
  Required: query

sosumi::fetchAppleDocumentation
  Fetch specific Apple documentation page
  Required: url
```

### 4. Analyze Skill Dependencies

```bash
node dist/cli/index-mcp-tools.js --analyze
```

This scans all indexed skills and detects which MCP tools they reference. It looks for:
- Explicit references: `mcp__sosumi__searchAppleDocumentation`
- Implicit mentions: "use Sosumi to search Apple docs"

Output:
```
Analyzed 42 skills, updated 15 with MCP tool dependencies

Skill → MCP Tool Dependencies:
  ios-api:
    - sosumi__searchAppleDocumentation
    - sosumi__fetchAppleDocumentation

  feedback-triage:
    - github__create_pull_request

  swift6-tca:
    - sosumi__searchAppleDocumentation
    - xcode__getDiagnostics
```

### 5. Show Usage Statistics

```bash
node dist/cli/index-mcp-tools.js --stats
```

Output:
```
Most used MCP tools:

sosumi::searchAppleDocumentation (8 skills)
  - ios-api
  - swift6-tca
  - ios26-swiftui
  - security-review
  - migrate
  ... and 3 more

github::create_pull_request (5 skills)
  - feedback-triage
  - git
  - deploy
  - build
  - test
```

## Programmatic Usage

### Indexing MCP Tools

```typescript
import Database from 'better-sqlite3';
import { MCPIndexer } from './indexer/mcp-indexer.js';

const db = new Database('sigskills.db');
const indexer = new MCPIndexer(db);

// Index all tools
const result = await indexer.indexAll();
console.log(`Indexed ${result.indexed} tools`);

// Get all tools
const tools = indexer.getAllTools();

// Search tools
const results = indexer.searchTools('documentation');

// Get tools by server
const sosumiTools = indexer.getToolsByServer('sosumi');

// Find skills using a tool
const skills = indexer.findSkillsUsingTool('sosumi', 'searchAppleDocumentation');
```

### Analyzing Dependencies

```typescript
import { MCPDependencyMapper } from './indexer/mcp-dependency-mapper.js';

const mapper = new MCPDependencyMapper(db);

// Analyze all skills
const result = await mapper.analyzeAllSkills();

// Analyze single skill
const tools = mapper.analyzeSkill('skill-id');

// Get usage statistics
const stats = mapper.getToolUsageStats();

// Get dependency graph
const graph = mapper.getDependencyGraph();

// Suggest tools for a skill
const suggestions = mapper.suggestToolsForSkill('skill-id');
```

## Supported MCP Config Locations

The indexer automatically scans these locations:

```
~/.config/claude-code/mcp_settings.json    # Claude Code
~/.config/claude/mcp.json                  # Claude Desktop
~/.config/codex/mcp.json                   # Codex CLI
~/.config/perplexity/mcp_settings.json     # Perplexity
~/.config/perplexity/mcp.json
~/.config/warp/mcp_settings.json           # Warp
~/.config/warp/mcp.json
~/.mcp/config.json                         # Custom
```

You can also specify custom config paths:

```typescript
const indexer = new MCPIndexer(db, [
  '/path/to/custom/mcp.json',
  '/another/config.json'
]);
```

## MCP Server Types

### 1. stdio Servers

Servers that communicate via stdin/stdout (most common):

```json
{
  "command": "node",
  "args": ["/path/to/server.js"],
  "env": { "API_KEY": "..." }
}
```

**Status**: Tools indexed from known server list (GitHub, Memory, Puppeteer, Xcode)

### 2. SSE Servers

Servers accessed via Server-Sent Events over HTTP:

```json
{
  "command": "npx",
  "args": ["-y", "mcp-remote", "https://api.example.com/mcp/sse"]
}
```

**Status**: Tools indexed from known server list (Omi)

### 3. HTTP/URL Servers

Direct HTTP MCP servers:

```json
{
  "url": "https://sosumi.ai/mcp"
}
```

**Status**: Tools indexed from known server list (Sosumi)

## Known MCP Servers

The indexer has pre-configured schemas for these popular MCP servers:

### Sosumi (Apple Documentation)
- `searchAppleDocumentation` - Search Apple docs
- `fetchAppleDocumentation` - Fetch specific doc pages

### GitHub
- `create_pull_request` - Create PRs
- `create_or_update_file` - Modify repo files

### Memory
- `create_memory` - Store key-value pairs
- `get_memory` - Retrieve stored values

### Puppeteer
- `puppeteer_navigate` - Navigate to URLs
- `puppeteer_screenshot` - Take screenshots

### Xcode
- `getDiagnostics` - Get Swift compiler errors
- `executeCode` - Run Swift code

### Omi (Lifelogs)
- `search_memories` - Search lifelog entries
- `get_recent_memories` - Get recent logs

## Dependency Detection

The dependency analyzer looks for these patterns in skill content:

### Explicit References
```
mcp__sosumi__searchAppleDocumentation
mcp__github__create_pull_request
```

### Server Mentions
```
"Use Sosumi to search Apple documentation"
"Create a PR with the GitHub MCP tool"
"Store context in Memory MCP"
```

### Tool Name Mentions
```
"Call searchAppleDocumentation to find..."
"Use create_pull_request to..."
```

## Database Schema

MCP tools are stored in the `mcp_tools` table:

```sql
CREATE TABLE mcp_tools (
  id TEXT PRIMARY KEY,              -- SHA-256 hash of server:tool
  server_name TEXT NOT NULL,        -- e.g., "sosumi"
  tool_name TEXT NOT NULL,          -- e.g., "searchAppleDocumentation"
  description TEXT NOT NULL,
  parameters TEXT NOT NULL,         -- JSON schema
  source TEXT NOT NULL,             -- Config file path
  embedding BLOB,                   -- For semantic search
  created_at INTEGER,
  updated_at INTEGER,

  UNIQUE(server_name, tool_name)
);
```

Skills reference tools in their metadata:

```json
{
  "id": "skill-123",
  "name": "ios-api",
  "metadata": {
    "mcp_tools": [
      "sosumi__searchAppleDocumentation",
      "sosumi__fetchAppleDocumentation"
    ]
  }
}
```

## Future Enhancements

### Planned Features
- [ ] **Live introspection**: Spawn stdio servers to discover tools dynamically
- [ ] **SSE/HTTP introspection**: Connect to remote servers and list tools
- [ ] **Tool versioning**: Track tool schema changes over time
- [ ] **Embedding generation**: Semantic search for tools by capability
- [ ] **Automatic skill suggestions**: Recommend MCP tools when creating skills
- [ ] **Tool deprecation tracking**: Mark obsolete tools
- [ ] **Usage analytics**: Track which tools are actually used vs. available

### Advanced Use Cases
- **Tool recommendation engine**: Suggest relevant tools based on skill content
- **Dependency visualization**: Graph of skills → tools → servers
- **Tool discovery UI**: Web interface for browsing available tools
- **Auto-documentation**: Generate skill docs including required MCP tools
- **Conflict detection**: Warn when skills reference non-existent tools

## Troubleshooting

### No tools indexed

**Problem**: `indexAll()` returns 0 tools

**Solutions**:
1. Check that MCP configs exist: `ls ~/.config/claude-code/mcp_settings.json`
2. Verify config format is valid JSON
3. Enable debug logging: `LOG_LEVEL=DEBUG node dist/cli/index-mcp-tools.js`
4. Check that `mcpServers` object exists in config

### Tool not found in search

**Problem**: Known tool doesn't appear in search results

**Solutions**:
1. Re-index: `node dist/cli/index-mcp-tools.js`
2. Check spelling: Tool names are case-sensitive
3. Search by server: `--search "sosumi"`
4. List all tools: `--list` to see what's indexed

### Skill dependencies not detected

**Problem**: `--analyze` doesn't find tool usage

**Solutions**:
1. Skills must explicitly reference tools: `mcp__server__tool`
2. Or mention server names: "use Sosumi", "GitHub MCP"
3. Check metadata: Skills store tools in `metadata.mcp_tools`
4. Manually update: Use `MCPDependencyMapper.updateSkillDependencies()`

## Examples

### Adding a Custom Tool Manually

```typescript
import { createHash } from 'crypto';

const db = new Database('sigskills.db');

const toolId = createHash('sha256')
  .update('myserver:mytool')
  .digest('hex')
  .substring(0, 16);

db.prepare(`
  INSERT INTO mcp_tools (id, server_name, tool_name, description, parameters, source)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  toolId,
  'myserver',
  'mytool',
  'My custom tool',
  JSON.stringify({
    type: 'object',
    properties: {
      input: { type: 'string' }
    },
    required: ['input']
  }),
  'manual'
);
```

### Finding Orphaned Skills

Skills that reference non-existent tools:

```typescript
const mapper = new MCPDependencyMapper(db);
const indexer = new MCPIndexer(db);

const graph = mapper.getDependencyGraph();
const allTools = indexer.getAllTools();
const toolSet = new Set(allTools.map(t => `${t.server_name}__${t.tool_name}`));

for (const [skillName, tools] of graph) {
  const orphaned = tools.filter(t => !toolSet.has(t));
  if (orphaned.length > 0) {
    console.log(`${skillName} references missing tools:`, orphaned);
  }
}
```

## See Also

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall system design
- [Database Schema](../src/db/schema.sql) - Complete database structure
- [MCP Protocol Spec](https://modelcontextprotocol.io/) - Official MCP documentation
