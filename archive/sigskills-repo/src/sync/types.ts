/**
 * Type definitions for sync engine and source integrations
 */

import type { Skill } from '../types/skill.js';

/**
 * Interface that source indexers must implement to work with the sync engine
 */
export interface SourceIndexer {
  /**
   * Unique identifier for this source
   */
  sourceId: string;

  /**
   * Source type
   */
  sourceType: 'local' | 'github' | 'codex' | 'custom';

  /**
   * Fetch all skills from the source
   */
  fetchSkills(): Promise<Skill[]>;

  /**
   * Fetch a specific skill by ID
   */
  fetchSkill(skillId: string): Promise<Skill | null>;

  /**
   * Push a skill to the source (if supported)
   * @throws Error if push is not supported
   */
  pushSkill?(skill: Skill): Promise<void>;

  /**
   * Delete a skill from the source (if supported)
   * @throws Error if delete is not supported
   */
  deleteSkill?(skillId: string): Promise<void>;

  /**
   * Check if source supports push operations
   */
  canPush(): boolean;

  /**
   * Check if source supports delete operations
   */
  canDelete(): boolean;

  /**
   * Get source metadata (for display/logging)
   */
  getMetadata(): SourceMetadata;
}

/**
 * Source metadata
 */
export interface SourceMetadata {
  id: string;
  type: 'local' | 'github' | 'codex' | 'custom';
  name: string;
  description?: string;
  path?: string;
  repo?: string;
  branch?: string;
  url?: string;
  enabled: boolean;
  lastSynced?: Date;
  skillCount: number;
}

/**
 * Sync direction options
 */
export type SyncDirection = 'pull' | 'push' | 'both';

/**
 * Conflict resolution strategy
 */
export type ConflictStrategy = 'overwrite' | 'merge' | 'skip' | 'backup' | 'newest' | 'manual';

/**
 * Sync operation result
 */
export interface SyncOperationResult {
  success: boolean;
  added: number;
  updated: number;
  deleted: number;
  skipped: number;
  conflicts: ConflictInfo[];
  errors: SyncError[];
}

/**
 * Conflict information
 */
export interface ConflictInfo {
  skillId: string;
  skillName: string;
  reason: string;
  resolution?: string;
  localChecksum?: string;
  remoteChecksum?: string;
  localUpdatedAt?: Date;
  remoteUpdatedAt?: Date;
}

/**
 * Sync error information
 */
export interface SyncError {
  skillId?: string;
  skillName?: string;
  operation: 'fetch' | 'push' | 'delete' | 'resolve';
  error: string;
  recoverable: boolean;
}

/**
 * Sync state record
 */
export interface SyncStateRecord {
  skillId: string;
  sourceId: string;
  checksum: string;
  syncedAt: Date;
}

/**
 * Sync options
 */
export interface SyncOptions {
  source?: string;
  direction?: SyncDirection;
  dryRun?: boolean;
  strategy?: ConflictStrategy;
  force?: boolean;
  includeDisabled?: boolean;
}

/**
 * Source configuration
 */
export interface SourceConfig {
  id: string;
  type: 'local' | 'github' | 'codex' | 'custom';
  enabled: boolean;

  // Local source config
  path?: string;
  watch?: boolean;

  // GitHub source config
  repo?: string;
  branch?: string;
  token?: string;

  // Codex source config
  codexPath?: string;

  // Custom source config
  url?: string;
  auth?: {
    type: 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
  };

  // Common config
  syncInterval?: string; // e.g., "1h", "30m"
  autoSync?: boolean;
  conflictStrategy?: ConflictStrategy;
}

/**
 * Sync progress callback
 */
export type SyncProgressCallback = (progress: SyncProgress) => void;

/**
 * Sync progress information
 */
export interface SyncProgress {
  phase: 'fetch' | 'detect' | 'resolve' | 'apply' | 'complete';
  current: number;
  total: number;
  currentSkill?: string;
  message?: string;
}
