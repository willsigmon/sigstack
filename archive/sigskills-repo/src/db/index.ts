/**
 * Database Interface for SigSkills
 * SQLite-based storage with better-sqlite3
 */

import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { createHash } from 'crypto';
import { logger } from '../utils/logger.js';
import { fileURLToPath } from 'url';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Types based on ARCHITECTURE.md

export interface Skill {
  id: string;
  name: string;
  description: string;
  content: string;
  format: 'claude' | 'codex' | 'universal';
  source_type: 'local' | 'github' | 'codex' | 'custom' | 'generated';
  source_path?: string;
  source_repo?: string;
  source_branch?: string;
  source_commit?: string;
  source_url?: string;
  metadata: SkillMetadata;
  embedding?: Buffer;
  checksum: string;
  created_at: number;
  updated_at: number;
  last_synced_at?: number;
}

export interface SkillMetadata {
  author?: string;
  version?: string;
  tags?: string[];
  category?: string;
  dependencies?: string[];
  mcp_tools?: string[];
  created_at: Date;
  updated_at: Date;
  last_used?: Date;
  usage_count?: number;
}

export interface MCPTool {
  id: string;
  server_name: string;
  tool_name: string;
  description: string;
  parameters: Record<string, any>;
  source: string;
  embedding?: Buffer;
  created_at: number;
  updated_at: number;
}

export interface Source {
  id: string;
  type: 'local' | 'github' | 'codex' | 'custom';
  path?: string;
  repo?: string;
  branch?: string;
  url?: string;
  config: SourceConfig;
  enabled: boolean;
  skill_count: number;
  last_synced_at?: number;
  created_at: number;
  updated_at: number;
}

export interface SourceConfig {
  watch?: boolean;
  sync_interval?: string;
  auth?: Record<string, any>;
  [key: string]: any;
}

export interface SyncState {
  skill_id: string;
  source_id: string;
  checksum: string;
  synced_at: number;
}

export interface SearchResult {
  skill: Skill;
  score: number;
  snippet?: string;
}

// Database row types (JSON fields as strings)
interface SkillRow extends Omit<Skill, 'metadata'> {
  metadata: string;
}

interface MCPToolRow extends Omit<MCPTool, 'parameters'> {
  parameters: string;
}

interface SourceRow extends Omit<Source, 'config' | 'enabled'> {
  config: string;
  enabled: number;
}

/**
 * Database class for managing SigSkills storage
 */
export class SkillsDatabase {
  private db: Database.Database;
  private readonly dbPath: string;
  private static instance: SkillsDatabase | null = null;

  constructor(dbPath?: string) {
    // Default to ~/.sigskills/sigskills.db
    this.dbPath = dbPath || join(homedir(), '.sigskills', 'sigskills.db');

    // Ensure directory exists
    const dir = dirname(this.dbPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Initialize database
    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL'); // Better concurrency
    this.db.pragma('foreign_keys = ON');  // Enforce foreign keys
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = 10000');
    this.db.pragma('temp_store = MEMORY');

    logger.info(`Database initialized at ${this.dbPath}`);
  }

  static getInstance(dbPath?: string): SkillsDatabase {
    if (!SkillsDatabase.instance) {
      SkillsDatabase.instance = new SkillsDatabase(dbPath);
    }
    return SkillsDatabase.instance;
  }

  /**
   * Initialize database schema
   */
  async initialize(): Promise<void> {
    const schemaPath = join(__dirname, 'schema.sql');
    const fallbackSchemaPath = join(__dirname, '../../src/db/schema.sql');
    const resolvedSchemaPath = existsSync(schemaPath) ? schemaPath : fallbackSchemaPath;

    if (!existsSync(resolvedSchemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath} or ${fallbackSchemaPath}`);
    }

    const schema = readFileSync(resolvedSchemaPath, 'utf-8');
    this.db.exec(schema);
    logger.debug('Database schema initialized');
  }

  /**
   * Run migrations
   */
  async migrate(): Promise<void> {
    // Create migrations table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT NOT NULL UNIQUE,
        applied_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);

    let migrationsDir = join(__dirname, 'migrations');
    if (!existsSync(migrationsDir)) {
      const fallbackMigrationsDir = join(__dirname, '../../src/db/migrations');
      if (existsSync(fallbackMigrationsDir)) {
        migrationsDir = fallbackMigrationsDir;
      }
    }

    if (!existsSync(migrationsDir)) {
      logger.debug('No migrations directory found');
      return;
    }

    const appliedMigrations = this.db
      .prepare('SELECT version FROM migrations ORDER BY version')
      .all()
      .map((row: any) => row.version);

    // Read migration files
    const fs = await import('fs/promises');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const version = file.replace('.sql', '');
      if (appliedMigrations.includes(version)) {
        continue; // Already applied
      }

      const migrationPath = join(migrationsDir, file);
      const migration = await fs.readFile(migrationPath, 'utf-8');

      // Run migration in transaction
      this.transaction(() => {
        this.db.exec(migration);
        this.db.prepare('INSERT INTO migrations (version) VALUES (?)').run(version);
      });

      logger.info(`Applied migration: ${version}`);
    }
  }

  /**
   * Execute a transaction
   */
  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)();
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
    SkillsDatabase.instance = null;
    logger.info('Database connection closed');
  }

  /**
   * Get raw database connection (use sparingly)
   */
  getConnection(): Database.Database {
    return this.db;
  }

  /**
   * Execute a raw SQL query (SELECT) that returns multiple rows
   */
  query<T = any>(sql: string, params: any[] = []): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  /**
   * Execute a raw SQL query (SELECT) that returns a single row
   */
  queryOne<T = any>(sql: string, params: any[] = []): T | null {
    const stmt = this.db.prepare(sql);
    const result = stmt.get(...params);
    return result ? (result as T) : null;
  }

  /**
   * Execute a raw SQL statement (INSERT/UPDATE/DELETE)
   */
  execute(sql: string, params: any[] = []): Database.RunResult {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  // ============================================================================
  // Skills CRUD
  // ============================================================================

  /**
   * Insert or update a skill
   */
  upsertSkill(skill: Omit<Skill, 'created_at' | 'updated_at'>): Skill {
    const now = Math.floor(Date.now() / 1000);

    const stmt = this.db.prepare(`
      INSERT INTO skills (
        id, name, description, content, format,
        source_type, source_path, source_repo, source_branch, source_commit, source_url,
        metadata, embedding, checksum, created_at, updated_at, last_synced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        content = excluded.content,
        format = excluded.format,
        source_type = excluded.source_type,
        source_path = excluded.source_path,
        source_repo = excluded.source_repo,
        source_branch = excluded.source_branch,
        source_commit = excluded.source_commit,
        source_url = excluded.source_url,
        metadata = excluded.metadata,
        embedding = excluded.embedding,
        checksum = excluded.checksum,
        updated_at = excluded.updated_at,
        last_synced_at = excluded.last_synced_at
    `);

    stmt.run(
      skill.id,
      skill.name,
      skill.description,
      skill.content,
      skill.format,
      skill.source_type,
      skill.source_path || null,
      skill.source_repo || null,
      skill.source_branch || null,
      skill.source_commit || null,
      skill.source_url || null,
      JSON.stringify(skill.metadata),
      skill.embedding || null,
      skill.checksum,
      now,
      now,
      skill.last_synced_at || null
    );

    return this.getSkill(skill.id)!;
  }

  /**
   * Get skill by ID
   */
  getSkill(id: string): Skill | null {
    const row = this.db
      .prepare('SELECT * FROM skills WHERE id = ?')
      .get(id) as SkillRow | undefined;

    return row ? this.deserializeSkill(row) : null;
  }

  /**
   * Get skill by name and source
   */
  getSkillByName(name: string, sourceType?: string): Skill | null {
    const sql = sourceType
      ? 'SELECT * FROM skills WHERE name = ? AND source_type = ?'
      : 'SELECT * FROM skills WHERE name = ?';

    const row = this.db
      .prepare(sql)
      .get(...(sourceType ? [name, sourceType] : [name])) as SkillRow | undefined;

    return row ? this.deserializeSkill(row) : null;
  }

  /**
   * List all skills with optional filters
   */
  listSkills(filters?: {
    sourceType?: string;
    format?: string;
    limit?: number;
    offset?: number;
  }): Skill[] {
    let sql = 'SELECT * FROM skills WHERE 1=1';
    const params: any[] = [];

    if (filters?.sourceType) {
      sql += ' AND source_type = ?';
      params.push(filters.sourceType);
    }

    if (filters?.format) {
      sql += ' AND format = ?';
      params.push(filters.format);
    }

    sql += ' ORDER BY updated_at DESC';

    if (filters?.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);

      if (filters?.offset) {
        sql += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    const rows = this.db.prepare(sql).all(...params) as SkillRow[];
    return rows.map((row) => this.deserializeSkill(row));
  }

  /**
   * Delete skill by ID
   */
  deleteSkill(id: string): boolean {
    const result = this.db.prepare('DELETE FROM skills WHERE id = ?').run(id);
    return result.changes > 0;
  }

  /**
   * Full-text search skills
   */
  searchSkillsKeyword(query: string, limit: number = 10): Skill[] {
    const rows = this.db
      .prepare(`
        SELECT s.* FROM skills s
        JOIN skills_fts fts ON s.rowid = fts.rowid
        WHERE skills_fts MATCH ?
        ORDER BY rank
        LIMIT ?
      `)
      .all(query, limit) as SkillRow[];

    return rows.map((row) => this.deserializeSkill(row));
  }

  /**
   * Calculate checksum for skill content
   */
  static calculateChecksum(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  // ============================================================================
  // MCP Tools CRUD
  // ============================================================================

  /**
   * Insert or update MCP tool
   */
  upsertMCPTool(tool: Omit<MCPTool, 'created_at' | 'updated_at'>): MCPTool {
    const now = Math.floor(Date.now() / 1000);

    const stmt = this.db.prepare(`
      INSERT INTO mcp_tools (
        id, server_name, tool_name, description, parameters, source, embedding,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        server_name = excluded.server_name,
        tool_name = excluded.tool_name,
        description = excluded.description,
        parameters = excluded.parameters,
        source = excluded.source,
        embedding = excluded.embedding,
        updated_at = excluded.updated_at
    `);

    stmt.run(
      tool.id,
      tool.server_name,
      tool.tool_name,
      tool.description,
      JSON.stringify(tool.parameters),
      tool.source,
      tool.embedding || null,
      now,
      now
    );

    return this.getMCPTool(tool.id)!;
  }

  /**
   * Get MCP tool by ID
   */
  getMCPTool(id: string): MCPTool | null {
    const row = this.db
      .prepare('SELECT * FROM mcp_tools WHERE id = ?')
      .get(id) as MCPToolRow | undefined;

    return row ? this.deserializeMCPTool(row) : null;
  }

  /**
   * List MCP tools
   */
  listMCPTools(filters?: { serverName?: string; limit?: number }): MCPTool[] {
    let sql = 'SELECT * FROM mcp_tools WHERE 1=1';
    const params: any[] = [];

    if (filters?.serverName) {
      sql += ' AND server_name = ?';
      params.push(filters.serverName);
    }

    sql += ' ORDER BY server_name, tool_name';

    if (filters?.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
    }

    const rows = this.db.prepare(sql).all(...params) as MCPToolRow[];
    return rows.map((row) => this.deserializeMCPTool(row));
  }

  /**
   * Full-text search MCP tools
   */
  searchMCPToolsKeyword(query: string, limit: number = 10): MCPTool[] {
    const rows = this.db
      .prepare(`
        SELECT t.* FROM mcp_tools t
        JOIN mcp_tools_fts fts ON t.rowid = fts.rowid
        WHERE mcp_tools_fts MATCH ?
        ORDER BY rank
        LIMIT ?
      `)
      .all(query, limit) as MCPToolRow[];

    return rows.map((row) => this.deserializeMCPTool(row));
  }

  /**
   * Delete MCP tool
   */
  deleteMCPTool(id: string): boolean {
    const result = this.db.prepare('DELETE FROM mcp_tools WHERE id = ?').run(id);
    return result.changes > 0;
  }

  // ============================================================================
  // Sources CRUD
  // ============================================================================

  /**
   * Insert or update source
   */
  upsertSource(source: Omit<Source, 'created_at' | 'updated_at'>): Source {
    const now = Math.floor(Date.now() / 1000);

    const stmt = this.db.prepare(`
      INSERT INTO sources (
        id, type, path, repo, branch, url, config, enabled, skill_count, last_synced_at,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        type = excluded.type,
        path = excluded.path,
        repo = excluded.repo,
        branch = excluded.branch,
        url = excluded.url,
        config = excluded.config,
        enabled = excluded.enabled,
        skill_count = excluded.skill_count,
        last_synced_at = excluded.last_synced_at,
        updated_at = excluded.updated_at
    `);

    stmt.run(
      source.id,
      source.type,
      source.path || null,
      source.repo || null,
      source.branch || null,
      source.url || null,
      JSON.stringify(source.config),
      source.enabled ? 1 : 0,
      source.skill_count,
      source.last_synced_at || null,
      now,
      now
    );

    return this.getSource(source.id)!;
  }

  /**
   * Get source by ID
   */
  getSource(id: string): Source | null {
    const row = this.db
      .prepare('SELECT * FROM sources WHERE id = ?')
      .get(id) as SourceRow | undefined;

    return row ? this.deserializeSource(row) : null;
  }

  /**
   * List all sources
   */
  listSources(enabledOnly: boolean = false): Source[] {
    const sql = enabledOnly
      ? 'SELECT * FROM sources WHERE enabled = 1 ORDER BY type, path'
      : 'SELECT * FROM sources ORDER BY type, path';

    const rows = this.db.prepare(sql).all() as SourceRow[];
    return rows.map((row) => this.deserializeSource(row));
  }

  /**
   * Delete source
   */
  deleteSource(id: string): boolean {
    const result = this.db.prepare('DELETE FROM sources WHERE id = ?').run(id);
    return result.changes > 0;
  }

  /**
   * Update source skill count
   */
  updateSourceSkillCount(sourceId: string): void {
    this.db.prepare(`
      UPDATE sources
      SET skill_count = (
        SELECT COUNT(*) FROM sync_state WHERE source_id = ?
      )
      WHERE id = ?
    `).run(sourceId, sourceId);
  }

  // ============================================================================
  // Sync State CRUD
  // ============================================================================

  /**
   * Upsert sync state
   */
  upsertSyncState(state: Omit<SyncState, 'synced_at'>): void {
    const now = Math.floor(Date.now() / 1000);

    this.db.prepare(`
      INSERT INTO sync_state (skill_id, source_id, checksum, synced_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(skill_id, source_id) DO UPDATE SET
        checksum = excluded.checksum,
        synced_at = excluded.synced_at
    `).run(state.skill_id, state.source_id, state.checksum, now);
  }

  /**
   * Get sync state
   */
  getSyncState(skillId: string, sourceId: string): SyncState | null {
    return this.db
      .prepare('SELECT * FROM sync_state WHERE skill_id = ? AND source_id = ?')
      .get(skillId, sourceId) as SyncState | null;
  }

  /**
   * List sync states for a source
   */
  listSyncStates(sourceId: string): SyncState[] {
    return this.db
      .prepare('SELECT * FROM sync_state WHERE source_id = ? ORDER BY synced_at DESC')
      .all(sourceId) as SyncState[];
  }

  /**
   * Delete sync state
   */
  deleteSyncState(skillId: string, sourceId: string): boolean {
    const result = this.db
      .prepare('DELETE FROM sync_state WHERE skill_id = ? AND source_id = ?')
      .run(skillId, sourceId);
    return result.changes > 0;
  }

  // ============================================================================
  // Helper methods
  // ============================================================================

  private deserializeSkill(row: SkillRow): Skill {
    return {
      ...row,
      metadata: JSON.parse(row.metadata),
    };
  }

  private deserializeMCPTool(row: MCPToolRow): MCPTool {
    return {
      ...row,
      parameters: JSON.parse(row.parameters),
    };
  }

  private deserializeSource(row: SourceRow): Source {
    return {
      ...row,
      config: JSON.parse(row.config),
      enabled: row.enabled === 1,
    };
  }

  /**
   * Get database statistics
   */
  getStats(): {
    skills: number;
    mcpTools: number;
    sources: number;
    syncStates: number;
  } {
    const stats = this.db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM skills) as skills,
        (SELECT COUNT(*) FROM mcp_tools) as mcpTools,
        (SELECT COUNT(*) FROM sources) as sources,
        (SELECT COUNT(*) FROM sync_state) as syncStates
    `).get() as any;

    return {
      skills: stats.skills,
      mcpTools: stats.mcpTools,
      sources: stats.sources,
      syncStates: stats.syncStates,
    };
  }

  /**
   * Vacuum database (optimize)
   */
  vacuum(): void {
    this.db.exec('VACUUM');
  }
}

/**
 * Create and initialize default database instance
 */
export async function createDatabase(dbPath?: string): Promise<SkillsDatabase> {
  const db = SkillsDatabase.getInstance(dbPath);
  await db.initialize();
  await db.migrate();
  return db;
}

// Export singleton getter
export const getDatabase = (dbPath?: string): SkillsDatabase => {
  return SkillsDatabase.getInstance(dbPath);
};
