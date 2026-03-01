/**
 * Example usage of the Local Skill Indexer
 *
 * This demonstrates how to:
 * 1. Create and start a local indexer
 * 2. Index skills from ~/.claude/skills/
 * 3. Enable file watching for auto-reindexing
 * 4. Check indexer status
 */

import { homedir } from 'os';
import { join } from 'path';
import { createLocalIndexer } from '../src/indexer/local-indexer.js';
import { logger, LogLevel } from '../src/utils/logger.js';

async function main() {
  // Set log level (DEBUG to see all activity)
  logger.setLevel(LogLevel.DEBUG);

  // Path to Claude skills directory
  const skillsPath = join(homedir(), '.claude', 'skills');

  console.log(`\nIndexing skills from: ${skillsPath}\n`);

  try {
    // Create and start indexer with file watching enabled
    const indexer = await createLocalIndexer(skillsPath, {
      watchForChanges: true, // Enable file watching
      debounceMs: 1000, // Wait 1 second after last change before reindexing
      ignoreDotfiles: true, // Skip dotfiles like .DS_Store
      maxFileSize: 1024 * 1024, // Skip files larger than 1MB
    });

    // Get initial index results
    const status = indexer.getStatus();
    console.log('\nIndexer Status:');
    console.log(`  Path: ${status.path}`);
    console.log(`  Watching: ${status.watching}`);
    console.log(`  Currently Indexing: ${status.indexing}`);
    console.log(`  Pending Changes: ${status.pendingChanges}`);

    console.log('\nIndexer is now running and watching for changes...');
    console.log('Press Ctrl+C to stop.\n');

    // Keep the process running
    await new Promise(() => {
      // Run forever (or until Ctrl+C)
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Example: One-time indexing without watching
async function oneTimeIndex() {
  const skillsPath = join(homedir(), '.claude', 'skills');

  const indexer = await createLocalIndexer(skillsPath, {
    watchForChanges: false, // Disable file watching
  });

  const status = indexer.getStatus();
  console.log('Indexing complete!');
  console.log(`  Path: ${status.path}`);

  // Stop the indexer
  await indexer.stop();
}

// Run the main example
main().catch(console.error);

// Or run one-time indexing:
// oneTimeIndex().catch(console.error);
