# Local Skill Indexer

The local skill indexer scans and indexes skills from `~/.claude/skills/` (or any specified directory) and stores them in the SQLite database for fast retrieval.

## Features

- **Recursive scanning**: Finds all skill files in subdirectories
- **Multiple formats**: Supports `.md`, `.json`, `.yaml`, and `.yml` files
- **Metadata extraction**: Parses frontmatter and metadata from skill files
- **Change detection**: Uses SHA-256 checksums to detect content changes
- **File watching**: Automatically reindex when files change (optional)
- **Debouncing**: Groups rapid file changes to avoid excessive reindexing
- **Validation**: Ensures skills have required fields before indexing

## Architecture

### Components

1. **LocalSkillIndexer** (`src/indexer/local-indexer.ts`)
   - Main indexer class
   - Manages file watching with chokidar
   - Handles indexing lifecycle

2. **SkillParser** (`src/utils/parser.ts`)
   - Parses skill files in different formats
   - Extracts metadata using gray-matter
   - Normalizes to common Skill interface
   - Generates checksums for change detection

3. **Logger** (`src/utils/logger.ts`)
   - Simple level-based logging (DEBUG, INFO, WARN, ERROR)
   - Timestamp and prefix support
   - Child loggers for component-specific logging

## Skill File Formats

### Markdown with Frontmatter

```markdown
---
name: commit
description: Create a git commit with conventional commit format
author: wsig
version: 1.0.0
tags: [git, commit, version-control]
category: development
dependencies: []
mcp_tools: [git]
---

# Commit Skill

You are an expert at creating well-formatted git commits...
```

### JSON

```json
{
  "name": "review-pr",
  "description": "Review pull requests with comprehensive analysis",
  "content": "Analyze this pull request and provide feedback...",
  "format": "claude",
  "author": "wsig",
  "version": "1.0.0",
  "tags": ["git", "review", "code-quality"],
  "category": "development",
  "mcp_tools": ["github"]
}
```

### YAML

```yaml
name: test-generator
description: Generate unit tests for code
content: |
  Generate comprehensive unit tests for the provided code...
format: universal
author: wsig
version: 1.0.0
tags:
  - testing
  - code-generation
category: testing
mcp_tools:
  - ide
```

## Usage

### Basic Usage

```typescript
import { createLocalIndexer } from './src/indexer/local-indexer.js';
import { homedir } from 'os';
import { join } from 'path';

const skillsPath = join(homedir(), '.claude', 'skills');

// Create and start indexer
const indexer = await createLocalIndexer(skillsPath, {
  watchForChanges: true,
  debounceMs: 1000,
  ignoreDotfiles: true,
  maxFileSize: 1024 * 1024, // 1MB
});

// Get status
const status = indexer.getStatus();
console.log(`Indexing ${status.path}`);
console.log(`Watching: ${status.watching}`);
```

### Options

```typescript
interface IndexerOptions {
  watchForChanges?: boolean;  // Enable file watching (default: false)
  debounceMs?: number;         // Debounce delay in ms (default: 1000)
  ignoreDotfiles?: boolean;    // Skip dotfiles (default: true)
  maxFileSize?: number;        // Max file size in bytes (default: 1MB)
}
```

### One-time Indexing

```typescript
const indexer = await createLocalIndexer(skillsPath, {
  watchForChanges: false,
});

// Index completes during creation
const result = indexer.getStatus();
console.log('Indexing complete!');

// Clean up
await indexer.stop();
```

### With File Watching

```typescript
const indexer = await createLocalIndexer(skillsPath, {
  watchForChanges: true,
  debounceMs: 1000,
});

// Indexer will automatically reindex when files change
// Keep running...

// Later, when done:
await indexer.stop();
```

## Database Schema

Skills are stored in the `skills` table with the following structure:

```sql
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  format TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_path TEXT,
  metadata TEXT NOT NULL,  -- JSON
  checksum TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

## Indexing Process

1. **Discovery**: Recursively find all skill files
2. **Parsing**: Parse each file with SkillParser
3. **Validation**: Ensure required fields exist
4. **Checksum**: Generate SHA-256 hash of content
5. **Upsert**: Insert new or update existing skills
6. **Cleanup**: Remove skills for deleted files
7. **Watch**: (Optional) Monitor for changes

## Change Detection

The indexer uses SHA-256 checksums to detect changes:

- **Added**: New skill files → insert into database
- **Updated**: Changed content (different checksum) → update in database
- **Removed**: Deleted files → remove from database
- **Unchanged**: Same checksum → skip

## File Watching

When enabled, the indexer:

1. Watches the skills directory with chokidar
2. Detects `add`, `change`, and `unlink` events
3. Debounces rapid changes (default: 1 second)
4. Processes changes in batches
5. Updates the database incrementally

## Performance

- **Initial indexing**: ~10-50ms per skill file
- **Change detection**: O(1) checksum comparison
- **Database upsert**: ~1-5ms per skill
- **File watching overhead**: Minimal (chokidar is efficient)

## Error Handling

The indexer handles errors gracefully:

- **Parse errors**: Logged and skipped
- **Invalid skills**: Logged and skipped
- **Large files**: Skipped (configurable max size)
- **Permission errors**: Logged and continued
- **Watch errors**: Logged but watcher continues

## Logging

Set log level for debugging:

```typescript
import { logger, LogLevel } from './src/utils/logger.js';

logger.setLevel(LogLevel.DEBUG);  // See all activity
logger.setLevel(LogLevel.INFO);   // Normal operation (default)
logger.setLevel(LogLevel.WARN);   // Warnings only
logger.setLevel(LogLevel.ERROR);  // Errors only
```

## Example Output

```
[2025-12-21T18:00:00.000Z] [INFO] [local-indexer] Initialized local indexer for: /Users/wsig/.claude/skills
[2025-12-21T18:00:00.001Z] [INFO] [local-indexer] Starting full index of skills directory...
[2025-12-21T18:00:00.050Z] [INFO] [local-indexer] Found 42 skill files
[2025-12-21T18:00:00.100Z] [DEBUG] [local-indexer] Skill added: commit
[2025-12-21T18:00:00.105Z] [DEBUG] [local-indexer] Skill added: review-pr
...
[2025-12-21T18:00:01.000Z] [INFO] [local-indexer] Indexing complete: 42 added, 0 updated, 0 removed, 0 errors
[2025-12-21T18:00:01.001Z] [INFO] [local-indexer] Starting file watcher...
[2025-12-21T18:00:01.002Z] [INFO] [local-indexer] File watcher started
```

## Testing

See `examples/local-indexer-example.ts` for a complete working example.

```bash
# Run the example
npx tsx examples/local-indexer-example.ts
```

## Next Steps

After indexing, skills can be:

- Searched semantically (with embeddings)
- Searched by keyword (full-text search)
- Fetched by ID or name
- Synced to cloud or other sources
- Used by the MCP server

See `src/search/` for search implementations.
