/**
 * Search module exports
 * Provides unified interface for keyword, semantic, and hybrid search
 */

// Export search implementations
export { KeywordSearch, keywordSearch } from './keyword.js';
export type { KeywordSearchOptions, KeywordSearchResult } from './keyword.js';

export { SemanticSearch, semanticSearch } from './semantic.js';
export type { SemanticSearchOptions, SemanticSearchResult } from './semantic.js';

export { HybridSearchRanker, hybridSearchRanker, search as hybridSearch } from './ranking.js';
export type { HybridSearchOptions, RankedSearchResult } from './ranking.js';

// Export embedding generator
export { EmbeddingGenerator, embeddingGenerator } from '../indexer/embeddings.js';
export type { EmbeddingOptions, EmbeddingResult } from '../indexer/embeddings.js';

/**
 * Default search interface - uses hybrid search with auto-fallback
 */
export async function search(query: string, options?: any) {
  const { hybridSearchRanker } = await import('./ranking.js');

  return hybridSearchRanker.search({
    query,
    ...options,
  });
}

/**
 * Quick search - keyword only (faster, no API calls)
 */
export async function quickSearch(query: string, limit = 10) {
  const { keywordSearch } = await import('./keyword.js');

  return keywordSearch.search({
    query,
    limit,
  });
}

/**
 * Deep search - semantic only (slower, more accurate)
 */
export async function deepSearch(query: string, limit = 10) {
  const { semanticSearch } = await import('./semantic.js');

  return semanticSearch.search({
    query,
    limit,
  });
}

/**
 * Find similar skills
 */
export async function findSimilar(skillId: string, limit = 5) {
  const { semanticSearch } = await import('./semantic.js');

  return semanticSearch.findSimilar(skillId, limit);
}

/**
 * Check if semantic search is available
 */
export function isSemanticSearchAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Get search engine statistics
 */
export async function getSearchStats() {
  const { hybridSearchRanker } = await import('./ranking.js');

  return hybridSearchRanker.getSearchStats();
}
