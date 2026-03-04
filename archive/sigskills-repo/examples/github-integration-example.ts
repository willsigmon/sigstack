/**
 * GitHub Integration Example
 *
 * Demonstrates how to use the GitHub skill repository crawler with SigSkills.
 * This example shows:
 * - Setting up GitHub source management
 * - Adding GitHub repositories as skill sources
 * - Syncing skills from GitHub
 * - Scheduled auto-sync
 * - Detecting upstream changes
 */

import { createDatabase } from '../src/db/index.js';
import {
  GitHubIndexer,
  GitHubSourceManager,
  GitHubDatabaseAdapter,
} from '../src/indexer/index.js';
import { GitHubSyncEngine, createGitHubSyncEngine } from '../src/sync/index.js';
import { Logger } from '../src/utils/logger.js';

// ============================================================================
// Example 1: Basic GitHub Source Setup
// ============================================================================

async function example1_BasicSetup() {
  console.log('=== Example 1: Basic GitHub Source Setup ===\n');

  // Initialize database
  const db = await createDatabase('~/.sigskills/sigskills.db');

  // Create source manager and adapter
  const logger = new Logger({ prefix: 'example' });
  const sourceManager = new GitHubSourceManager(logger);
  const adapter = new GitHubDatabaseAdapter(db, sourceManager, logger);

  // Initialize adapter (loads sources from database)
  await adapter.initialize();

  console.log('Setup complete!\n');
}

// ============================================================================
// Example 2: Adding a Public GitHub Repository
// ============================================================================

async function example2_AddPublicRepo() {
  console.log('=== Example 2: Adding Public GitHub Repository ===\n');

  const db = await createDatabase();
  const sourceManager = new GitHubSourceManager();
  const adapter = new GitHubDatabaseAdapter(db, sourceManager);

  await adapter.initialize();

  // Add a public GitHub repository (no auth needed)
  const source = await sourceManager.addSource({
    owner: 'anthropics',
    repo: 'claude-skills', // Example repo
    branch: 'main',
    autoSync: true,
    syncInterval: 60, // Sync every 60 minutes
  });

  // Persist to database
  await adapter.persistSource(source);

  console.log('Added source:', source);
  console.log('\nSource ID:', source.id);
  console.log('Repository:', `${source.owner}/${source.repo}`);
  console.log('Auto-sync:', source.config.autoSync);
  console.log();
}

// ============================================================================
// Example 3: Adding a Private GitHub Repository with Authentication
// ============================================================================

async function example3_AddPrivateRepo() {
  console.log('=== Example 3: Adding Private Repository (with token) ===\n');

  const db = await createDatabase();
  const sourceManager = new GitHubSourceManager();
  const adapter = new GitHubDatabaseAdapter(db, sourceManager);

  await adapter.initialize();

  // GitHub personal access token (required for private repos)
  const githubToken = process.env.GITHUB_TOKEN || 'ghp_your_token_here';

  // Authenticate first (optional but recommended)
  try {
    const authResult = await sourceManager.authenticateWithToken(githubToken);
    console.log('Authenticated as:', authResult.username);
    console.log('Token scopes:', authResult.scopes.join(', '));
  } catch (error) {
    console.error('Authentication failed:', error);
    return;
  }

  // Add private repository
  const source = await sourceManager.addSource({
    owner: 'your-username',
    repo: 'my-private-skills',
    branch: 'main',
    auth: githubToken, // Include token for authentication
    autoSync: true,
    syncInterval: 30, // Sync every 30 minutes
    skillPaths: ['skills', 'commands'], // Custom skill directories
  });

  await adapter.persistSource(source);

  console.log('\nPrivate repository added successfully!');
  console.log('Source ID:', source.id);
  console.log();
}

// ============================================================================
// Example 4: Manual Sync of a GitHub Source
// ============================================================================

async function example4_ManualSync() {
  console.log('=== Example 4: Manual Sync ===\n');

  const db = await createDatabase();
  const sourceManager = new GitHubSourceManager();
  const adapter = new GitHubDatabaseAdapter(db, sourceManager);

  await adapter.initialize();

  // Assume we have a source already added
  const sources = sourceManager.getAllSources();
  if (sources.length === 0) {
    console.log('No sources found. Add a source first (see Example 2 or 3).');
    return;
  }

  const source = sources[0];
  console.log(`Syncing source: ${source.owner}/${source.repo}\n`);

  // Perform sync
  const result = await sourceManager.syncSource(source.id, async (skills) => {
    console.log(`Fetched ${skills.length} skills from GitHub`);

    // Detect changes
    const changes = await adapter.detectChanges(source.id, skills);
    console.log('\nChanges detected:');
    console.log('  Added:', changes.added.length);
    console.log('  Updated:', changes.updated.length);
    console.log('  Removed:', changes.removed.length);
    console.log('  Unchanged:', changes.unchanged.length);

    // Persist skills to database
    await adapter.persistSkills(source.id, [...changes.added, ...changes.updated]);

    // Persist updated source
    const updatedSource = sourceManager.getSource(source.id);
    if (updatedSource) {
      await adapter.persistSource(updatedSource);
    }
  });

  console.log('\nSync complete!');
  console.log('Skills indexed:', result.skillsAdded);
  console.log('Errors:', result.errors.length);
  console.log();
}

// ============================================================================
// Example 5: Scheduled Auto-Sync with Sync Engine
// ============================================================================

async function example5_AutoSync() {
  console.log('=== Example 5: Scheduled Auto-Sync ===\n');

  const db = await createDatabase();
  const sourceManager = new GitHubSourceManager();
  const adapter = new GitHubDatabaseAdapter(db, sourceManager);

  await adapter.initialize();

  // Create sync engine with auto-start scheduler
  const syncEngine = createGitHubSyncEngine(adapter, sourceManager, {
    autoStartScheduler: true,
    schedulerIntervalMinutes: 60, // Sync every hour
  });

  // Listen to sync events
  syncEngine.on('sync:start', () => {
    console.log('Sync started...');
  });

  syncEngine.on('sync:source-start', ({ sourceId, sourceName }) => {
    console.log(`  Syncing: ${sourceName} (${sourceId})`);
  });

  syncEngine.on('sync:source-complete', ({ sourceId }) => {
    console.log(`  Completed: ${sourceId}`);
  });

  syncEngine.on('sync:source-error', ({ sourceId, error }) => {
    console.error(`  Error in ${sourceId}:`, error);
  });

  syncEngine.on('sync:complete', (progress) => {
    console.log('\nSync complete!');
    console.log('Results:');
    progress.forEach((p: any) => {
      console.log(`  ${p.sourceName}: ${p.status}`);
    });
  });

  console.log('Auto-sync scheduler started (runs every 60 minutes)');
  console.log('Press Ctrl+C to stop\n');

  // Keep process running
  process.on('SIGINT', () => {
    console.log('\nStopping sync engine...');
    syncEngine.cleanup();
    db.close();
    process.exit(0);
  });
}

// ============================================================================
// Example 6: Checking for Upstream Changes
// ============================================================================

async function example6_CheckUpstreamChanges() {
  console.log('=== Example 6: Check Upstream Changes ===\n');

  const db = await createDatabase();
  const sourceManager = new GitHubSourceManager();
  const adapter = new GitHubDatabaseAdapter(db, sourceManager);
  const syncEngine = createGitHubSyncEngine(adapter, sourceManager);

  await adapter.initialize();

  const sources = sourceManager.getAllSources();
  if (sources.length === 0) {
    console.log('No sources found.');
    return;
  }

  // Check each source for changes
  for (const source of sources) {
    console.log(`\nChecking: ${source.owner}/${source.repo}`);

    const result = await syncEngine.checkUpstreamChanges(source.id);

    if (result.hasChanges) {
      console.log('  Status: Changes detected!');
      console.log('  New commit:', result.lastCommit);
    } else {
      console.log('  Status: Up to date');
    }
  }

  console.log();
  db.close();
}

// ============================================================================
// Example 7: Pinning to Specific Branch/Tag/Commit
// ============================================================================

async function example7_PinningVersions() {
  console.log('=== Example 7: Version Pinning ===\n');

  const db = await createDatabase();
  const sourceManager = new GitHubSourceManager();
  const adapter = new GitHubDatabaseAdapter(db, sourceManager);

  await adapter.initialize();

  // Pin to a specific branch
  const branchSource = await sourceManager.addSource({
    owner: 'anthropics',
    repo: 'claude-skills',
    branch: 'develop', // Use develop branch instead of main
  });
  console.log('Added source pinned to branch:', branchSource.branch);

  // Pin to a specific tag
  const tagSource = await sourceManager.addSource({
    owner: 'anthropics',
    repo: 'claude-skills-v2',
    tag: 'v1.0.0', // Use specific tag
  });
  console.log('Added source pinned to tag:', tagSource.tag);

  // Pin to a specific commit
  const commitSource = await sourceManager.addSource({
    owner: 'anthropics',
    repo: 'claude-skills-v3',
    commit: 'abc123def456', // Use specific commit hash
  });
  console.log('Added source pinned to commit:', commitSource.commit);

  console.log();
  db.close();
}

// ============================================================================
// Example 8: Managing Sources (Update/Remove)
// ============================================================================

async function example8_ManagingSources() {
  console.log('=== Example 8: Managing Sources ===\n');

  const db = await createDatabase();
  const sourceManager = new GitHubSourceManager();
  const adapter = new GitHubDatabaseAdapter(db, sourceManager);

  await adapter.initialize();

  // Add a source
  const source = await sourceManager.addSource({
    owner: 'anthropics',
    repo: 'claude-skills',
    branch: 'main',
    autoSync: false,
  });
  console.log('Added source:', source.id);

  // Update source configuration
  const updated = await sourceManager.updateSource(source.id, {
    autoSync: true,
    syncInterval: 30,
    branch: 'develop',
  });
  console.log('Updated source - auto-sync:', updated.config.autoSync);
  console.log('Updated source - branch:', updated.branch);

  // Disable source
  await sourceManager.updateSource(source.id, { enabled: false });
  console.log('Source disabled');

  // Re-enable source
  await sourceManager.updateSource(source.id, { enabled: true });
  console.log('Source re-enabled');

  // Remove source
  await sourceManager.removeSource(source.id);
  await adapter.deleteSource(source.id);
  console.log('Source removed');

  console.log();
  db.close();
}

// ============================================================================
// Example 9: Searching for Repositories
// ============================================================================

async function example9_SearchRepositories() {
  console.log('=== Example 9: Search GitHub Repositories ===\n');

  const sourceManager = new GitHubSourceManager();

  // Search for repositories by query
  console.log('Searching for "claude skills"...\n');
  const searchResults = await sourceManager.searchRepositories('claude skills');

  console.log(`Found ${searchResults.length} repositories:\n`);
  searchResults.slice(0, 5).forEach((repo, i) => {
    console.log(`${i + 1}. ${repo.owner}/${repo.repo}`);
    console.log(`   ${repo.description}`);
    console.log();
  });

  // List repositories for a specific owner
  console.log('Listing repositories for "anthropics"...\n');
  const ownerRepos = await sourceManager.searchRepositories('', 'anthropics');

  console.log(`Found ${ownerRepos.length} repositories:\n`);
  ownerRepos.slice(0, 5).forEach((repo, i) => {
    console.log(`${i + 1}. ${repo.owner}/${repo.repo}`);
    console.log();
  });
}

// ============================================================================
// Example 10: Complete Integration Workflow
// ============================================================================

async function example10_CompleteWorkflow() {
  console.log('=== Example 10: Complete Integration Workflow ===\n');

  // 1. Setup
  console.log('Step 1: Initialize database and components');
  const db = await createDatabase();
  const logger = new Logger({ prefix: 'workflow' });
  const sourceManager = new GitHubSourceManager(logger);
  const adapter = new GitHubDatabaseAdapter(db, sourceManager, logger);
  await adapter.initialize();
  console.log('✓ Setup complete\n');

  // 2. Add GitHub source
  console.log('Step 2: Add GitHub repository');
  const githubToken = process.env.GITHUB_TOKEN;
  const source = await sourceManager.addSource({
    owner: 'anthropics',
    repo: 'claude-skills',
    branch: 'main',
    auth: githubToken,
    autoSync: true,
    syncInterval: 60,
  });
  await adapter.persistSource(source);
  console.log(`✓ Added: ${source.owner}/${source.repo}\n`);

  // 3. Initial sync
  console.log('Step 3: Perform initial sync');
  await adapter.syncSource(source.id);
  console.log('✓ Initial sync complete\n');

  // 4. Start auto-sync scheduler
  console.log('Step 4: Start auto-sync scheduler');
  const syncEngine = createGitHubSyncEngine(adapter, sourceManager, {
    autoStartScheduler: true,
    schedulerIntervalMinutes: 60,
    logger,
  });
  console.log('✓ Auto-sync scheduler started\n');

  // 5. Get sync stats
  console.log('Step 5: Get sync statistics');
  const stats = await syncEngine.getSyncStats();
  console.log('Statistics:');
  console.log(`  Total sources: ${stats.totalSources}`);
  console.log(`  Enabled sources: ${stats.enabledSources}`);
  console.log(`  Total skills: ${stats.skillCount}`);
  console.log(`  Last synced: ${stats.lastSyncedAt?.toISOString() || 'Never'}`);
  console.log();

  // 6. Query indexed skills
  console.log('Step 6: Query indexed skills');
  const skills = await adapter.getSkillsForSource(source.id);
  console.log(`Found ${skills.length} skills from GitHub`);
  if (skills.length > 0) {
    console.log('\nExample skill:');
    console.log(`  Name: ${skills[0].name}`);
    console.log(`  Description: ${skills[0].description}`);
    console.log(`  Format: ${skills[0].format}`);
  }
  console.log();

  // 7. Cleanup
  console.log('Step 7: Cleanup');
  syncEngine.cleanup();
  db.close();
  console.log('✓ Cleanup complete\n');

  console.log('=== Workflow Complete ===\n');
}

// ============================================================================
// Run Examples
// ============================================================================

async function main() {
  const example = process.argv[2] || '1';

  const examples: Record<string, () => Promise<void>> = {
    '1': example1_BasicSetup,
    '2': example2_AddPublicRepo,
    '3': example3_AddPrivateRepo,
    '4': example4_ManualSync,
    '5': example5_AutoSync,
    '6': example6_CheckUpstreamChanges,
    '7': example7_PinningVersions,
    '8': example8_ManagingSources,
    '9': example9_SearchRepositories,
    '10': example10_CompleteWorkflow,
  };

  const exampleFn = examples[example];

  if (!exampleFn) {
    console.log('Available examples:');
    console.log('  1 - Basic GitHub Source Setup');
    console.log('  2 - Adding a Public GitHub Repository');
    console.log('  3 - Adding a Private Repository (with token)');
    console.log('  4 - Manual Sync of a GitHub Source');
    console.log('  5 - Scheduled Auto-Sync with Sync Engine');
    console.log('  6 - Checking for Upstream Changes');
    console.log('  7 - Pinning to Specific Branch/Tag/Commit');
    console.log('  8 - Managing Sources (Update/Remove)');
    console.log('  9 - Searching for Repositories');
    console.log('  10 - Complete Integration Workflow');
    console.log('\nUsage: tsx examples/github-integration-example.ts [1-10]');
    return;
  }

  try {
    await exampleFn();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
