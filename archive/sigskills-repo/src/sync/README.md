# Sync Engine

Bi-directional synchronization engine for SigSkills. Coordinates syncing between local and remote sources (GitHub, Codex CLI, custom registries) with conflict detection and resolution.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Sync Engine                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Coordination Layer                                    │ │
│  │  - Pull/Push orchestration                            │ │
│  │  - Change detection                                   │ │
│  │  - Dry-run mode                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Conflict Resolution                                   │ │
│  │  - Conflict detection                                 │ │
│  │  - Multiple strategies (merge, overwrite, skip, etc.) │ │
│  │  - Automatic backups                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Sync State Tracking                                   │ │
│  │  - Checksum comparison                                │ │
│  │  - Last sync timestamps                               │ │
│  │  - Source-skill mapping                               │ │
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

## Components

### 1. SyncEngine (`sync-engine.ts`)

Main coordination layer for sync operations.

**Key Features:**
- Pull changes from remote sources
- Push local changes to remote sources (if supported)
- Bi-directional sync with conflict detection
- Dry-run mode to preview changes
- Support for multiple sources simultaneously
- Integration with source indexers via interface

**Usage:**

```typescript
import { syncEngine, SyncEngine } from './sync/index.js';

// Register source indexers
syncEngine.registerIndexer('local-skills', localIndexer);
syncEngine.registerIndexer('github-my-skills', githubIndexer);

// Pull changes from all sources
const result = await syncEngine.sync({
  direction: 'pull',
  strategy: 'merge',
  dry_run: false,
});

// Pull from specific source only
const result = await syncEngine.sync({
  source: 'github-my-skills',
  direction: 'pull',
  strategy: 'overwrite',
});

// Push local changes to remote
const result = await syncEngine.sync({
  direction: 'push',
  dry_run: false,
});

// Dry run to preview changes
const result = await syncEngine.sync({
  direction: 'both',
  dry_run: true,
});
```

### 2. ConflictResolver (`conflict.ts`)

Handles conflict detection and resolution when both local and remote skills have changed.

**Conflict Strategies:**
- `overwrite`: Use remote version, backup local
- `merge`: Combine changes (field-level merge)
- `skip`: Leave local as-is, don't sync
- `backup`: Create backup and use remote
- `newest`: Use whichever was updated most recently
- `manual`: Skip and log for manual resolution

**Usage:**

```typescript
import { conflictResolver } from './sync/index.js';

// Detect conflict
const conflict = conflictResolver.detectConflict(localSkill, remoteSkill);

if (conflict) {
  // Resolve with specific strategy
  const resolution = await conflictResolver.resolve(conflict, 'merge');

  if (resolution.result) {
    // Apply merged result
    await saveSkill(resolution.result);
  }

  if (resolution.backup_path) {
    console.log(`Backup saved to: ${resolution.backup_path}`);
  }
}

// Batch resolve multiple conflicts
const resolutions = await conflictResolver.resolveAll(conflicts, 'newest');
```

### 3. SourceIndexer Interface (`types.ts`)

Interface that source indexers must implement to work with the sync engine.

**Required Methods:**
- `fetchSkills()`: Get all skills from source
- `fetchSkill(id)`: Get specific skill
- `canPush()`: Check if source supports push
- `canDelete()`: Check if source supports delete

**Optional Methods:**
- `pushSkill(skill)`: Push skill to source
- `deleteSkill(id)`: Delete skill from source

**Implementation Example:**

```typescript
import { SourceIndexer, SourceMetadata } from './sync/types.js';
import type { Skill } from './types/skill.js';

class LocalIndexer implements SourceIndexer {
  sourceId = 'local-skills';
  sourceType = 'local' as const;

  async fetchSkills(): Promise<Skill[]> {
    // Scan local directory and return skills
    return await this.scanDirectory();
  }

  async fetchSkill(skillId: string): Promise<Skill | null> {
    // Fetch specific skill
    return await this.loadSkillById(skillId);
  }

  canPush(): boolean {
    return true; // Local supports writing
  }

  canDelete(): boolean {
    return true;
  }

  async pushSkill(skill: Skill): Promise<void> {
    // Write skill to local filesystem
    await this.writeSkillFile(skill);
  }

  async deleteSkill(skillId: string): Promise<void> {
    // Delete local file
    await this.deleteSkillFile(skillId);
  }

  getMetadata(): SourceMetadata {
    return {
      id: this.sourceId,
      type: this.sourceType,
      name: 'Local Skills',
      path: '~/.claude/skills',
      enabled: true,
      skillCount: this.cache.size,
    };
  }
}
```

## Sync Protocol

### Pull Operation (Remote → Local)

1. Fetch remote skills from source indexer
2. Get local skills for that source from database
3. Compare checksums to detect changes:
   - Remote skill not in local → Add
   - Checksums differ → Update (check for conflict)
   - Local skill not in remote → Skip (don't delete)
4. For updates, detect conflicts:
   - If both local and remote changed → Conflict
   - Resolve using specified strategy
5. Apply changes to local database
6. Update sync_state table with new checksums

### Push Operation (Local → Remote)

1. Get local skills that belong to source
2. Get sync state for each skill
3. Compare checksums:
   - Checksum differs from sync_state → Push needed
   - Checksum matches → Already synced
4. Push changed skills to remote (if supported)
5. Update sync_state table

### Conflict Detection

A conflict occurs when:
- Local skill checksum ≠ remote skill checksum
- Local skill checksum ≠ last synced checksum (from sync_state)
- Remote skill checksum ≠ last synced checksum

This means both local and remote have changed since last sync.

### Sync State Tracking

The `sync_state` table tracks:
- `skill_id`: Skill identifier
- `source_id`: Source identifier
- `checksum`: Last known synced checksum
- `synced_at`: Unix timestamp of last sync

This enables three-way comparison to detect true conflicts.

## Database Schema

```sql
-- Sync state table
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

## Error Handling

The sync engine handles errors gracefully:
- Failed skill sync → Log error, continue with others
- Source indexer unavailable → Skip source, continue with others
- Conflict resolution failure → Mark as skipped, log details
- Dry run errors → Report in result, don't modify data

## Backups

Before overwriting local skills, automatic backups are created:
- Location: `~/.sigskills/backups/`
- Format: `{skill-name}-{timestamp}.json`
- Contains full skill data including metadata
- Enables manual recovery if needed

## Performance

- **Batch operations**: Process multiple skills in single transaction
- **Parallel fetching**: Source indexers can fetch in parallel
- **Incremental sync**: Only process changed skills (checksum comparison)
- **Connection pooling**: Reuse database connections

## Future Enhancements

- [ ] Progress callbacks for UI integration
- [ ] Webhook support for push notifications
- [ ] Incremental backup (only changed fields)
- [ ] Sync scheduling (auto-sync every N minutes)
- [ ] Conflict preview before resolution
- [ ] Rollback support (undo sync)
- [ ] Sync history tracking
- [ ] Multi-user conflict resolution
- [ ] Optimistic locking for concurrent syncs
