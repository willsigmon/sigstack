# SigSkills Indexers

This directory contains indexers for discovering and cataloging skills and MCP tools.

## Overview

- **local-indexer.ts** - Scans local skill directories (~/.claude/skills/)
- **github-indexer.ts** - Crawls GitHub repositories for skills
- **github-source-manager.ts** - Manages GitHub repositories as skill sources
- **github-db-adapter.ts** - Bridges GitHub sources with database persistence
- **codex-indexer.ts** - Integrates with Codex CLI skills
- **mcp-indexer.ts** - Discovers and indexes MCP tools from configured servers
- **mcp-dependency-mapper.ts** - Analyzes which skills use which MCP tools
- **embeddings.ts** - Generates vector embeddings for semantic search

## GitHub Integration

### Components

#### GitHubIndexer (`github-indexer.ts`)

Core GitHub repository crawler with:
- Public and private repository support
- Automatic rate limiting and retry logic
- Change detection via checksums
- Branch/tag/commit pinning
- Multi-path skill discovery

**Quick Start:**
```typescript
import { GitHubIndexer } from './github-indexer.js';

const indexer = new GitHubIndexer(process.env.GITHUB_TOKEN);
const result = await indexer.indexRepository({
  owner: 'anthropics',
  repo: 'claude-skills',
  branch: 'main',
});
```

#### GitHubSourceManager (`github-source-manager.ts`)

Manages GitHub repositories as skill sources:
- Add/remove/update repositories
- Configure auto-sync settings
- Track sync state per source
- Search and discover repositories

**Quick Start:**
```typescript
import { GitHubSourceManager } from './github-source-manager.js';

const manager = new GitHubSourceManager();
const source = await manager.addSource({
  owner: 'anthropics',
  repo: 'claude-skills',
  autoSync: true,
  syncInterval: 60,
});
```

#### GitHubDatabaseAdapter (`github-db-adapter.ts`)

Bridges GitHub sources with database:
- Persist sources and skills
- Detect changes (added/updated/removed)
- Coordinate sync operations
- Track sync state

**Quick Start:**
```typescript
import { GitHubDatabaseAdapter } from './github-db-adapter.js';
import { createDatabase } from '../db/index.js';
import { GitHubSourceManager } from './github-source-manager.js';

const db = await createDatabase();
const manager = new GitHubSourceManager();
const adapter = new GitHubDatabaseAdapter(db, manager);

await adapter.initialize();
await adapter.syncSource(sourceId);
```

### Documentation

- **Full Guide**: See [docs/GITHUB_INTEGRATION.md](../../docs/GITHUB_INTEGRATION.md)
- **Examples**: See [examples/github-integration-example.ts](../../examples/github-integration-example.ts)
- **Sync Engine**: See [src/sync/github-sync-engine.ts](../sync/github-sync-engine.ts)

## MCP Indexer

### Purpose

The MCP indexer automatically discovers MCP tools from your configured servers and makes them searchable. This enables:

1. **Discovery** - Find out what MCP tools are available
2. **Search** - Quickly locate tools by capability or description
3. **Dependency tracking** - See which skills depend on which tools
4. **Documentation** - Auto-generate tool documentation

### How It Works

```
1. Scan MCP configs
   └─> ~/.config/claude-code/mcp_settings.json
   └─> ~/.config/codex/mcp.json
   └─> Custom configs

2. Discover servers
   └─> Parse server configurations
   └─> Detect transport type (stdio, SSE, HTTP)

3. Introspect tools
   └─> Known servers: Use pre-configured schemas
   └─> HTTP/SSE: Attempt remote introspection (future)
   └─> stdio: Spawn process and query (future)

4. Index in database
   └─> Store tool name, description, parameters
   └─> Create FTS5 index for search
   └─> Generate embeddings (future)

5. Map dependencies
   └─> Scan skills for MCP tool references
   └─> Update skill metadata with tool dependencies
```

### Supported Servers

Pre-configured tool schemas for these popular MCP servers:

- **Sosumi** - Apple documentation search
- **GitHub** - Repository operations
- **Memory** - Cross-session memory storage
- **Puppeteer** - Browser automation
- **Xcode** - Swift compiler diagnostics
- **Omi** - Lifelog and conversation search

### Usage

#### Programmatic

```typescript
import { MCPIndexer } from './indexer/mcp-indexer.js';
import { MCPDependencyMapper } from './indexer/mcp-dependency-mapper.js';
import Database from 'better-sqlite3';

const db = new Database('sigskills.db');

// Index all MCP tools
const indexer = new MCPIndexer(db);
const result = await indexer.indexAll();
// { indexed: 12, errors: [] }

// Search for tools
const tools = indexer.searchTools('Apple documentation');
// [{ server_name: 'sosumi', tool_name: 'searchAppleDocumentation', ... }]

// Analyze skill dependencies
const mapper = new MCPDependencyMapper(db);
await mapper.analyzeAllSkills();
// { analyzed: 42, updated: 15 }

// Get usage stats
const stats = mapper.getToolUsageStats();
// [{ server_name: 'sosumi', tool_name: 'searchAppleDocumentation', usage_count: 8, ... }]
```

#### CLI

```bash
# Index all MCP tools
node dist/cli/index-mcp-tools.js

# List all indexed tools
node dist/cli/index-mcp-tools.js --list

# Search for tools
node dist/cli/index-mcp-tools.js --search "documentation"

# Analyze skill dependencies
node dist/cli/index-mcp-tools.js --analyze

# Show usage statistics
node dist/cli/index-mcp-tools.js --stats
```

### Database Schema

```sql
-- MCP Tools
CREATE TABLE mcp_tools (
  id TEXT PRIMARY KEY,
  server_name TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  description TEXT NOT NULL,
  parameters TEXT NOT NULL,  -- JSON schema
  source TEXT NOT NULL,       -- Config file path
  embedding BLOB,             -- Vector embedding
  created_at INTEGER,
  updated_at INTEGER,
  UNIQUE(server_name, tool_name)
);

-- Full-text search index
CREATE VIRTUAL TABLE mcp_tools_fts USING fts5(
  server_name,
  tool_name,
  description
);
```

### Dependency Detection

The dependency mapper detects MCP tool usage through:

#### 1. Explicit References
```
mcp__sosumi__searchAppleDocumentation
mcp__github__create_pull_request
```

#### 2. Server Mentions
```
"Use Sosumi to search Apple docs"
"Create PR with GitHub MCP"
```

#### 3. Tool Name Patterns
```
"Call searchAppleDocumentation(...)"
"Use create_pull_request to..."
```

### API Reference

#### MCPIndexer

```typescript
class MCPIndexer {
  constructor(db: Database, customConfigPaths?: string[]);

  // Index all MCP tools from configs
  async indexAll(): Promise<{ indexed: number; errors: string[] }>;

  // Get all indexed tools
  getAllTools(): IndexedMCPTool[];

  // Search tools by query
  searchTools(query: string, options?: {
    server?: string;
    limit?: number;
  }): IndexedMCPTool[];

  // Get tools for specific server
  getToolsByServer(serverName: string): IndexedMCPTool[];

  // Get tool by ID
  getToolById(id: string): IndexedMCPTool | undefined;

  // Find skills using a tool
  findSkillsUsingTool(serverName: string, toolName: string): Array<{
    id: string;
    name: string;
  }>;
}
```

#### MCPDependencyMapper

```typescript
class MCPDependencyMapper {
  constructor(db: Database);

  // Analyze all skills for tool usage
  async analyzeAllSkills(): Promise<{
    analyzed: number;
    updated: number;
  }>;

  // Analyze single skill
  analyzeSkill(skillId: string): string[];

  // Get tool usage statistics
  getToolUsageStats(): ToolUsageStats[];

  // Find skills using a tool
  findSkillsUsingTool(serverName: string, toolName: string): Array<{
    id: string;
    name: string;
  }>;

  // Get dependency graph
  getDependencyGraph(): Map<string, string[]>;

  // Suggest tools for a skill
  suggestToolsForSkill(skillId: string): Array<{
    server: string;
    tool: string;
    reason: string;
  }>;
}
```

### Future Enhancements

- [ ] **Live introspection** - Spawn stdio servers to discover tools dynamically
- [ ] **SSE/HTTP introspection** - Connect to remote servers via MCP protocol
- [ ] **Semantic search** - Vector embeddings for capability-based search
- [ ] **Tool versioning** - Track schema changes over time
- [ ] **Auto-suggestions** - Recommend tools when creating skills
- [ ] **Dependency validation** - Warn about missing/deprecated tools
- [ ] **Usage analytics** - Track which tools are actually used

## See Also

- [MCP_INDEXING.md](../../docs/MCP_INDEXING.md) - Complete MCP indexing guide
- [ARCHITECTURE.md](../../ARCHITECTURE.md) - System architecture overview
- [Database Schema](../db/schema.sql) - Complete database structure
