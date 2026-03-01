/**
 * Search Skills Tool Handler
 * Implements FTS5 keyword search + optional semantic search for skills
 */

import { getDatabase } from '../../db/index.js';
import {
  SearchSkillsParams,
  SearchSkillsParamsSchema,
  SearchSkillsResult,
} from '../types.js';
import { logger } from '../../utils/logger.js';

const log = logger.child('search-skills');

interface SkillRow {
  id: string;
  name: string;
  description: string;
  content: string;
  source_type: string;
  source_path: string | null;
  format: 'claude' | 'codex' | 'universal';
  score: number;
}

/**
 * Search skills using FTS5 keyword search with optional semantic search fallback
 */
export async function handleSearchSkills(
  params: unknown
): Promise<SearchSkillsResult> {
  const validated = SearchSkillsParamsSchema.parse(params);
  const db = getDatabase();

  log.info(`Searching skills: "${validated.query}"`);

  // Build FTS5 query
  const ftsQuery = buildFTS5Query(validated.query);
  const limit = validated.limit || 10;

  // Build WHERE clause for filters
  const filters: string[] = [];
  const filterParams: any[] = [];

  // Filter by source type
  if (validated.source && validated.source !== 'all') {
    filters.push('s.source_type = ?');
    filterParams.push(validated.source);
  }

  // Filter by format
  if (validated.format && validated.format !== 'both') {
    filters.push('s.format = ?');
    filterParams.push(validated.format);
  }

  const whereClause = filters.length > 0 ? `AND ${filters.join(' AND ')}` : '';

  // Execute FTS5 search
  const sql = `
    SELECT
      s.id,
      s.name,
      s.description,
      s.content,
      s.source_type,
      s.source_path,
      s.format,
      fts.rank AS score
    FROM skills_fts fts
    INNER JOIN skills s ON s.rowid = fts.rowid
    WHERE skills_fts MATCH ?
    ${whereClause}
    ORDER BY fts.rank ASC
    LIMIT ?
  `;

  const params_array = [ftsQuery, ...filterParams, limit];

  try {
    const results = db.query<SkillRow>(sql, params_array);

    log.info(`Found ${results.length} skills matching query`);

    // Format results
    const skills = results.map((row) => {
      // Normalize score (FTS5 rank is negative, lower = better match)
      // Convert to 0-1 scale where 1 = best match
      const normalizedScore = 1 / (1 + Math.abs(row.score));

      return {
        id: row.id,
        name: row.name,
        description: row.description,
        source: row.source_type,
        score: normalizedScore,
        snippet: validated.include_content
          ? undefined
          : generateSnippet(row.content, validated.query),
        path: row.source_path || undefined,
        ...(validated.include_content && { content: row.content }),
      };
    });

    return {
      skills,
      total: skills.length,
    };
  } catch (error) {
    log.error('Search failed:', error);
    throw new Error(
      `Search failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Build FTS5 query from user input
 * Handles multi-word queries and special characters
 */
function buildFTS5Query(query: string): string {
  // Escape special FTS5 characters
  let escaped = query.replace(/['"]/g, '');

  // Split into words and create phrase query
  const words = escaped.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word - use prefix matching
    return `${words[0]}*`;
  }

  // Multi-word - search for words with OR
  // Also try exact phrase with higher weight
  const wordQuery = words.map((w) => `${w}*`).join(' OR ');
  const phraseQuery = `"${words.join(' ')}"`;

  return `(${phraseQuery}) OR (${wordQuery})`;
}

/**
 * Generate a snippet from content around matching query terms
 */
function generateSnippet(content: string, query: string, maxLength = 200): string {
  const words = query.toLowerCase().split(/\s+/);

  // Try to find first occurrence of any query word
  const contentLower = content.toLowerCase();
  let startPos = -1;

  for (const word of words) {
    const pos = contentLower.indexOf(word);
    if (pos !== -1 && (startPos === -1 || pos < startPos)) {
      startPos = pos;
    }
  }

  if (startPos === -1) {
    // No match found, return beginning
    return content.substring(0, maxLength).trim() + '...';
  }

  // Extract snippet around match
  const snippetStart = Math.max(0, startPos - 50);
  const snippetEnd = Math.min(content.length, startPos + maxLength - 50);

  let snippet = content.substring(snippetStart, snippetEnd).trim();

  // Add ellipsis
  if (snippetStart > 0) {
    snippet = '...' + snippet;
  }
  if (snippetEnd < content.length) {
    snippet = snippet + '...';
  }

  return snippet;
}
