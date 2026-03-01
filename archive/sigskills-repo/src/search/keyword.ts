/**
 * Keyword-based search using SQLite FTS5
 * Fallback when semantic search is unavailable or for exact matches
 */

import { getDatabase } from '../db/index.js';
import { logger } from '../utils/logger.js';

export interface KeywordSearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  source?: 'local' | 'github' | 'codex' | 'all';
  format?: 'claude' | 'codex' | 'both';
  category?: string;
  tags?: string[];
  includeContent?: boolean;
}

export interface KeywordSearchResult {
  id: string;
  name: string;
  description: string;
  source_type: string;
  format: string;
  score: number; // BM25 rank from FTS5
  snippet?: string;
  content?: string;
  metadata?: string;
  category?: string;
  tags?: string[];
}

export class KeywordSearch {
  private db = getDatabase();
  private searchLogger = logger.child('keyword-search');

  /**
   * Search skills using FTS5 full-text search
   */
  async search(options: KeywordSearchOptions): Promise<KeywordSearchResult[]> {
    const {
      query,
      limit = 10,
      offset = 0,
      source,
      format,
      category,
      tags,
      includeContent = false,
    } = options;

    this.searchLogger.debug(`Searching for: "${query}" (limit: ${limit})`);

    // Build FTS5 query
    const ftsQuery = this.buildFTS5Query(query);

    // Build SQL with filters
    let sql = `
      SELECT
        s.id,
        s.name,
        s.description,
        s.source_type,
        s.format,
        s.metadata,
        fts.rank as score
        ${includeContent ? ', s.content' : ''}
      FROM skills_fts fts
      JOIN skills s ON s.rowid = fts.rowid
      WHERE fts MATCH ?
    `;

    const params: any[] = [ftsQuery];

    // Add source filter
    if (source && source !== 'all') {
      sql += ' AND s.source_type = ?';
      params.push(source);
    }

    // Add format filter
    if (format && format !== 'both') {
      sql += ' AND s.format = ?';
      params.push(format);
    }

    // Add category filter
    if (category) {
      sql += ' AND json_extract(s.metadata, "$.category") = ?';
      params.push(category);
    }

    // Add tag filter
    if (tags && tags.length > 0) {
      // Check if any of the tags match
      const tagConditions = tags.map(() => `json_extract(s.metadata, '$.tags') LIKE ?`).join(' OR ');
      sql += ` AND (${tagConditions})`;
      tags.forEach((tag) => params.push(`%"${tag}"%`));
    }

    // Order by FTS5 rank (lower is better)
    sql += ' ORDER BY fts.rank LIMIT ? OFFSET ?';
    params.push(limit, offset);

    try {
      const dbConn = this.db.getConnection();
      const results = dbConn.prepare(sql).all(...params) as any[];

      return results.map((row) => {
        const metadata = row.metadata ? JSON.parse(row.metadata) : {};

        return {
          id: row.id,
          name: row.name,
          description: row.description,
          source_type: row.source_type,
          format: row.format,
          score: this.normalizeFTS5Rank(row.score), // Normalize to 0-1
          snippet: includeContent ? undefined : this.createSnippet(row.description),
          content: includeContent ? row.content : undefined,
          metadata: row.metadata,
          category: metadata.category,
          tags: metadata.tags,
        };
      });
    } catch (error) {
      this.searchLogger.error('Keyword search failed', error);
      throw error;
    }
  }

  /**
   * Search with exact name match (highest priority)
   */
  async searchExact(name: string, options?: Partial<KeywordSearchOptions>): Promise<KeywordSearchResult[]> {
    const sql = `
      SELECT
        id,
        name,
        description,
        source_type,
        format,
        metadata
        ${options?.includeContent ? ', content' : ''}
      FROM skills
      WHERE name = ?
      ${options?.source && options.source !== 'all' ? 'AND source_type = ?' : ''}
      ${options?.format && options.format !== 'both' ? 'AND format = ?' : ''}
      ORDER BY updated_at DESC
      LIMIT ?
    `;

    const params: any[] = [name];
    if (options?.source && options.source !== 'all') params.push(options.source);
    if (options?.format && options.format !== 'both') params.push(options.format);
    params.push(options?.limit || 10);

    const dbConn = this.db.getConnection();
    const results = dbConn.prepare(sql).all(...params) as any[];

    return results.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      source_type: row.source_type,
      format: row.format,
      score: 1.0, // Perfect match
      snippet: options?.includeContent ? undefined : this.createSnippet(row.description),
      content: options?.includeContent ? row.content : undefined,
      metadata: row.metadata,
    }));
  }

  /**
   * Build FTS5 query with advanced features
   */
  private buildFTS5Query(query: string): string {
    // Clean and tokenize query
    const tokens = query
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 0);

    if (tokens.length === 0) {
      return '*'; // Match all
    }

    // Build FTS5 query with field weighting
    // name^3 description^2 content^1
    const nameQuery = tokens.map((t) => `name:${t}*`).join(' OR ');
    const descQuery = tokens.map((t) => `description:${t}*`).join(' OR ');
    const contentQuery = tokens.map((t) => `content:${t}*`).join(' OR ');

    return `(${nameQuery}) OR (${descQuery}) OR (${contentQuery})`;
  }

  /**
   * Normalize FTS5 rank to 0-1 score (higher is better)
   * FTS5 rank is negative, lower = better match
   */
  private normalizeFTS5Rank(rank: number): number {
    // Convert FTS5 rank (negative, unbounded) to 0-1 score
    // Using sigmoid-like transformation
    const normalized = 1 / (1 + Math.abs(rank) / 10);
    return Math.max(0, Math.min(1, normalized));
  }

  /**
   * Create snippet from text (first 200 chars)
   */
  private createSnippet(text: string, maxLength = 200): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength).trim() + '...';
  }

  /**
   * Get total count for a query (for pagination)
   */
  async getCount(options: KeywordSearchOptions): Promise<number> {
    const { query, source, format, category, tags } = options;

    const ftsQuery = this.buildFTS5Query(query);

    let sql = `
      SELECT COUNT(*) as count
      FROM skills_fts fts
      JOIN skills s ON s.rowid = fts.rowid
      WHERE fts MATCH ?
    `;

    const params: any[] = [ftsQuery];

    if (source && source !== 'all') {
      sql += ' AND s.source_type = ?';
      params.push(source);
    }

    if (format && format !== 'both') {
      sql += ' AND s.format = ?';
      params.push(format);
    }

    if (category) {
      sql += ' AND json_extract(s.metadata, "$.category") = ?';
      params.push(category);
    }

    if (tags && tags.length > 0) {
      const tagConditions = tags.map(() => `json_extract(s.metadata, '$.tags') LIKE ?`).join(' OR ');
      sql += ` AND (${tagConditions})`;
      tags.forEach((tag) => params.push(`%"${tag}"%`));
    }

    const dbConn = this.db.getConnection();
    const result = dbConn.prepare(sql).get(...params) as { count: number } | undefined;
    return result?.count || 0;
  }
}

// Export singleton
export const keywordSearch = new KeywordSearch();
