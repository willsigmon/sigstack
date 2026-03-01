# SigSkills Search Engine

## Overview

The SigSkills search engine is a hybrid local/cloud system that combines:
1. **Keyword Search (FTS5)** - Fast, local, SQLite full-text search (Phase 1)
2. **Semantic Search (Embeddings)** - AI-powered vector similarity using OpenAI (Phase 2)
3. **Hybrid Ranking** - Intelligent merging with relevance boosting

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Search Interface                        │
│  - search() - Hybrid (auto-fallback)                        │
│  - quickSearch() - Keyword only (fast)                      │
│  - deepSearch() - Semantic only (accurate)                  │
│  - findSimilar() - Related skills                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴──────────────┐
        │                              │
┌───────▼──────────┐        ┌──────────▼─────────┐
│ Keyword Search   │        │ Semantic Search    │
│ (FTS5)           │        │ (Vector Similarity)│
│                  │        │                    │
│ - SQLite FTS5    │        │ - OpenAI Embeddings│
│ - BM25 ranking   │        │ - Cosine Similarity│
│ - Tag filtering  │        │ - Batch generation │
│ - Exact matches  │        │ - Caching          │
└───────┬──────────┘        └──────────┬─────────┘
        │                              │
        └───────────────┬──────────────┘
                        │
                ┌───────▼──────────┐
                │ Hybrid Ranking   │
                │                  │
                │ - Score merging  │
                │ - Recency boost  │
                │ - Popularity     │
                │ - RRF fusion     │
                └──────────────────┘
```

## Phase 1: Keyword Search (Current)

### Features
- **SQLite FTS5** - Built-in full-text search
- **Field weighting** - name^3 > description^2 > content^1
- **Advanced filtering** - source, format, category, tags
- **Exact matching** - Fast lookups by skill name
- **Zero API costs** - Fully local

### Usage

```typescript
import { keywordSearch } from './src/search/keyword.js';

// Basic search
const results = await keywordSearch.search({
  query: 'git commit',
  limit: 10
});

// Advanced search with filters
const filtered = await keywordSearch.search({
  query: 'ios swiftui',
  source: 'local',
  format: 'claude',
  category: 'mobile',
  tags: ['swift', 'ios'],
  includeContent: true
});

// Exact name match
const exact = await keywordSearch.searchExact('commit');
```

### FTS5 Query Syntax
- **Simple**: `git commit` → matches "git" OR "commit"
- **Phrase**: `"git commit"` → exact phrase
- **Boolean**: `git AND commit` → both required
- **Prefix**: `git*` → matches "git", "github", "gitignore"
- **Field**: `name:commit` → search only in name field

## Phase 2: Semantic Search (Ready)

### Features
- **OpenAI text-embedding-3-small** - 1536 dimensions, $0.02/1M tokens
- **Batch processing** - Efficient bulk embedding generation
- **Database caching** - Embeddings stored as BLOB in SQLite
- **Cosine similarity** - Standard vector similarity metric
- **Auto-fallback** - Uses keyword search if API unavailable

### Setup

```bash
# Set OpenAI API key
export OPENAI_API_KEY="sk-..."

# Generate embeddings for all skills
node dist/cli.js embed --all

# Or embed during indexing
node dist/cli.js index --source local --embed
```

### Usage

```typescript
import { semanticSearch } from './src/search/semantic.js';

// Semantic search (requires embeddings)
const results = await semanticSearch.search({
  query: 'help me debug performance issues',
  limit: 10,
  minScore: 0.7 // Only return highly relevant results
});

// Find similar skills
const similar = await semanticSearch.findSimilar('skill-id', 5);

// Check availability
if (semanticSearch.isAvailable()) {
  console.log('Semantic search enabled');
}

// Get embedding stats
const stats = semanticSearch.getEmbeddingStats();
console.log(`Coverage: ${stats.coverage * 100}%`);
```

### Embedding Generation

```typescript
import { embeddingGenerator } from './src/indexer/embeddings.js';

// Single skill
await embeddingGenerator.embedSkill(
  skillId,
  name,
  description,
  content
);

// All skills
const { success, failed } = await embeddingGenerator.embedAllSkills();

// Batch generation
const texts = ['text1', 'text2', ...];
const embeddings = await embeddingGenerator.generateBatch(texts);
```

## Hybrid Search (Recommended)

### Features
- **Best of both worlds** - Combines keyword + semantic
- **Weighted scoring** - Configurable semantic/keyword balance
- **Relevance boosting** - Recent usage, popularity
- **Auto-fallback** - Uses keyword if semantic unavailable
- **Reciprocal Rank Fusion** - Alternative merging strategy

### Usage

```typescript
import { hybridSearch } from './src/search/index.js';

// Default hybrid search (70% semantic, 30% keyword)
const results = await hybridSearch('debug performance', {
  limit: 10,
  boostRecent: true,
  boostPopular: true
});

// Custom weights
const weighted = await hybridSearch('ios animation', {
  semanticWeight: 0.8,  // 80% semantic
  keywordWeight: 0.2,   // 20% keyword
  limit: 10
});

// Force keyword-only (faster)
const keywordOnly = await hybridSearch('commit', {
  useSemanticSearch: false,
  limit: 10
});
```

### Convenience Functions

```typescript
import { search, quickSearch, deepSearch, findSimilar } from './src/search/index.js';

// Auto-detect best search method
const auto = await search('git workflow');

// Fast keyword-only
const fast = await quickSearch('commit');

// Semantic-only (most accurate)
const accurate = await deepSearch('help me with ios performance');

// Related skills
const related = await findSimilar('some-skill-id', 5);
```

## Ranking Algorithm

### Base Score Calculation

```
hybrid_score = (keyword_score × keyword_weight) + (semantic_score × semantic_weight)
```

### Relevance Boosting

```
final_score = hybrid_score + recency_boost + popularity_boost

where:
  recency_boost = {
    0.10 if last_used < 1 day ago
    0.05 if last_used < 1 week ago
    0.00 otherwise
  }

  popularity_boost = {
    0.10 if usage_count > 50
    0.05 if usage_count > 10
    0.02 if usage_count > 5
    0.00 otherwise
  }

  final_score = min(1.0, final_score)
```

### Reciprocal Rank Fusion (Alternative)

```
RRF_score(skill) = Σ [1 / (k + rank_i)]

where:
  k = 60 (constant)
  rank_i = position in result list i
  Σ = sum across all search methods
```

## Database Schema

### Skills Table
```sql
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  format TEXT CHECK(format IN ('claude', 'codex', 'universal')),

  -- Source
  source_type TEXT CHECK(source_type IN ('local', 'github', 'codex', 'custom', 'generated')),
  source_path TEXT,

  -- Metadata (JSON)
  metadata TEXT NOT NULL DEFAULT '{}',

  -- Embeddings (BLOB)
  embedding BLOB,

  -- Change detection
  checksum TEXT NOT NULL,

  -- Timestamps
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### FTS5 Index
```sql
CREATE VIRTUAL TABLE skills_fts USING fts5(
  name,
  description,
  content,
  content=skills,
  content_rowid=rowid
);
```

## Performance

### Keyword Search
- **Latency**: <10ms for local queries
- **Throughput**: 1000+ queries/second
- **Cost**: $0 (fully local)

### Semantic Search
- **Latency**:
  - Cached embeddings: <50ms
  - New embedding: ~200-500ms (OpenAI API call)
- **Throughput**:
  - Cached: 100+ queries/second
  - Uncached: ~2-5 queries/second (API rate limit)
- **Cost**:
  - Embedding generation: $0.02 per 1M tokens (~$0.0001 per skill)
  - Search: $0 (cached embeddings)

### Hybrid Search
- **Latency**: ~50-100ms (if embeddings cached)
- **Accuracy**: Best balance of speed and relevance
- **Cost**: Same as semantic search

## Best Practices

### When to Use Each Search Type

**Keyword Search** (quickSearch)
- Exact skill name lookups
- Fast autocomplete
- Offline operation required
- Zero-cost requirement

**Semantic Search** (deepSearch)
- Natural language queries
- Conceptual similarity
- "I need help with X" style queries
- Finding related skills

**Hybrid Search** (search)
- General-purpose search
- Best accuracy/speed tradeoff
- Production use cases
- Recommended default

### Optimization Tips

1. **Pre-generate embeddings**
   ```bash
   # During indexing
   node dist/cli.js index --embed

   # Or separately
   node dist/cli.js embed --all
   ```

2. **Use filters to narrow results**
   ```typescript
   await search('commit', {
     source: 'local',    // Only local skills
     category: 'git',    // Only git category
     tags: ['workflow'], // Must have tag
   });
   ```

3. **Adjust weights based on use case**
   ```typescript
   // Favor semantic for vague queries
   await search('help me debug', {
     semanticWeight: 0.9,
     keywordWeight: 0.1
   });

   // Favor keyword for specific terms
   await search('git rebase interactive', {
     semanticWeight: 0.3,
     keywordWeight: 0.7
   });
   ```

4. **Enable relevance boosting**
   ```typescript
   await search('test', {
     boostRecent: true,   // Prioritize recently used
     boostPopular: true   // Prioritize frequently used
   });
   ```

## API Reference

### KeywordSearch

```typescript
class KeywordSearch {
  search(options: KeywordSearchOptions): Promise<KeywordSearchResult[]>
  searchExact(name: string, options?: Partial<KeywordSearchOptions>): Promise<KeywordSearchResult[]>
  getCount(options: KeywordSearchOptions): Promise<number>
}
```

### SemanticSearch

```typescript
class SemanticSearch {
  isAvailable(): boolean
  search(options: SemanticSearchOptions): Promise<SemanticSearchResult[]>
  findSimilar(skillId: string, limit?: number): Promise<SemanticSearchResult[]>
  rerank(query: string, skillIds: string[], limit?: number): Promise<SemanticSearchResult[]>
  getEmbeddingStats(): { total: number; withEmbeddings: number; ... }
}
```

### HybridSearchRanker

```typescript
class HybridSearchRanker {
  search(options: HybridSearchOptions): Promise<RankedSearchResult[]>
  rerank(query: string, results: RankedSearchResult[], limit?: number): Promise<RankedSearchResult[]>
  getSearchStats(): Promise<{ totalSkills: number; embeddingCoverage: number; ... }>
}
```

### EmbeddingGenerator

```typescript
class EmbeddingGenerator {
  isAvailable(): boolean
  generateEmbedding(text: string): Promise<number[]>
  generateBatch(texts: string[]): Promise<number[][]>
  embedSkill(skillId: string, name: string, description: string, content: string): Promise<boolean>
  embedAllSkills(): Promise<{ success: number; failed: number }>
  getDimension(): number
  estimateCost(textCount: number, avgLength: number): number
}
```

## Future Enhancements

### Phase 3: Advanced Features
- [ ] **Hybrid embeddings** - Combine OpenAI + local models (transformers.js)
- [ ] **Query expansion** - Auto-expand queries with synonyms
- [ ] **Learning to rank** - ML-based ranking model
- [ ] **Multi-language support** - Embeddings for non-English skills
- [ ] **Faceted search** - Dynamic filtering UI
- [ ] **Search analytics** - Track query patterns, CTR
- [ ] **Personalization** - User-specific ranking
- [ ] **Caching layer** - Redis/Memcached for hot queries

### Phase 4: Scale
- [ ] **Vector database** - ChromaDB, Pinecone, or Weaviate
- [ ] **Approximate nearest neighbor** - HNSW, IVF for faster search
- [ ] **Distributed indexing** - Scale to millions of skills
- [ ] **Edge deployment** - CloudflareWorkers with D1/R2

## Troubleshooting

### "Semantic search unavailable"
- Ensure `OPENAI_API_KEY` is set
- Check API key validity
- Verify network connectivity

### "No results found"
- Check if skills are indexed (`node dist/cli.js index`)
- Verify FTS5 index is populated (`SELECT COUNT(*) FROM skills_fts`)
- Try broader query terms

### "Low embedding coverage"
- Run `node dist/cli.js embed --all`
- Check for API errors in logs
- Verify sufficient API quota

### Slow semantic search
- Pre-generate all embeddings
- Use keyword search for fast queries
- Reduce batch size if hitting rate limits

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall system design
- [src/db/schema.sql](./src/db/schema.sql) - Database schema
- [src/search/](./src/search/) - Search implementation code
