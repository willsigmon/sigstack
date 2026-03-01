# Search API Quick Reference

## Quick Start

```typescript
import { search, quickSearch, deepSearch, findSimilar } from 'sigskills/search';

// Best: Hybrid search (auto-fallback)
const results = await search('git commit', { limit: 10 });

// Fast: Keyword only
const fast = await quickSearch('commit', 10);

// Accurate: Semantic only (requires embeddings)
const accurate = await deepSearch('help me debug', 10);

// Related: Find similar skills
const similar = await findSimilar('skill-id', 5);
```

## Search Options

### Common Options (all search types)

```typescript
{
  query: string;           // Search query
  limit?: number;          // Max results (default: 10)
  offset?: number;         // Pagination offset (default: 0)
  source?: 'local' | 'github' | 'codex' | 'all';  // Filter by source
  format?: 'claude' | 'codex' | 'both';           // Filter by format
  category?: string;       // Filter by category
  tags?: string[];         // Filter by tags (OR)
  includeContent?: boolean; // Include full skill content
}
```

### Hybrid Search Options

```typescript
{
  // ... common options
  useSemanticSearch?: boolean;   // Force semantic on/off (default: auto)
  semanticWeight?: number;       // Weight 0-1 (default: 0.7)
  keywordWeight?: number;        // Weight 0-1 (default: 0.3)
  boostRecent?: boolean;         // Boost recently used (default: true)
  boostPopular?: boolean;        // Boost popular skills (default: true)
}
```

## Result Types

### RankedSearchResult

```typescript
{
  id: string;                 // Skill ID
  name: string;               // Skill name
  description: string;        // Description
  source_type: string;        // Source type
  format: string;             // Skill format
  score: number;              // Final score (0-1, higher = better)
  semantic_score?: number;    // Semantic similarity (if used)
  keyword_score?: number;     // Keyword rank (if used)
  recency_boost?: number;     // Recency boost applied
  popularity_boost?: number;  // Popularity boost applied
  snippet?: string;           // First 200 chars (if includeContent=false)
  content?: string;           // Full content (if includeContent=true)
  metadata?: string;          // JSON metadata
  category?: string;          // Category
  tags?: string[];            // Tags
}
```

## Usage Examples

### Basic Search

```typescript
// Simple query
const results = await search('git commit');

// With filters
const filtered = await search('ios animation', {
  source: 'local',
  format: 'claude',
  category: 'mobile',
  tags: ['swift', 'ui']
});

// With content
const withContent = await search('debug', {
  limit: 5,
  includeContent: true
});
```

### Advanced Search

```typescript
// Custom weights (favor semantic)
const semantic = await search('help me optimize performance', {
  semanticWeight: 0.9,
  keywordWeight: 0.1
});

// Custom weights (favor keyword)
const keyword = await search('git rebase --interactive', {
  semanticWeight: 0.2,
  keywordWeight: 0.8
});

// Disable relevance boosting
const raw = await search('test', {
  boostRecent: false,
  boostPopular: false
});

// Force keyword-only (faster)
const keywordOnly = await search('commit', {
  useSemanticSearch: false
});
```

### Pagination

```typescript
// First page
const page1 = await search('ios', { limit: 20, offset: 0 });

// Second page
const page2 = await search('ios', { limit: 20, offset: 20 });

// With total count
import { keywordSearch } from 'sigskills/search';
const total = await keywordSearch.getCount({ query: 'ios' });
const lastPage = Math.ceil(total / 20);
```

### Find Similar Skills

```typescript
// Find 5 most similar skills
const similar = await findSimilar('commit-skill-id', 5);

// Use in "related skills" feature
const skill = await getSkill('some-id');
const related = await findSimilar(skill.id, 3);
console.log(`Related to "${skill.name}":`);
related.forEach(r => console.log(`  - ${r.name} (${r.score})`));
```

## Embedding Management

### Generate Embeddings

```typescript
import { embeddingGenerator } from 'sigskills/search';

// Check if available
if (!embeddingGenerator.isAvailable()) {
  console.log('Set OPENAI_API_KEY to enable semantic search');
}

// Embed single skill
await embeddingGenerator.embedSkill(
  skillId,
  name,
  description,
  content
);

// Embed all skills
const { success, failed } = await embeddingGenerator.embedAllSkills();
console.log(`Embedded: ${success}, Failed: ${failed}`);

// Batch generation (custom)
const texts = ['text 1', 'text 2', ...];
const embeddings = await embeddingGenerator.generateBatch(texts);
```

### Check Embedding Coverage

```typescript
import { semanticSearch } from 'sigskills/search';

const stats = semanticSearch.getEmbeddingStats();
console.log(`Total: ${stats.total}`);
console.log(`With embeddings: ${stats.withEmbeddings}`);
console.log(`Coverage: ${(stats.coverage * 100).toFixed(1)}%`);

if (stats.coverage < 0.9) {
  console.log('Consider running: embedAllSkills()');
}
```

## Search Statistics

```typescript
import { getSearchStats } from 'sigskills/search';

const stats = await getSearchStats();
console.log({
  totalSkills: stats.totalSkills,
  withEmbeddings: stats.withEmbeddings,
  embeddingCoverage: stats.embeddingCoverage,
  semanticSearchAvailable: stats.semanticSearchAvailable
});
```

## Performance Tips

### 1. Pre-generate Embeddings
```typescript
// Do this once during setup
await embeddingGenerator.embedAllSkills();

// Or during indexing
await indexer.indexLocal({ embed: true });
```

### 2. Use Appropriate Search Type
```typescript
// Fast exact lookups → keyword
const exact = await quickSearch('commit');

// Conceptual search → semantic
const conceptual = await deepSearch('how do I fix bugs?');

// General use → hybrid (default)
const general = await search('test framework');
```

### 3. Optimize Filters
```typescript
// Narrow down results early
const filtered = await search('react', {
  source: 'local',      // Only local (faster)
  category: 'frontend', // Specific category
  limit: 10             // Only need 10
});
```

### 4. Batch Operations
```typescript
// Don't do this:
for (const query of queries) {
  await search(query); // Serial, slow
}

// Do this:
const results = await Promise.all(
  queries.map(q => search(q)) // Parallel, fast
);
```

## Error Handling

```typescript
import { search, isSemanticSearchAvailable } from 'sigskills/search';

try {
  // Check availability first
  if (!isSemanticSearchAvailable()) {
    console.warn('Semantic search disabled - using keyword only');
  }

  const results = await search('query', {
    useSemanticSearch: isSemanticSearchAvailable()
  });

  if (results.length === 0) {
    console.log('No results - try broader terms');
  }

} catch (error) {
  if (error.message.includes('OpenAI')) {
    console.error('API error - check OPENAI_API_KEY');
  } else {
    console.error('Search failed:', error);
  }
}
```

## CLI Examples

```bash
# Search from CLI
sigskills search "git commit" --limit 5

# Semantic search
sigskills search "help me debug" --semantic

# Keyword only
sigskills search "commit" --keyword

# With filters
sigskills search "ios" --source local --format claude --category mobile

# Generate embeddings
sigskills embed --all

# Check stats
sigskills stats
```

## Integration with MCP

```typescript
// MCP tool: search_skills
{
  name: "search_skills",
  description: "Search for skills",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
      limit: { type: "number", default: 10 },
      source: { type: "string", enum: ["local", "github", "codex", "all"] },
      format: { type: "string", enum: ["claude", "codex", "both"] },
      useSemanticSearch: { type: "boolean" }
    },
    required: ["query"]
  }
}

// Handler
async function searchSkills(params) {
  return await search(params.query, {
    limit: params.limit,
    source: params.source,
    format: params.format,
    useSemanticSearch: params.useSemanticSearch
  });
}
```

## Cost Estimation

```typescript
import { embeddingGenerator } from 'sigskills/search';

// Estimate embedding cost
const skillCount = 100;
const avgContentLength = 2000;

const cost = embeddingGenerator.estimateCost(skillCount, avgContentLength);
console.log(`Estimated cost: $${cost.toFixed(4)}`);

// text-embedding-3-small: ~$0.0001 per skill
// For 1000 skills: ~$0.10 total
```

## Supported Query Types

### Keyword Search
- Exact matches: `"git commit message"`
- Boolean: `git AND commit`
- Prefix: `git*`
- Field-specific: `name:commit description:workflow`

### Semantic Search
- Natural language: `how do I fix performance issues?`
- Conceptual: `debugging tools for mobile apps`
- Intent-based: `I need to optimize my code`

### Hybrid (Recommended)
- Handles all query types automatically
- Falls back gracefully if semantic unavailable
- Best for production use

## See Also

- [SEARCH_ENGINE.md](../SEARCH_ENGINE.md) - Full documentation
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture
- [examples/search-demo.ts](../examples/search-demo.ts) - Live examples
