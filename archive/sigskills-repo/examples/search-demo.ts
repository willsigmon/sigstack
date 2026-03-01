/**
 * Search Engine Demo
 * Demonstrates keyword, semantic, and hybrid search capabilities
 */

import {
  search,
  quickSearch,
  deepSearch,
  findSimilar,
  getSearchStats,
  isSemanticSearchAvailable,
} from '../src/search/index.js';
import { embeddingGenerator } from '../src/indexer/embeddings.js';
import { getDatabase } from '../src/db/index.js';

async function demo() {
  console.log('=== SigSkills Search Engine Demo ===\n');

  // Initialize database
  const db = getDatabase();
  await db.initialize();

  // Check search capabilities
  const semanticAvailable = isSemanticSearchAvailable();
  console.log(`Semantic Search: ${semanticAvailable ? '✅ Available' : '❌ Unavailable (set OPENAI_API_KEY)'}\n`);

  // Get statistics
  const stats = await getSearchStats();
  console.log('Search Statistics:');
  console.log(`  Total Skills: ${stats.totalSkills}`);
  console.log(`  With Embeddings: ${stats.withEmbeddings}`);
  console.log(`  Coverage: ${(stats.embeddingCoverage * 100).toFixed(1)}%\n`);

  // Demo 1: Quick Search (Keyword Only)
  console.log('--- Demo 1: Quick Search (Keyword) ---');
  const quickResults = await quickSearch('git commit', 5);
  console.log(`Query: "git commit"`);
  console.log(`Results: ${quickResults.length}`);
  quickResults.forEach((result, i) => {
    console.log(`  ${i + 1}. ${result.name} (score: ${result.score.toFixed(3)})`);
    console.log(`     ${result.description}`);
  });
  console.log();

  // Demo 2: Semantic Search (if available)
  if (semanticAvailable) {
    console.log('--- Demo 2: Deep Search (Semantic) ---');
    const deepResults = await deepSearch('help me debug performance issues in my iOS app', 5);
    console.log(`Query: "help me debug performance issues in my iOS app"`);
    console.log(`Results: ${deepResults.length}`);
    deepResults.forEach((result, i) => {
      console.log(`  ${i + 1}. ${result.name} (score: ${result.score.toFixed(3)})`);
      console.log(`     ${result.description}`);
    });
    console.log();
  }

  // Demo 3: Hybrid Search (Best)
  console.log('--- Demo 3: Hybrid Search ---');
  const hybridResults = await search('create a new feature', {
    limit: 5,
    boostRecent: true,
    boostPopular: true,
  });
  console.log(`Query: "create a new feature"`);
  console.log(`Results: ${hybridResults.length}`);
  hybridResults.forEach((result, i) => {
    const scores = [];
    if (result.keyword_score !== undefined) scores.push(`kw:${result.keyword_score.toFixed(2)}`);
    if (result.semantic_score !== undefined) scores.push(`sem:${result.semantic_score.toFixed(2)}`);
    if (result.recency_boost) scores.push(`+recent`);
    if (result.popularity_boost) scores.push(`+popular`);

    console.log(`  ${i + 1}. ${result.name} (${scores.join(', ')} → ${result.score.toFixed(3)})`);
    console.log(`     ${result.description}`);
  });
  console.log();

  // Demo 4: Find Similar Skills
  if (semanticAvailable && hybridResults.length > 0) {
    console.log('--- Demo 4: Find Similar Skills ---');
    const skillId = hybridResults[0].id;
    const similarResults = await findSimilar(skillId, 3);
    console.log(`Similar to: "${hybridResults[0].name}"`);
    console.log(`Results: ${similarResults.length}`);
    similarResults.forEach((result, i) => {
      console.log(`  ${i + 1}. ${result.name} (similarity: ${result.score.toFixed(3)})`);
      console.log(`     ${result.description}`);
    });
    console.log();
  }

  // Demo 5: Filtered Search
  console.log('--- Demo 5: Filtered Search ---');
  const filteredResults = await search('ios', {
    format: 'claude',
    category: 'mobile',
    tags: ['swift'],
    limit: 5,
  });
  console.log(`Query: "ios" (format=claude, category=mobile, tags=[swift])`);
  console.log(`Results: ${filteredResults.length}`);
  filteredResults.forEach((result, i) => {
    console.log(`  ${i + 1}. ${result.name} (${result.source_type})`);
  });
  console.log();

  // Demo 6: Custom Weight Search
  console.log('--- Demo 6: Custom Weights ---');
  const weightedResults = await search('git workflow', {
    semanticWeight: 0.9,
    keywordWeight: 0.1,
    limit: 3,
  });
  console.log(`Query: "git workflow" (90% semantic, 10% keyword)`);
  console.log(`Results: ${weightedResults.length}`);
  weightedResults.forEach((result, i) => {
    console.log(`  ${i + 1}. ${result.name}`);
  });
  console.log();

  // Demo 7: Embedding Generation (if API available)
  if (semanticAvailable && stats.embeddingCoverage < 1.0) {
    console.log('--- Demo 7: Generate Missing Embeddings ---');
    console.log(`Generating embeddings for ${stats.totalSkills - stats.withEmbeddings} skills...`);

    const { success, failed } = await embeddingGenerator.embedAllSkills();
    console.log(`Success: ${success}, Failed: ${failed}`);

    const newStats = await getSearchStats();
    console.log(`New coverage: ${(newStats.embeddingCoverage * 100).toFixed(1)}%\n`);
  }

  console.log('=== Demo Complete ===');
  db.close();
}

// Run demo
demo().catch((error) => {
  console.error('Demo failed:', error);
  process.exit(1);
});
