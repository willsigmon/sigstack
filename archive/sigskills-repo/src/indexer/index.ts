/**
 * Indexer Module Exports
 *
 * Barrel file for all indexer components
 */

// GitHub Indexer
export {
  GitHubIndexer,
  type GitHubRepoConfig,
  type GitHubSkillFile,
  type GitHubIndexResult,
  type GitHubRepoMetadata,
} from './github-indexer.js';

// GitHub Source Manager
export {
  GitHubSourceManager,
  type GitHubSource,
  type AddGitHubSourceParams,
  type GitHubSourceUpdate,
  type SyncResult,
} from './github-source-manager.js';

// GitHub Database Adapter
export { GitHubDatabaseAdapter } from './github-db-adapter.js';
