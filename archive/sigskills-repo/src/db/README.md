# Database Layer

SQLite-based storage for SigSkills using better-sqlite3.

## Files

- **schema.sql** - Complete database schema with tables, indexes, FTS support, and triggers
- **index.ts** - TypeScript database interface with full CRUD operations
- **migrations/** - SQL migration files for schema versioning

## Schema Overview

### Tables

1. **skills** - Stores all indexed skills
   - Full-text search via `skills_fts` virtual table
   - Tracks source info, metadata, embeddings, checksums
   - Supports Claude, Codex, and universal formats

2. **mcp_tools** - Indexed MCP tools from configured servers
   - Full-text search via `mcp_tools_fts`
   - Stores tool parameters as JSON

3. **sources** - Manages skill sources (local dirs, GitHub repos, etc.)
   - Tracks enabled status and sync state
   - Stores source configuration as JSON

4. **sync_state** - Tracks sync status between skills and sources
   - Foreign keys to skills and sources with CASCADE delete

### Indexes

Performance-optimized indexes on:
- Skills: name, source_type, checksum, updated_at, format
- MCP Tools: server_name, tool_name
- Sources: type, enabled, last_synced_at
- Sync State: source_id, synced_at

### Features

- **FTS5 full-text search** for skills and MCP tools
- **Auto-updating triggers** for FTS indexes and timestamps
- **WAL mode** for better concurrency
- **Foreign key constraints** enforced
- **JSON storage** for flexible metadata

## Usage

```typescript
import { createDatabase, SkillsDatabase } from './db/index.js';

// Create and initialize database
const db = await createDatabase();

// Or use singleton
const db = SkillsDatabase.getInstance();

// Upsert a skill
const skill = db.upsertSkill({
  id: 'skill-123',
  name: 'commit',
  description: 'Git commit workflow',
  content: '...',
  format: 'claude',
  source_type: 'local',
  metadata: { author: 'wsig', tags: ['git'] },
  checksum: SkillsDatabase.calculateChecksum(content),
});

// Search skills (keyword)
const results = db.searchSkillsKeyword('git commit', 10);

// List skills with filters
const claudeSkills = db.listSkills({
  sourceType: 'local',
  format: 'claude',
  limit: 20
});

// Get database stats
const stats = db.getStats();
console.log(stats); // { skills: 59, mcpTools: 15, sources: 3, syncStates: 59 }

// Transaction support
db.transaction(() => {
  db.upsertSkill(skill1);
  db.upsertSkill(skill2);
  db.upsertSyncState({ skill_id: skill1.id, source_id: source.id, checksum });
});
```

## Database Location

Default: `~/.sigskills/sigskills.db`

Override via constructor:
```typescript
const db = new SkillsDatabase('/custom/path/db.sqlite');
```

## Migrations

Migrations are applied automatically on initialization:

```typescript
const db = new SkillsDatabase();
await db.initialize(); // Creates schema
await db.migrate();    // Applies pending migrations
```

Migration files in `migrations/`:
- `001_initial.sql` - Initial schema setup

## API Reference

### Skills CRUD
- `upsertSkill(skill)` - Insert or update skill
- `getSkill(id)` - Get skill by ID
- `getSkillByName(name, sourceType?)` - Get skill by name
- `listSkills(filters?)` - List skills with optional filters
- `deleteSkill(id)` - Delete skill
- `searchSkillsKeyword(query, limit?)` - Full-text search

### MCP Tools CRUD
- `upsertMCPTool(tool)` - Insert or update MCP tool
- `getMCPTool(id)` - Get tool by ID
- `listMCPTools(filters?)` - List tools
- `searchMCPToolsKeyword(query, limit?)` - Full-text search
- `deleteMCPTool(id)` - Delete tool

### Sources CRUD
- `upsertSource(source)` - Insert or update source
- `getSource(id)` - Get source by ID
- `listSources(enabledOnly?)` - List all sources
- `deleteSource(id)` - Delete source
- `updateSourceSkillCount(sourceId)` - Update skill count

### Sync State CRUD
- `upsertSyncState(state)` - Insert or update sync state
- `getSyncState(skillId, sourceId)` - Get sync state
- `listSyncStates(sourceId)` - List sync states for source
- `deleteSyncState(skillId, sourceId)` - Delete sync state

### Utilities
- `SkillsDatabase.calculateChecksum(content)` - Generate SHA-256 checksum
- `transaction(fn)` - Execute function in transaction
- `getStats()` - Get database statistics
- `vacuum()` - Optimize database
- `close()` - Close database connection

## Type Definitions

All types are exported from `index.ts`:
- `Skill` - Core skill interface
- `SkillMetadata` - Skill metadata structure
- `MCPTool` - MCP tool interface
- `Source` - Skill source interface
- `SourceConfig` - Source configuration
- `SyncState` - Sync state tracker
- `SearchResult` - Search result wrapper
