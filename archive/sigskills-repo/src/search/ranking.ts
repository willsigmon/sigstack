/**
 * Result ranking and merging for hybrid search
 * Combines keyword (FTS5) and semantic (vector) search results
 */

import { getDatabase } from '../db/index.js';
import { keywordSearch, KeywordSearchResult } from './keyword.js';
import { semanticSearch, SemanticSearchResult } from './semantic.js';
import { logger } from '../utils/logger.js';

export interface HybridSearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  source?: 'local' | 'github' | 'codex' | 'all';
  format?: 'claude' | 'codex' | 'both';
  category?: string;
  tags?: string[];
  includeContent?: boolean;

  // Ranking options
  useSemanticSearch?: boolean; // Default: auto (true if embeddings available)
  semanticWeight?: number; // Weight for semantic results (0-1, default: 0.7)
  keywordWeight?: number; // Weight for keyword results (0-1, default: 0.3)
  boostRecent?: boolean; // Boost recently used skills (default: true)
  boostPopular?: boolean; // Boost frequently used skills (default: true)
}

export interface RankedSearchResult {
  id: string;
  name: string;
  description: string;
  source_type: string;
  format: string;
  score: number; // Final normalized score (0-1)
  semantic_score?: number;
  keyword_score?: number;
  recency_boost?: number;
  popularity_boost?: number;
  snippet?: string;
  content?: string;
  metadata?: string;
  category?: string;
  tags?: string[];
}

export class HybridSearchRanker {
  private db = getDatabase();
  private rankLogger = logger.child('ranking');

  /**
   * Perform hybrid search combining keyword and semantic results
   */
  async search(options: HybridSearchOptions): Promise<RankedSearchResult[]> {
    const {
      query,
      limit = 10,
      offset = 0,
      useSemanticSearch,
      semanticWeight = 0.7,
      keywordWeight = 0.3,
      boostRecent = true,
      boostPopular = true,
      ...searchOptions
    } = options;

    // Normalize weights
    const totalWeight = semanticWeight + keywordWeight;
    const normSemanticWeight = semanticWeight / totalWeight;
    const normKeywordWeight = keywordWeight / totalWeight;

    // Check if semantic search is available
    const semanticAvailable = useSemanticSearch ?? semanticSearch.isAvailable();

    this.rankLogger.debug(
      `Hybrid search: semantic=${semanticAvailable}, weights=[kw:${normKeywordWeight.toFixed(2)}, sem:${normSemanticWeight.toFixed(2)}]`
    );

    // Fetch results from both sources
    const [keywordResults, semanticResults] = await Promise.all([
      // Always fetch keyword results (fallback)
      keywordSearch.search({
        query,
        limit: limit * 2, // Fetch more for merging
        offset: 0,
        ...searchOptions,
      }),

      // Fetch semantic results if available
      semanticAvailable
        ? semanticSearch.search({
            query,
            limit: limit * 2,
            offset: 0,
            ...searchOptions,
          })
        : Promise.resolve([]),
    ]);

    this.rankLogger.debug(`Got ${keywordResults.length} keyword, ${semanticResults.length} semantic results`);

    // Merge and rank results
    const merged = this.mergeResults(
      keywordResults,
      semanticResults,
      normKeywordWeight,
      normSemanticWeight
    );

    // Apply relevance boosting
    const boosted = boostRecent || boostPopular
      ? await this.applyRelevanceBoosts(merged, { boostRecent, boostPopular })
      : merged;

    // Sort by final score and apply pagination
    const sorted = boosted
      .sort((a, b) => b.score - a.score)
      .slice(offset, offset + limit);

    this.rankLogger.debug(`Returning ${sorted.length} results after ranking`);

    return sorted;
  }

  /**
   * Merge keyword and semantic results using weighted scoring
   */
  private mergeResults(
    keywordResults: KeywordSearchResult[],
    semanticResults: SemanticSearchResult[],
    keywordWeight: number,
    semanticWeight: number
  ): RankedSearchResult[] {
    // Create a map of results by ID
    const resultsMap = new Map<string, RankedSearchResult>();

    // Process keyword results
    for (const result of keywordResults) {
      resultsMap.set(result.id, {
        ...result,
        score: result.score * keywordWeight,
        keyword_score: result.score,
        semantic_score: undefined,
      });
    }

    // Process semantic results and merge
    for (const result of semanticResults) {
      const existing = resultsMap.get(result.id);

      if (existing) {
        // Merge scores
        existing.score += result.score * semanticWeight;
        existing.semantic_score = result.score;
      } else {
        // Add new result
        resultsMap.set(result.id, {
          ...result,
          score: result.score * semanticWeight,
          keyword_score: undefined,
          semantic_score: result.score,
        });
      }
    }

    return Array.from(resultsMap.values());
  }

  /**
   * Apply relevance boosts based on usage patterns
   */
  private async applyRelevanceBoosts(
    results: RankedSearchResult[],
    options: { boostRecent?: boolean; boostPopular?: boolean }
  ): Promise<RankedSearchResult[]> {
    if (results.length === 0) {
      return results;
    }

    // Fetch metadata for all results
    const ids = results.map((r) => r.id);
    const placeholders = ids.map(() => '?').join(',');

    const metadata = this.db
      .getConnection()
      .prepare(`SELECT id, metadata FROM skills WHERE id IN (${placeholders})`)
      .all(...ids) as Array<{ id: string; metadata: string }>;

    const metadataMap = new Map<string, any>();
    for (const row of metadata) {
      try {
        metadataMap.set(row.id, JSON.parse(row.metadata));
      } catch (err) {
        this.rankLogger.warn(`Failed to parse metadata for skill ${row.id}`);
      }
    }

    // Calculate boosts
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const ONE_WEEK = 7 * ONE_DAY;

    return results.map((result) => {
      const meta = metadataMap.get(result.id) || {};
      let boost = 0;

      // Recency boost (up to +0.1)
      if (options.boostRecent && meta.last_used) {
        const lastUsed = new Date(meta.last_used).getTime();
        const age = now - lastUsed;

        if (age < ONE_DAY) {
          boost += 0.1; // Used today
        } else if (age < ONE_WEEK) {
          boost += 0.05; // Used this week
        }

        result.recency_boost = boost;
      }

      // Popularity boost (up to +0.1)
      if (options.boostPopular && meta.usage_count) {
        const usageCount = meta.usage_count || 0;

        if (usageCount > 50) {
          boost += 0.1; // Very popular
        } else if (usageCount > 10) {
          boost += 0.05; // Popular
        } else if (usageCount > 5) {
          boost += 0.02; // Moderately used
        }

        result.popularity_boost = (result.recency_boost || 0) - boost;
      }

      // Apply boost to final score (capped at 1.0)
      result.score = Math.min(1.0, result.score + boost);

      return result;
    });
  }

  /**
   * Normalize scores across different search methods
   * Maps scores from different ranges to [0, 1]
   */
  private normalizeScores(results: RankedSearchResult[]): RankedSearchResult[] {
    if (results.length === 0) return results;

    // Find min/max scores
    const scores = results.map((r) => r.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    // Avoid division by zero
    if (maxScore === minScore) {
      return results.map((r) => ({ ...r, score: 1.0 }));
    }

    // Min-max normalization
    return results.map((r) => ({
      ...r,
      score: (r.score - minScore) / (maxScore - minScore),
    }));
  }

  /**
   * Re-rank results using semantic similarity (requires embeddings)
   */
  async rerank(query: string, results: RankedSearchResult[], limit?: number): Promise<RankedSearchResult[]> {
    if (!semanticSearch.isAvailable()) {
      this.rankLogger.warn('Semantic reranking unavailable - returning original results');
      return limit ? results.slice(0, limit) : results;
    }

    const skillIds = results.map((r) => r.id);
    const reranked = await semanticSearch.rerank(query, skillIds, limit);

    // Merge original metadata with new scores
    const rerankedMap = new Map(reranked.map((r) => [r.id, r]));

    const rerankedResults: RankedSearchResult[] = results
      .map((original) => {
        const rerankedResult = rerankedMap.get(original.id);
        if (!rerankedResult) return null;

        const result: RankedSearchResult = {
          ...original,
          score: rerankedResult.score,
          semantic_score: rerankedResult.score,
        };
        return result;
      })
      .filter((r): r is RankedSearchResult => r !== null)
      .sort((a, b) => b.score - a.score);

    return rerankedResults;
  }

  /**
   * Reciprocal Rank Fusion (RRF) - alternative merging strategy
   * More robust to score scale differences
   */
  private reciprocalRankFusion(
    keywordResults: KeywordSearchResult[],
    semanticResults: SemanticSearchResult[],
    k = 60 // RRF constant
  ): RankedSearchResult[] {
    const resultsMap = new Map<string, { result: any; rrf_score: number; sources: Set<string> }>();

    // Process keyword results
    keywordResults.forEach((result, index) => {
      const rank = index + 1;
      const rrf = 1 / (k + rank);

      resultsMap.set(result.id, {
        result,
        rrf_score: rrf,
        sources: new Set(['keyword']),
      });
    });

    // Process semantic results
    semanticResults.forEach((result, index) => {
      const rank = index + 1;
      const rrf = 1 / (k + rank);

      const existing = resultsMap.get(result.id);

      if (existing) {
        existing.rrf_score += rrf;
        existing.sources.add('semantic');
      } else {
        resultsMap.set(result.id, {
          result,
          rrf_score: rrf,
          sources: new Set(['semantic']),
        });
      }
    });

    // Convert to ranked results
    return Array.from(resultsMap.values())
      .map(({ result, rrf_score, sources }) => ({
        ...result,
        score: rrf_score,
        keyword_score: sources.has('keyword') ? result.score : undefined,
        semantic_score: sources.has('semantic') ? result.score : undefined,
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Get search statistics
   */
  async getSearchStats(): Promise<{
    totalSkills: number;
    withEmbeddings: number;
    embeddingCoverage: number;
    semanticSearchAvailable: boolean;
  }> {
    const embeddingStats = semanticSearch.getEmbeddingStats();

    return {
      totalSkills: embeddingStats.total,
      withEmbeddings: embeddingStats.withEmbeddings,
      embeddingCoverage: embeddingStats.coverage,
      semanticSearchAvailable: semanticSearch.isAvailable(),
    };
  }
}

// Export singleton
export const hybridSearchRanker = new HybridSearchRanker();

/**
 * Convenience function for hybrid search
 */
export async function search(options: HybridSearchOptions): Promise<RankedSearchResult[]> {
  return hybridSearchRanker.search(options);
}
