/**
 * Semantic search using vector similarity (cosine similarity)
 * Requires embeddings to be pre-generated
 */

import { getDatabase } from '../db/index.js';
import { embeddingGenerator, EmbeddingGenerator } from '../indexer/embeddings.js';
import { logger } from '../utils/logger.js';

export interface SemanticSearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  source?: 'local' | 'github' | 'codex' | 'all';
  format?: 'claude' | 'codex' | 'both';
  category?: string;
  tags?: string[];
  includeContent?: boolean;
  minScore?: number; // Minimum similarity score (0-1)
}

export interface SemanticSearchResult {
  id: string;
  name: string;
  description: string;
  source_type: string;
  format: string;
  score: number; // Cosine similarity (0-1, higher is better)
  snippet?: string;
  content?: string;
  metadata?: string;
  category?: string;
  tags?: string[];
}

export class SemanticSearch {
  private db = getDatabase();
  private embedder: EmbeddingGenerator;
  private searchLogger = logger.child('semantic-search');

  constructor(embedder?: EmbeddingGenerator) {
    this.embedder = embedder || embeddingGenerator;
  }

  /**
   * Check if semantic search is available
   */
  isAvailable(): boolean {
    return this.embedder.isAvailable();
  }

  /**
   * Perform semantic search using vector similarity
   */
  async search(options: SemanticSearchOptions): Promise<SemanticSearchResult[]> {
    if (!this.embedder.isAvailable()) {
      throw new Error('Semantic search unavailable - OpenAI API key not configured');
    }

    const {
      query,
      limit = 10,
      offset = 0,
      source,
      format,
      category,
      tags,
      includeContent = false,
      minScore = 0.0,
    } = options;

    this.searchLogger.debug(`Semantic search for: "${query}" (limit: ${limit})`);

    try {
      // Generate query embedding
      const queryEmbedding = await this.embedder.generateEmbedding(query);

      // Build SQL to fetch skills with embeddings
      let sql = `
        SELECT
          id,
          name,
          description,
          source_type,
          format,
          metadata,
          embedding
          ${includeContent ? ', content' : ''}
        FROM skills
        WHERE embedding IS NOT NULL
      `;

      const params: any[] = [];

      // Add filters
      if (source && source !== 'all') {
        sql += ' AND source_type = ?';
        params.push(source);
      }

      if (format && format !== 'both') {
        sql += ' AND format = ?';
        params.push(format);
      }

      if (category) {
        sql += ' AND json_extract(metadata, "$.category") = ?';
        params.push(category);
      }

      if (tags && tags.length > 0) {
        const tagConditions = tags.map(() => `json_extract(metadata, '$.tags') LIKE ?`).join(' OR ');
        sql += ` AND (${tagConditions})`;
        tags.forEach((tag) => params.push(`%"${tag}"%`));
      }

      // Fetch all matching skills
      const dbConn = this.db.getConnection();
      const skills = dbConn.prepare(sql).all(...params) as any[];

      // Calculate cosine similarity for each skill
      const results: SemanticSearchResult[] = skills
        .map((skill) => {
          const embedding = EmbeddingGenerator.parseEmbedding(skill.embedding);
          if (!embedding) return null;

          const score = this.cosineSimilarity(queryEmbedding, embedding);

          if (score < minScore) return null;

          const metadata = skill.metadata ? JSON.parse(skill.metadata) : {};

          const result: SemanticSearchResult = {
            id: skill.id,
            name: skill.name,
            description: skill.description,
            source_type: skill.source_type,
            format: skill.format,
            score,
            snippet: includeContent ? undefined : this.createSnippet(skill.description),
            content: includeContent ? skill.content : undefined,
            metadata: skill.metadata,
            category: metadata.category,
            tags: metadata.tags,
          };
          return result;
        })
        .filter((r): r is SemanticSearchResult => r !== null)
        .sort((a, b) => b.score - a.score) // Sort by similarity (descending)
        .slice(offset, offset + limit);

      this.searchLogger.debug(`Found ${results.length} results`);

      return results;
    } catch (error) {
      this.searchLogger.error('Semantic search failed', error);
      throw error;
    }
  }

  /**
   * Find similar skills to a given skill
   */
  async findSimilar(skillId: string, limit = 5): Promise<SemanticSearchResult[]> {
    // Get the skill's embedding
    const dbConn = this.db.getConnection();
    const skill = dbConn.prepare('SELECT name, embedding FROM skills WHERE id = ?').get(skillId) as { name: string; embedding: Buffer } | undefined;

    if (!skill || !skill.embedding) {
      throw new Error(`Skill ${skillId} not found or has no embedding`);
    }

    const skillEmbedding = EmbeddingGenerator.parseEmbedding(skill.embedding);
    if (!skillEmbedding) {
      throw new Error(`Failed to parse embedding for skill ${skillId}`);
    }

    // Find similar skills
    const allSkills = dbConn.prepare('SELECT id, name, description, source_type, format, metadata, embedding FROM skills WHERE id != ? AND embedding IS NOT NULL').all(skillId) as any[];

    const results: SemanticSearchResult[] = allSkills
      .map((s) => {
        const embedding = EmbeddingGenerator.parseEmbedding(s.embedding);
        if (!embedding) return null;

        const score = this.cosineSimilarity(skillEmbedding, embedding);

        const metadata = s.metadata ? JSON.parse(s.metadata) : {};

        const result: SemanticSearchResult = {
          id: s.id,
          name: s.name,
          description: s.description,
          source_type: s.source_type,
          format: s.format,
          score,
          snippet: this.createSnippet(s.description),
          metadata: s.metadata,
          category: metadata.category,
          tags: metadata.tags,
        };
        return result;
      })
      .filter((r): r is SemanticSearchResult => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    this.searchLogger.debug(`Found ${results.length} similar skills to "${skill.name}"`);

    return results;
  }

  /**
   * Calculate cosine similarity between two vectors
   * Returns a value between 0 and 1 (1 = identical, 0 = orthogonal)
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vector dimensions must match');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    // Cosine similarity is in range [-1, 1]
    // Normalize to [0, 1] for consistency
    const similarity = dotProduct / (magnitudeA * magnitudeB);
    return (similarity + 1) / 2;
  }

  /**
   * Euclidean distance (alternative similarity metric)
   * Lower is more similar
   */
  private euclideanDistance(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vector dimensions must match');
    }

    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const diff = a[i] - b[i];
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }

  /**
   * Dot product similarity (faster but unnormalized)
   */
  private dotProduct(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vector dimensions must match');
    }

    let product = 0;
    for (let i = 0; i < a.length; i++) {
      product += a[i] * b[i];
    }

    return product;
  }

  /**
   * Create snippet from text
   */
  private createSnippet(text: string, maxLength = 200): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength).trim() + '...';
  }

  /**
   * Get statistics about embeddings in database
   */
  getEmbeddingStats(): {
    total: number;
    withEmbeddings: number;
    withoutEmbeddings: number;
    coverage: number;
  } {
    const dbConn = this.db.getConnection();
    const total = (dbConn.prepare('SELECT COUNT(*) as count FROM skills').get() as { count: number } | undefined)?.count || 0;

    const withEmbeddings =
      (dbConn.prepare('SELECT COUNT(*) as count FROM skills WHERE embedding IS NOT NULL').get() as { count: number } | undefined)?.count || 0;

    const withoutEmbeddings = total - withEmbeddings;
    const coverage = total > 0 ? withEmbeddings / total : 0;

    return {
      total,
      withEmbeddings,
      withoutEmbeddings,
      coverage,
    };
  }

  /**
   * Bulk re-rank results using semantic similarity
   * Useful for re-ranking keyword search results
   */
  async rerank(query: string, skillIds: string[], limit?: number): Promise<SemanticSearchResult[]> {
    if (!this.embedder.isAvailable()) {
      throw new Error('Reranking unavailable - OpenAI API key not configured');
    }

    if (skillIds.length === 0) {
      return [];
    }

    // Generate query embedding
    const queryEmbedding = await this.embedder.generateEmbedding(query);

    // Fetch skills
    const placeholders = skillIds.map(() => '?').join(',');
    const dbConn = this.db.getConnection();
    const skills = dbConn.prepare(
      `SELECT id, name, description, source_type, format, metadata, embedding
       FROM skills
       WHERE id IN (${placeholders}) AND embedding IS NOT NULL`
    ).all(...skillIds) as any[];

    // Calculate similarities
    const results: SemanticSearchResult[] = skills
      .map((skill) => {
        const embedding = EmbeddingGenerator.parseEmbedding(skill.embedding);
        if (!embedding) return null;

        const score = this.cosineSimilarity(queryEmbedding, embedding);

        const metadata = skill.metadata ? JSON.parse(skill.metadata) : {};

        const result: SemanticSearchResult = {
          id: skill.id,
          name: skill.name,
          description: skill.description,
          source_type: skill.source_type,
          format: skill.format,
          score,
          snippet: this.createSnippet(skill.description),
          metadata: skill.metadata,
          category: metadata.category,
          tags: metadata.tags,
        };
        return result;
      })
      .filter((r): r is SemanticSearchResult => r !== null)
      .sort((a, b) => b.score - a.score);

    return limit ? results.slice(0, limit) : results;
  }
}

// Export singleton
export const semanticSearch = new SemanticSearch();
