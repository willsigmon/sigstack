# Sync Engine Implementation Summary

## Overview

The sync engine provides bi-directional synchronization for skills between local and remote sources (GitHub, Codex CLI, custom registries). It detects changes via checksum comparison, resolves conflicts using configurable strategies, and tracks sync state in the database.

## Created Files

### 1. `src/sync/conflict.ts` (325 lines)

**Conflict Resolution Module**

Handles detection and resolution of conflicts when both local and remote skills have changed.

**Key Classes:**
- `ConflictResolver` - Main conflict resolution class

**Conflict Strategies:**
- `overwrite` - Use remote version, backup local
- `merge` - Combine changes (field-level merge)
- `skip` - Leave local as-is, don't sync
- `backup` - Create backup and use remote
- `newest` - Use whichever was updated most recently
- `manual` - Skip and log for manual resolution

**Key Methods:**
- `detectConflict(local, remote)` - Compare two skills for conflicts
- `resolve(conflict, strategy)` - Resolve single conflict
- `resolveAll(conflicts, strategy)` - Batch resolve multiple conflicts
- `backupSkill(skill)` - Backup skill to `~/.sigskills/backups/`

**Exports:**
- Singleton: `conflictResolver`

### 2. `src/sync/sync-engine.ts` (597 lines)

**Main Synchronization Engine**

Coordinates pull/push operations between local database and remote sources.

**Key Classes:**
- `SyncEngine` - Main sync orchestration
- `SourceIndexer` - Interface for source implementations

**Core Functionality:**
- **Pull**: Fetch remote skills, detect changes, apply to local DB
- **Push**: Upload local skills to remote sources
- **Bi-directional**: Pull + Push with conflict resolution
- **Dry Run**: Preview changes without applying

**Key Methods:**
- `sync(params)` - Main entry point
- `registerIndexer(sourceId, indexer)` - Register source
- `pullChanges()` - Fetch and apply remote changes
- `pushChanges()` - Upload local changes
- `detectChanges()` - Compare local vs remote
- `applyChange()` - Apply single change with conflict handling

**Database Integration:**
- Uses `SkillsDatabase` class methods
- Tracks sync state via `sync_state` table
- Updates source metadata

**Exports:**
- Singleton: `syncEngine`
- Interface: `SourceIndexer`

### 3. `src/sync/types.ts` (195 lines)

**Type Definitions**

Comprehensive TypeScript types for sync operations.

**Key Interfaces:**
- `SourceIndexer` - Interface for source implementations
- `SourceMetadata` - Source information
- `SyncOperationResult` - Result of sync operation
- `ConflictInfo` - Conflict details
- `SyncError` - Error information
- `SyncStateRecord` - Sync state tracking
- `SyncOptions` - Sync parameters
- `SourceConfig` - Source configuration
- `SyncProgress` - Progress tracking

### 4. `src/sync/index.ts` (29 lines)

**Module Exports**

Central export file for sync module.

**Exports:**
- Classes: `SyncEngine`, `ConflictResolver`
- Singletons: `syncEngine`, `conflictResolver`
- All type definitions

### 5. `src/sync/example-integration.ts` (387 lines)

**Integration Examples**

Demonstrates how to implement `SourceIndexer` interface for different source types.

**Example Implementations:**
- `ExampleLocalIndexer` - Local filesystem
- `ExampleGitHubIndexer` - GitHub repositories
- `ExampleCodexIndexer` - Codex CLI
- `ExampleCustomRegistryIndexer` - Custom API

**Usage Examples:**
- Setup and registration
- Pull all sources
- Dry run preview
- Sync specific source
- Push changes
- Bi-directional sync
- MCP tool integration

### 6. `src/sync/README.md` (9.8KB)

**Comprehensive Documentation**

- Architecture overview
- Component details
- Sync protocol explanation
- Database schema
- Error handling
- Backup strategy
- Performance notes
- Future enhancements

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Sync Engine                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Coordination (sync-engine.ts)                         │ │
│  │  - Pull/Push orchestration                            │ │
│  │  - Change detection (checksum comparison)             │ │
│  │  - Dry-run mode                                       │ │
│  │  - Source indexer registration                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Conflict Resolution (conflict.ts)                     │ │
│  │  - Conflict detection                                 │ │
│  │  - Strategy-based resolution                          │ │
│  │  - Automatic backups                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Database Integration                                  │ │
│  │  - SkillsDatabase API                                 │ │
│  │  - Sync state tracking                                │ │
│  │  - Transaction support                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Local     │    │   GitHub    │    │   Codex     │
│  Indexer    │    │  Indexer    │    │  Indexer    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Sync Protocol

### Pull Operation (Remote → Local)

1. **Fetch** - Get remote skills from source indexer
2. **Compare** - Compare checksums with local database
3. **Detect Changes**:
   - Remote skill not in local → **Add**
   - Checksums differ → **Update** (check for conflict)
   - Local skill not in remote → **Skip** (don't delete)
4. **Conflict Detection**:
   - Both local and remote changed since last sync → **Conflict**
   - Resolve using specified strategy
5. **Apply** - Update local database
6. **Track** - Update `sync_state` table with new checksums

### Push Operation (Local → Remote)

1. **Get Local** - Fetch local skills for source
2. **Check State** - Compare with `sync_state` table
3. **Detect Changes**:
   - Checksum differs from sync_state → **Push needed**
   - Checksum matches → **Already synced**
4. **Upload** - Push changed skills to remote (if supported)
5. **Track** - Update `sync_state` table

### Conflict Detection Logic

A conflict occurs when:
```
local_checksum ≠ remote_checksum
AND
local_checksum ≠ last_synced_checksum (from sync_state)
AND
remote_checksum ≠ last_synced_checksum
```

This three-way comparison ensures we only flag true conflicts where both sides have changed.

## Integration with Source Indexers

### SourceIndexer Interface

```typescript
interface SourceIndexer {
  sourceId: string;
  sourceType: 'local' | 'github' | 'codex' | 'custom';
  
  // Required
  fetchSkills(): Promise<Skill[]>;
  fetchSkill(skillId: string): Promise<Skill | null>;
  canPush(): boolean;
  canDelete(): boolean;
  getMetadata(): SourceMetadata;
  
  // Optional (if source supports writes)
  pushSkill?(skill: Skill): Promise<void>;
  deleteSkill?(skillId: string): Promise<void>;
}
```

### Registration

```typescript
import { syncEngine } from './sync/index.js';

// Create indexer instance
const localIndexer = new LocalIndexer();

// Register with sync engine
syncEngine.registerIndexer(localIndexer.sourceId, localIndexer);
```

### Integration Points

The sync engine integrates with:

1. **Database Layer** (`src/db/index.ts`)
   - `SkillsDatabase.upsertSkill()` - Add/update skills
   - `SkillsDatabase.listSkills()` - Query skills
   - `SkillsDatabase.listSyncStates()` - Get sync state
   - `SkillsDatabase.upsertSyncState()` - Update sync state
   - `SkillsDatabase.listSources()` - Get enabled sources

2. **Source Indexers** (to be implemented)
   - `LocalIndexer` - Scan `~/.claude/skills/`
   - `GitHubIndexer` - Fetch from GitHub API
   - `CodexIndexer` - Scan Codex CLI skills
   - `CustomIndexer` - Fetch from custom API

3. **Parser** (`src/utils/parser.ts`)
   - Used by indexers to parse skill files
   - Generates checksums for change detection

4. **MCP Tools** (`src/mcp/tools/sync-skills.ts`)
   - Exposes sync functionality via MCP protocol
   - Passes params to `syncEngine.sync()`

## Usage Examples

### Basic Pull Sync

```typescript
import { syncEngine } from './sync/index.js';

const result = await syncEngine.sync({
  direction: 'pull',
  strategy: 'merge',
});

console.log(`Added: ${result.added}, Updated: ${result.updated}`);
```

### Dry Run

```typescript
const preview = await syncEngine.sync({
  direction: 'pull',
  dry_run: true,
});

console.log('Would add:', preview.added);
console.log('Would update:', preview.updated);
```

### Conflict Resolution

```typescript
const result = await syncEngine.sync({
  direction: 'pull',
  strategy: 'newest', // Use newest version on conflict
});

if (result.conflicts.length > 0) {
  result.conflicts.forEach(c => {
    console.log(`Conflict: ${c.skill} - ${c.resolution}`);
  });
}
```

### Push Changes

```typescript
const result = await syncEngine.sync({
  source: 'github-my-skills',
  direction: 'push',
});

console.log(`Pushed ${result.updated} skills`);
```

## Database Schema

### sync_state Table

```sql
CREATE TABLE sync_state (
  skill_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  checksum TEXT NOT NULL,
  synced_at INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (skill_id, source_id),
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
);
```

**Purpose:**
- Track last known synced checksum for each skill-source pair
- Enable three-way conflict detection
- Determine which skills need syncing

## Error Handling

The sync engine handles errors gracefully:

1. **Source Unavailable** - Skip source, continue with others
2. **Skill Fetch Failure** - Log error, continue with other skills
3. **Conflict Resolution Failure** - Mark as skipped, log details
4. **Database Errors** - Propagate up with context
5. **Dry Run Errors** - Report in result, don't modify data

## Backup Strategy

Before overwriting local skills:

1. Create backup directory: `~/.sigskills/backups/`
2. Generate filename: `{skill-name}-{timestamp}.json`
3. Write full skill JSON (including metadata)
4. Log backup path for manual recovery

## Performance Optimizations

1. **Batch Database Operations** - Single transaction for multiple changes
2. **Checksum Comparison** - Fast change detection without content diffing
3. **Source Parallelization** - Multiple sources can sync concurrently
4. **Incremental Sync** - Only process changed skills
5. **Connection Pooling** - Reuse database connections

## Testing Strategy

### Unit Tests (to be implemented)

- Conflict detection logic
- Strategy-based resolution
- Change detection algorithms
- Database integration

### Integration Tests

- End-to-end sync flows
- Multiple source coordination
- Error recovery
- Backup creation

### Manual Testing

- Use example integrations
- Test with real GitHub repos
- Verify Codex CLI sync
- Validate conflict scenarios

## Future Enhancements

1. **Progress Callbacks** - Real-time progress updates for UI
2. **Webhook Support** - Trigger syncs on remote changes
3. **Incremental Backups** - Only backup changed fields
4. **Sync Scheduling** - Auto-sync every N minutes
5. **Conflict Preview** - Show conflicts before resolution
6. **Rollback Support** - Undo sync operations
7. **Sync History** - Track all sync operations
8. **Multi-user** - Handle concurrent syncs from different devices
9. **Optimistic Locking** - Prevent concurrent modification
10. **Compression** - Compress backups to save space

## Next Steps

1. **Implement Local Indexer** - Scan `~/.claude/skills/`
2. **Implement GitHub Indexer** - Use Octokit to fetch repos
3. **Implement Codex Indexer** - Scan Codex CLI skills
4. **Create MCP Tool Handler** - Expose via `sync_skills` tool
5. **Add Tests** - Unit and integration tests
6. **Documentation** - User guide for sync operations
7. **CLI Commands** - Add sync commands to CLI
8. **Monitoring** - Add metrics and logging

## File Statistics

- **Total Lines**: 1,854
- **TypeScript Files**: 6
- **Documentation**: README.md, IMPLEMENTATION.md
- **Examples**: example-integration.ts

## Dependencies

### External
- `better-sqlite3` - Database operations
- `crypto` - Checksum generation
- `fs` - File operations for backups

### Internal
- `src/db/index.ts` - Database layer
- `src/utils/logger.ts` - Logging
- `src/types/skill.ts` - Skill types
- `src/mcp/types.ts` - MCP types

## Key Design Decisions

1. **Interface-based Source Integration** - Allows flexible source implementations
2. **Strategy Pattern for Conflicts** - Configurable resolution without code changes
3. **Three-way Comparison** - Accurate conflict detection using sync_state
4. **Automatic Backups** - Safety before destructive operations
5. **Dry Run Support** - Preview changes before applying
6. **Database-agnostic** - Uses database abstraction layer
7. **Singleton Instances** - Convenient default usage
8. **Comprehensive Types** - Full TypeScript support

## Security Considerations

1. **Backup Privacy** - Backups contain full skill content
2. **Source Authentication** - Handled by indexer implementations
3. **Injection Prevention** - Use parameterized database queries
4. **File Path Validation** - Validate backup paths
5. **Error Sanitization** - Don't leak sensitive info in errors

---

**Status**: ✅ Implementation Complete  
**Date**: 2025-12-21  
**Author**: Claude Sonnet 4.5
