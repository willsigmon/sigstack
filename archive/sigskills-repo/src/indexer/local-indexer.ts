/**
 * Local skill indexer - scans ~/.claude/skills/ and indexes all skills
 * Supports file watching with auto-reindex on changes
 */

import chokidar, { FSWatcher } from 'chokidar';
import { join } from 'path';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { createHash } from 'crypto';
import { logger } from '../utils/logger.js';
import { skillParser } from '../utils/parser.js';
import { getDatabase, type Skill } from '../db/index.js';
import type { IndexerOptions, IndexResult } from '../types.js';

export class LocalSkillIndexer {
  private log = logger.child('local-indexer');
  private watcher: FSWatcher | null = null;
  private skillsPath: string;
  private options: Required<IndexerOptions>;
  private indexing = false;
  private pendingChanges = new Set<string>();
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor(skillsPath: string, options: IndexerOptions = {}) {
    this.skillsPath = skillsPath;
    this.options = {
      watchForChanges: options.watchForChanges ?? false,
      debounceMs: options.debounceMs ?? 1000,
      ignoreDotfiles: options.ignoreDotfiles ?? true,
      maxFileSize: options.maxFileSize ?? 1024 * 1024, // 1MB default
    };

    this.log.info(`Initialized local indexer for: ${skillsPath}`);
  }

  /**
   * Start indexing and optionally watch for changes
   */
  async start(): Promise<IndexResult> {
    if (!existsSync(this.skillsPath)) {
      this.log.warn(`Skills path does not exist: ${this.skillsPath}`);
      return { added: 0, updated: 0, removed: 0, errors: [`Path does not exist: ${this.skillsPath}`] };
    }

    // Initial full index
    const result = await this.indexAll();

    // Start file watcher if enabled
    if (this.options.watchForChanges) {
      this.startWatcher();
    }

    return result;
  }

  /**
   * Stop the indexer and file watcher
   */
  async stop(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
      this.log.info('File watcher stopped');
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * Index all skills in the directory
   */
  async indexAll(): Promise<IndexResult> {
    if (this.indexing) {
      this.log.warn('Indexing already in progress, skipping');
      return { added: 0, updated: 0, removed: 0, errors: ['Indexing already in progress'] };
    }

    this.indexing = true;
    this.log.info('Starting full index of skills directory...');

    const result: IndexResult = {
      added: 0,
      updated: 0,
      removed: 0,
      errors: [],
    };

    try {
      const files = await this.findSkillFiles(this.skillsPath);
      this.log.info(`Found ${files.length} skill files`);

      for (const file of files) {
        try {
          const fileResult = await this.indexFile(file);
          if (fileResult === 'added') result.added++;
          else if (fileResult === 'updated') result.updated++;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          this.log.error(`Failed to index ${file}: ${message}`);
          result.errors.push(`${file}: ${message}`);
        }
      }

      // Clean up removed files
      const removed = await this.removeDeletedSkills(files);
      result.removed = removed;

      this.log.info(
        `Indexing complete: ${result.added} added, ${result.updated} updated, ${result.removed} removed, ${result.errors.length} errors`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.log.error(`Indexing failed: ${message}`);
      result.errors.push(message);
    } finally {
      this.indexing = false;
    }

    return result;
  }

  /**
   * Index a single skill file
   */
  async indexFile(filePath: string): Promise<'added' | 'updated' | 'skipped'> {
    // Check file size
    const stats = await stat(filePath);
    if (stats.size > this.options.maxFileSize) {
      this.log.warn(`File too large, skipping: ${filePath} (${stats.size} bytes)`);
      return 'skipped';
    }

    // Parse the skill file
    const parsed = await skillParser.parseFile(filePath);

    // Validate the skill
    if (!skillParser.validateSkill(parsed)) {
      this.log.warn(`Invalid skill, skipping: ${filePath}`);
      return 'skipped';
    }

    // Create skill object
    const skillId = this.generateSkillId(parsed.name, filePath);

    const skill: Omit<Skill, 'created_at' | 'updated_at'> = {
      id: skillId,
      name: parsed.name,
      description: parsed.description,
      content: parsed.content,
      source_type: 'local',
      source_path: filePath,
      format: parsed.format,
      metadata: parsed.metadata,
      checksum: parsed.checksum,
    };

    // Check if skill already exists
    const db = getDatabase();
    const existing = db.getSkill(skillId);

    if (existing) {
      // Check if content changed
      if (existing.checksum === skill.checksum) {
        this.log.debug(`Skill unchanged, skipping: ${skill.name}`);
        return 'skipped';
      }

      // Upsert will update existing skill
      db.upsertSkill(skill);
      this.log.debug(`Skill updated: ${skill.name}`);
      return 'updated';
    } else {
      // Upsert will insert new skill
      db.upsertSkill(skill);
      this.log.debug(`Skill added: ${skill.name}`);
      return 'added';
    }
  }


  /**
   * Remove skills from database that no longer exist on disk
   */
  private async removeDeletedSkills(existingFiles: string[]): Promise<number> {
    const db = getDatabase();

    // Get all skills from this source path
    const dbConnection = db.getConnection();
    const dbSkills = dbConnection
      .prepare('SELECT id, source_path FROM skills WHERE source_type = ? AND source_path LIKE ?')
      .all('local', `${this.skillsPath}%`) as { id: string; source_path: string | null }[];

    const existingFilesSet = new Set(existingFiles);
    let removed = 0;

    for (const dbSkill of dbSkills) {
      if (dbSkill.source_path && !existingFilesSet.has(dbSkill.source_path)) {
        db.deleteSkill(dbSkill.id);
        this.log.debug(`Removed deleted skill: ${dbSkill.source_path}`);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Recursively find all skill files
   */
  private async findSkillFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      // Skip dotfiles if configured
      if (this.options.ignoreDotfiles && entry.name.startsWith('.')) {
        continue;
      }

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        const subFiles = await this.findSkillFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && this.isSkillFile(entry.name)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Check if filename matches skill file patterns
   */
  private isSkillFile(filename: string): boolean {
    const ext = filename.toLowerCase();
    return ext.endsWith('.md') || ext.endsWith('.json') || ext.endsWith('.yaml') || ext.endsWith('.yml');
  }

  /**
   * Generate a unique skill ID from name and path
   */
  private generateSkillId(name: string, path: string): string {
    // Use hash of name + path for consistent IDs
    const hash = createHash('sha256')
      .update(`${name}:${path}`)
      .digest('hex')
      .substring(0, 16);
    return `local-${hash}`;
  }

  /**
   * Start file watcher for automatic reindexing
   */
  private startWatcher(): void {
    if (this.watcher) {
      this.log.warn('File watcher already started');
      return;
    }

    this.log.info('Starting file watcher...');

    this.watcher = chokidar.watch(this.skillsPath, {
      persistent: true,
      ignoreInitial: true,
      ignored: this.options.ignoreDotfiles ? /(^|[\/\\])\../ : undefined,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    });

    this.watcher
      .on('add', (path) => this.handleFileChange('add', path))
      .on('change', (path) => this.handleFileChange('change', path))
      .on('unlink', (path) => this.handleFileChange('unlink', path))
      .on('error', (error) => this.log.error('Watcher error:', error));

    this.log.info('File watcher started');
  }

  /**
   * Handle file change events with debouncing
   */
  private handleFileChange(event: 'add' | 'change' | 'unlink', path: string): void {
    if (!this.isSkillFile(path)) {
      return;
    }

    this.log.debug(`File ${event}: ${path}`);
    this.pendingChanges.add(path);

    // Debounce multiple rapid changes
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.processPendingChanges();
    }, this.options.debounceMs);
  }

  /**
   * Process accumulated file changes
   */
  private async processPendingChanges(): Promise<void> {
    if (this.indexing) {
      // Reschedule if already indexing
      this.debounceTimer = setTimeout(() => this.processPendingChanges(), this.options.debounceMs);
      return;
    }

    const changes = Array.from(this.pendingChanges);
    this.pendingChanges.clear();

    this.log.info(`Processing ${changes.length} file changes...`);

    for (const file of changes) {
      try {
        if (existsSync(file)) {
          await this.indexFile(file);
        } else {
          // File was deleted - find and remove by source_path
          const db = getDatabase();
          const dbConnection = db.getConnection();
          const skill = dbConnection
            .prepare('SELECT id FROM skills WHERE source_path = ?')
            .get(file) as { id: string } | undefined;

          if (skill) {
            db.deleteSkill(skill.id);
            this.log.debug(`Removed deleted skill: ${file}`);
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.log.error(`Failed to process ${file}: ${message}`);
      }
    }
  }

  /**
   * Get indexer status
   */
  getStatus(): {
    path: string;
    watching: boolean;
    indexing: boolean;
    pendingChanges: number;
  } {
    return {
      path: this.skillsPath,
      watching: this.watcher !== null,
      indexing: this.indexing,
      pendingChanges: this.pendingChanges.size,
    };
  }
}

/**
 * Create and start a local skill indexer
 */
export async function createLocalIndexer(
  skillsPath: string,
  options?: IndexerOptions
): Promise<LocalSkillIndexer> {
  const indexer = new LocalSkillIndexer(skillsPath, options);
  await indexer.start();
  return indexer;
}
