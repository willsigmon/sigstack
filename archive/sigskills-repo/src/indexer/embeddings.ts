/**
 * Embedding generation for semantic search using OpenAI
 * Supports batch processing and caching
 */

import OpenAI from 'openai';
import { getDatabase } from '../db/index.js';
import { logger } from '../utils/logger.js';

export interface EmbeddingOptions {
  model?: string;
  batchSize?: number;
  maxRetries?: number;
}

export interface EmbeddingResult {
  id: string;
  embedding: number[];
  success: boolean;
  error?: string;
}

export class EmbeddingGenerator {
  private openai: OpenAI | null = null;
  private db = getDatabase();
  private embeddingLogger = logger.child('embeddings');
  private model: string;
  private batchSize: number;
  private maxRetries: number;

  constructor(options: EmbeddingOptions = {}) {
    this.model = options.model || 'text-embedding-3-small';
    this.batchSize = options.batchSize || 100;
    this.maxRetries = options.maxRetries || 3;

    // Initialize OpenAI client if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.embeddingLogger.info(`Embedding generator initialized with model: ${this.model}`);
    } else {
      this.embeddingLogger.warn('OPENAI_API_KEY not set - embeddings disabled');
    }
  }

  /**
   * Check if embedding generation is available
   */
  isAvailable(): boolean {
    return this.openai !== null;
  }

  /**
   * Generate embedding for a single text
   */
  async generateEmbedding(text: string, retries = 0): Promise<number[]> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized - set OPENAI_API_KEY');
    }

    try {
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: text,
        encoding_format: 'float',
      });

      return response.data[0].embedding;
    } catch (error: any) {
      if (retries < this.maxRetries) {
        this.embeddingLogger.warn(`Embedding generation failed, retrying... (${retries + 1}/${this.maxRetries})`);
        await this.delay(1000 * Math.pow(2, retries)); // Exponential backoff
        return this.generateEmbedding(text, retries + 1);
      }

      this.embeddingLogger.error('Embedding generation failed', error);
      throw error;
    }
  }

  /**
   * Generate embeddings in batches for efficiency
   */
  async generateBatch(texts: string[]): Promise<number[][]> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized - set OPENAI_API_KEY');
    }

    const results: number[][] = [];

    // Process in batches
    for (let i = 0; i < texts.length; i += this.batchSize) {
      const batch = texts.slice(i, i + this.batchSize);

      this.embeddingLogger.debug(`Processing batch ${i / this.batchSize + 1}/${Math.ceil(texts.length / this.batchSize)}`);

      try {
        const response = await this.openai.embeddings.create({
          model: this.model,
          input: batch,
          encoding_format: 'float',
        });

        results.push(...response.data.map((d) => d.embedding));
      } catch (error) {
        this.embeddingLogger.error(`Batch embedding failed for batch starting at index ${i}`, error);

        // Fallback to individual generation for failed batch
        for (const text of batch) {
          try {
            const embedding = await this.generateEmbedding(text);
            results.push(embedding);
          } catch (err) {
            this.embeddingLogger.error('Individual embedding generation failed', err);
            // Use zero vector as fallback
            results.push(new Array(1536).fill(0));
          }
        }
      }
    }

    return results;
  }

  /**
   * Generate and cache embedding for a skill
   */
  async embedSkill(skillId: string, name: string, description: string, content: string): Promise<boolean> {
    if (!this.openai) {
      this.embeddingLogger.warn(`Skipping embedding for skill ${skillId} - OpenAI not available`);
      return false;
    }

    try {
      // Check if embedding already exists
      const dbConn = this.db.getConnection();
      const existing = dbConn.prepare('SELECT embedding FROM skills WHERE id = ?').get(skillId) as { embedding: Buffer | null } | undefined;

      if (existing?.embedding) {
        this.embeddingLogger.debug(`Skill ${skillId} already has embedding`);
        return true;
      }

      // Create text representation for embedding
      // Weight: name (high), description (medium), content (low)
      const text = this.createEmbeddingText(name, description, content);

      // Generate embedding
      const embedding = await this.generateEmbedding(text);

      // Store as BLOB (binary)
      const buffer = Buffer.from(new Float32Array(embedding).buffer);

      dbConn.prepare('UPDATE skills SET embedding = ? WHERE id = ?').run(buffer, skillId);

      this.embeddingLogger.debug(`Generated embedding for skill: ${name}`);

      return true;
    } catch (error) {
      this.embeddingLogger.error(`Failed to embed skill ${skillId}`, error);
      return false;
    }
  }

  /**
   * Generate embeddings for all skills missing them
   */
  async embedAllSkills(): Promise<{ success: number; failed: number }> {
    if (!this.openai) {
      this.embeddingLogger.warn('Skipping embedAll - OpenAI not available');
      return { success: 0, failed: 0 };
    }

    const dbConn = this.db.getConnection();
    const skillsWithoutEmbeddings = dbConn.prepare('SELECT id, name, description, content FROM skills WHERE embedding IS NULL').all() as Array<{
      id: string;
      name: string;
      description: string;
      content: string;
    }>;

    this.embeddingLogger.info(`Generating embeddings for ${skillsWithoutEmbeddings.length} skills`);

    let success = 0;
    let failed = 0;

    // Process in batches
    for (let i = 0; i < skillsWithoutEmbeddings.length; i += this.batchSize) {
      const batch = skillsWithoutEmbeddings.slice(i, i + this.batchSize);
      const texts = batch.map((s: any) => this.createEmbeddingText(s.name, s.description, s.content));

      try {
        const embeddings = await this.generateBatch(texts);

        // Store embeddings
        this.db.transaction(() => {
          const stmt = dbConn.prepare('UPDATE skills SET embedding = ? WHERE id = ?');
          for (let j = 0; j < batch.length; j++) {
            const buffer = Buffer.from(new Float32Array(embeddings[j]).buffer);
            stmt.run(buffer, batch[j].id);
          }
        });

        success += batch.length;
        this.embeddingLogger.info(`Embedded ${i + batch.length}/${skillsWithoutEmbeddings.length} skills`);
      } catch (error) {
        failed += batch.length;
        this.embeddingLogger.error(`Failed to embed batch`, error);
      }
    }

    this.embeddingLogger.info(`Embedding complete: ${success} success, ${failed} failed`);

    return { success, failed };
  }

  /**
   * Create weighted text for embedding generation
   */
  private createEmbeddingText(name: string, description: string, content: string): string {
    // Weight name heavily (repeat 3x)
    // Description medium (repeat 2x)
    // Content once, truncated to 2000 chars
    const truncatedContent = content.slice(0, 2000);

    return [
      name,
      name,
      name,
      description,
      description,
      truncatedContent,
    ].join('\n\n');
  }

  /**
   * Parse embedding from database BLOB
   */
  static parseEmbedding(blob: Buffer | null): number[] | null {
    if (!blob) return null;

    try {
      return Array.from(new Float32Array(blob.buffer, blob.byteOffset, blob.length / 4));
    } catch (error) {
      logger.error('Failed to parse embedding', error);
      return null;
    }
  }

  /**
   * Utility: delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get embedding dimension for the current model
   */
  getDimension(): number {
    // text-embedding-3-small: 1536 dimensions
    // text-embedding-3-large: 3072 dimensions
    return this.model === 'text-embedding-3-large' ? 3072 : 1536;
  }

  /**
   * Estimate token count for cost calculation
   */
  estimateTokens(text: string): number {
    // Rough estimation: ~4 chars per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Estimate cost for embedding generation
   */
  estimateCost(textCount: number, avgLength: number): number {
    // text-embedding-3-small: $0.02 per 1M tokens
    const tokens = this.estimateTokens('x'.repeat(avgLength)) * textCount;
    const costPerToken = 0.00000002; // $0.02 / 1M
    return tokens * costPerToken;
  }
}

// Export singleton
export const embeddingGenerator = new EmbeddingGenerator();
