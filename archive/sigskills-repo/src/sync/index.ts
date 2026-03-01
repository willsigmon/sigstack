/**
 * Sync engine exports
 * Central module for bi-directional skill synchronization
 */

export { SyncEngine, syncEngine } from './sync-engine.js';
export { ConflictResolver, conflictResolver } from './conflict.js';
export type {
  Conflict,
  ConflictResolution,
  ConflictStrategy,
} from './conflict.js';
export type {
  SourceIndexer,
  SourceMetadata,
  SyncDirection,
  SyncOperationResult,
  ConflictInfo,
  SyncError,
  SyncStateRecord,
  SyncOptions,
  SourceConfig,
  SyncProgressCallback,
  SyncProgress,
} from './types.js';
export type {
  SyncChange,
  SyncState,
} from './sync-engine.js';

// GitHub Sync Engine
export {
  GitHubSyncEngine,
  createGitHubSyncEngine,
  type SyncProgress as GitHubSyncProgress,
  type SyncSchedule,
} from './github-sync-engine.js';
