# GitHub Integration Guide

Complete guide for using GitHub repositories as skill sources in SigSkills.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup](#setup)
- [Authentication](#authentication)
- [Adding GitHub Sources](#adding-github-sources)
- [Syncing Skills](#syncing-skills)
- [Auto-Sync Scheduler](#auto-sync-scheduler)
- [Version Pinning](#version-pinning)
- [API Reference](#api-reference)
- [Examples](#examples)

---

## Overview

The GitHub integration allows you to:
- Index skills from public and private GitHub repositories
- Automatically sync skills when repositories are updated
- Pin to specific branches, tags, or commits
- Track changes and detect conflicts
- Cache skills locally for offline access

## Features

### Repository Crawling
- **Multi-path search**: Automatically searches `/skills/`, `/commands/`, and root directory
- **File type detection**: Supports `.md`, `.json`, `.yaml`, `.yml`, `.txt` skill files
- **Metadata extraction**: Parses skill metadata from file content and frontmatter
- **Change detection**: Uses checksums to detect changes and avoid redundant syncs

### Authentication
- **Public repos**: No authentication required
- **Private repos**: GitHub personal access token (PAT)
- **Rate limiting**: Automatic rate limit handling with retry logic
- **Token validation**: Verify token scopes and permissions

### Sync Management
- **Manual sync**: Trigger sync on-demand
- **Auto-sync**: Scheduled background syncing
- **Incremental sync**: Only fetch changed skills
- **Conflict resolution**: Handle upstream changes gracefully

### Version Control
- **Branch pinning**: Lock to specific branch (e.g., `main`, `develop`)
- **Tag pinning**: Use specific release tag (e.g., `v1.0.0`)
- **Commit pinning**: Lock to exact commit hash

---

## Setup

### Installation

The GitHub integration is included in SigSkills. Ensure you have the required dependencies:

```bash
cd ~/Projects/sigskills
npm install
```

### Environment Variables

Create a `.env` file:

```bash
# GitHub token for private repo access (optional)
GITHUB_TOKEN=ghp_your_personal_access_token

# Database path
DB_PATH=~/.sigskills/sigskills.db

# Log level
LOG_LEVEL=info
```

### Creating a GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Required scopes:
   - `repo` (for private repos)
   - `public_repo` (for public repos)
4. Copy token and add to `.env` file

---

## Authentication

### Authenticating with a Token

```typescript
import { GitHubSourceManager } from 'sigskills/indexer';

const sourceManager = new GitHubSourceManager();
const githubToken = process.env.GITHUB_TOKEN;

// Validate token
const authResult = await sourceManager.authenticateWithToken(githubToken);
console.log('Authenticated as:', authResult.username);
console.log('Token scopes:', authResult.scopes);
```

### Unauthenticated Access

For public repositories, no authentication is needed:

```typescript
const sourceManager = new GitHubSourceManager();

await sourceManager.addSource({
  owner: 'anthropics',
  repo: 'claude-skills',
  branch: 'main',
});
```

---

## Adding GitHub Sources

### Basic Public Repository

```typescript
import { createDatabase } from 'sigskills/db';
import { GitHubSourceManager, GitHubDatabaseAdapter } from 'sigskills/indexer';

const db = await createDatabase();
const sourceManager = new GitHubSourceManager();
const adapter = new GitHubDatabaseAdapter(db, sourceManager);

await adapter.initialize();

// Add public repo
const source = await sourceManager.addSource({
  owner: 'anthropics',
  repo: 'claude-skills',
  branch: 'main',
  autoSync: true,
  syncInterval: 60, // minutes
});

// Persist to database
await adapter.persistSource(source);
```

### Private Repository with Authentication

```typescript
const source = await sourceManager.addSource({
  owner: 'your-username',
  repo: 'my-private-skills',
  branch: 'main',
  auth: process.env.GITHUB_TOKEN, // Required for private repos
  autoSync: true,
  syncInterval: 30,
});
```

### Custom Skill Paths

By default, the indexer searches `/skills/`, `/commands/`, and the root directory. You can customize this:

```typescript
const source = await sourceManager.addSource({
  owner: 'anthropics',
  repo: 'claude-skills',
  skillPaths: ['skills', 'tools', 'prompts'], // Custom directories
});
```

---

## Syncing Skills

### Manual Sync

```typescript
const result = await sourceManager.syncSource(source.id, async (skills) => {
  console.log(`Fetched ${skills.length} skills`);

  // Persist to database
  await adapter.persistSkills(source.id, skills);
});

console.log('Skills indexed:', result.skillsAdded);
console.log('Errors:', result.errors);
```

### Sync All Sources

```typescript
await adapter.syncAllSources();
```

### Check for Upstream Changes

Before syncing, check if there are new commits:

```typescript
import { createGitHubSyncEngine } from 'sigskills/sync';

const syncEngine = createGitHubSyncEngine(adapter, sourceManager);

const result = await syncEngine.checkUpstreamChanges(source.id);

if (result.hasChanges) {
  console.log('New commit detected:', result.lastCommit);
  await syncEngine.syncSource(source.id);
}
```

---

## Auto-Sync Scheduler

### Enable Auto-Sync

```typescript
import { createGitHubSyncEngine } from 'sigskills/sync';

const syncEngine = createGitHubSyncEngine(adapter, sourceManager, {
  autoStartScheduler: true,
  schedulerIntervalMinutes: 60, // Sync every hour
});
```

### Listening to Sync Events

```typescript
syncEngine.on('sync:start', () => {
  console.log('Sync started');
});

syncEngine.on('sync:source-complete', ({ sourceId }) => {
  console.log('Source synced:', sourceId);
});

syncEngine.on('sync:complete', (progress) => {
  console.log('All sources synced:', progress);
});

syncEngine.on('sync:source-error', ({ sourceId, error }) => {
  console.error('Sync failed:', sourceId, error);
});
```

### Manual Scheduler Control

```typescript
// Start scheduler
syncEngine.startScheduler(60); // 60 minutes

// Stop scheduler
syncEngine.stopScheduler();

// Get schedule status
const schedule = syncEngine.getSchedule();
console.log('Last run:', schedule.lastRun);
console.log('Next run:', schedule.nextRun);
```

---

## Version Pinning

### Pin to Branch

```typescript
const source = await sourceManager.addSource({
  owner: 'anthropics',
  repo: 'claude-skills',
  branch: 'develop', // Use develop branch
});
```

### Pin to Tag

```typescript
const source = await sourceManager.addSource({
  owner: 'anthropics',
  repo: 'claude-skills',
  tag: 'v1.0.0', // Use specific release tag
});
```

### Pin to Commit

```typescript
const source = await sourceManager.addSource({
  owner: 'anthropics',
  repo: 'claude-skills',
  commit: 'abc123def456', // Use exact commit hash
});
```

**Note**: Priority order is `commit` > `tag` > `branch`. If multiple are specified, the highest priority one is used.

---

## API Reference

### GitHubIndexer

Main class for crawling GitHub repositories.

```typescript
import { GitHubIndexer } from 'sigskills/indexer';

const indexer = new GitHubIndexer(githubToken?, logger?);
```

**Methods:**

- `indexRepository(config)` - Index skills from a repository
- `getRepositoryMetadata(config)` - Get repo info (branch, latest commit)
- `hasUpstreamChanges(config, lastCommit)` - Check for new commits
- `listRepositories(owner?)` - List repos for user/org

### GitHubSourceManager

Manages GitHub repositories as skill sources.

```typescript
import { GitHubSourceManager } from 'sigskills/indexer';

const manager = new GitHubSourceManager(logger?);
```

**Methods:**

- `addSource(params)` - Add a GitHub repository
- `removeSource(sourceId)` - Remove a source
- `updateSource(sourceId, update)` - Update source config
- `getSource(sourceId)` - Get source by ID
- `getAllSources()` - Get all sources
- `getEnabledSources()` - Get enabled sources only
- `syncSource(sourceId, onSkillsIndexed?)` - Sync a source
- `syncAllSources(onSkillsIndexed?)` - Sync all enabled sources
- `authenticateWithToken(token)` - Validate GitHub token
- `searchRepositories(query, owner?)` - Search for repos

### GitHubDatabaseAdapter

Bridges GitHub sources with database persistence.

```typescript
import { GitHubDatabaseAdapter } from 'sigskills/indexer';

const adapter = new GitHubDatabaseAdapter(db, sourceManager, logger?);
```

**Methods:**

- `initialize()` - Load sources from database
- `persistSource(source)` - Save source to database
- `deleteSource(sourceId)` - Delete source and associated skills
- `persistSkills(sourceId, skills)` - Save skills to database
- `getSkillsForSource(sourceId)` - Get skills for a source
- `detectChanges(sourceId, newSkills)` - Detect added/updated/removed skills
- `syncSource(sourceId)` - Sync a source with database persistence
- `syncAllSources()` - Sync all sources

### GitHubSyncEngine

Orchestrates scheduled syncing with events.

```typescript
import { createGitHubSyncEngine } from 'sigskills/sync';

const engine = createGitHubSyncEngine(adapter, sourceManager, options?);
```

**Methods:**

- `startScheduler(intervalMinutes)` - Start auto-sync
- `stopScheduler()` - Stop auto-sync
- `syncAll()` - Sync all sources manually
- `syncSource(sourceId)` - Sync one source
- `checkUpstreamChanges(sourceId)` - Check for updates
- `forceSyncSource(sourceId)` - Force sync (ignore cache)
- `getSchedule()` - Get scheduler status
- `getSyncStats()` - Get sync statistics
- `cleanup()` - Stop scheduler and cleanup

**Events:**

- `sync:start` - Sync process started
- `sync:complete` - Sync process completed
- `sync:source-start` - Source sync started
- `sync:source-complete` - Source sync completed
- `sync:source-error` - Source sync failed
- `schedule:start` - Scheduled sync started
- `schedule:complete` - Scheduled sync completed
- `schedule:error` - Scheduled sync failed

---

## Examples

See `examples/github-integration-example.ts` for comprehensive examples:

```bash
# Run specific example
tsx examples/github-integration-example.ts 1

# Available examples:
# 1 - Basic setup
# 2 - Add public repo
# 3 - Add private repo
# 4 - Manual sync
# 5 - Auto-sync scheduler
# 6 - Check upstream changes
# 7 - Version pinning
# 8 - Managing sources
# 9 - Search repositories
# 10 - Complete workflow
```

---

## Best Practices

### Rate Limiting

- Use a GitHub token to get higher rate limits (5000 req/hour vs 60 req/hour)
- The indexer automatically handles rate limiting with retry logic
- For large repos, consider pinning to specific commits to avoid frequent re-indexing

### Security

- Never commit GitHub tokens to version control
- Use environment variables or secure secret management
- Tokens only need `repo` scope for private repos, `public_repo` for public repos
- Rotate tokens periodically

### Performance

- Use auto-sync intervals appropriate for your use case (hourly for active repos, daily for stable ones)
- Pin to tags/commits for production deployments
- Use branch pinning for development environments
- Monitor sync errors and adjust configuration as needed

### Skill Organization

For best results, organize your GitHub repository like this:

```
my-skills-repo/
├── skills/
│   ├── commit.md
│   ├── review-pr.md
│   └── deploy.md
├── commands/
│   ├── test.md
│   └── build.md
└── README.md
```

The indexer will automatically find and index skills from these directories.

---

## Troubleshooting

### Authentication Errors

**Problem**: "Bad credentials" or "401 Unauthorized"

**Solution**:
- Verify token is valid and not expired
- Check token has correct scopes (`repo` or `public_repo`)
- Ensure token is passed in `auth` parameter for private repos

### Rate Limit Exceeded

**Problem**: "API rate limit exceeded"

**Solution**:
- Add a GitHub token to increase rate limit
- Wait for rate limit to reset (shown in error message)
- Reduce sync frequency

### No Skills Found

**Problem**: Sync completes but no skills indexed

**Solution**:
- Verify repo has skill files in expected locations
- Check file extensions (must be `.md`, `.json`, `.yaml`, `.yml`, `.txt`)
- Try specifying custom `skillPaths` if skills are in non-standard directories
- Enable debug logging to see which files are scanned

### Sync Fails Silently

**Problem**: Sync completes but skills aren't updated

**Solution**:
- Check for errors in sync result: `result.errors`
- Verify source is enabled: `source.enabled === true`
- Check last sync commit hasn't changed: `source.lastSyncCommit`
- Enable info/debug logging to see detailed sync process

---

## Contributing

To extend the GitHub integration:

1. Add new features to `src/indexer/github-indexer.ts`
2. Update source manager in `src/indexer/github-source-manager.ts`
3. Add tests in `tests/indexer/`
4. Update this documentation

See `ARCHITECTURE.md` for overall system design.
