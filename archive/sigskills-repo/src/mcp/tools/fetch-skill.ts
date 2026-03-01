/**
 * Fetch Skill Tool Handler
 * Fetches full skill content by ID with optional format conversion
 */

import { getDatabase } from '../../db/index.js';
import {
  FetchSkillParams,
  FetchSkillParamsSchema,
  FetchSkillResult,
  SkillNotFoundError,
} from '../types.js';
import type { Skill, SkillSource, SkillMetadata } from '../../types.js';
import { logger } from '../../utils/logger.js';

const log = logger.child('fetch-skill');

interface SkillRow {
  id: string;
  name: string;
  description: string;
  content: string;
  format: 'claude' | 'codex' | 'universal';
  source_type: string;
  source_path: string | null;
  source_repo: string | null;
  source_branch: string | null;
  source_commit: string | null;
  source_url: string | null;
  metadata: string; // JSON
  checksum: string;
  created_at: number;
  updated_at: number;
}

/**
 * Fetch full skill by ID with optional format conversion
 */
export async function handleFetchSkill(
  params: unknown
): Promise<FetchSkillResult> {
  const validated = FetchSkillParamsSchema.parse(params);
  const db = getDatabase();

  log.info(`Fetching skill: ${validated.skill_id}`);

  // Query skill by ID
  const sql = `
    SELECT
      id,
      name,
      description,
      content,
      format,
      source_type,
      source_path,
      source_repo,
      source_branch,
      source_commit,
      source_url,
      metadata,
      checksum,
      created_at,
      updated_at
    FROM skills
    WHERE id = ?
  `;

  const row = db.queryOne<SkillRow>(sql, [validated.skill_id]);

  if (!row) {
    throw new SkillNotFoundError(validated.skill_id);
  }

  // Parse metadata JSON
  let metadata: SkillMetadata;
  try {
    metadata = JSON.parse(row.metadata);
  } catch (error) {
    log.warn(`Failed to parse metadata for skill ${row.id}, using defaults`);
    metadata = {
      created_at: new Date(row.created_at * 1000),
      updated_at: new Date(row.updated_at * 1000),
    };
  }

  // Build source object
  const source: SkillSource = {
    type: row.source_type as any,
    path: row.source_path || undefined,
    repo: row.source_repo || undefined,
    branch: row.source_branch || undefined,
    commit: row.source_commit || undefined,
    url: row.source_url || undefined,
  };

  // Build skill object
  let skill: Skill = {
    id: row.id,
    name: row.name,
    description: row.description,
    content: row.content,
    source,
    format: row.format,
    metadata,
    checksum: row.checksum,
  };

  // Apply format conversion if requested
  if (validated.format && validated.format !== 'raw') {
    if (validated.format !== row.format) {
      log.info(`Converting skill from ${row.format} to ${validated.format}`);
      skill = await convertSkillFormat(skill, validated.format);
    }
  }

  // Find related skills (similar names or tags)
  const relatedSkills = await findRelatedSkills(db, skill);

  // Extract dependencies (MCP tools from metadata)
  const dependencies = metadata.mcp_tools || [];

  log.info(`Successfully fetched skill: ${skill.name}`);

  return {
    skill: validated.include_metadata !== false ? skill : stripMetadata(skill),
    related_skills: relatedSkills,
    dependencies,
  };
}

/**
 * Convert skill between formats
 */
async function convertSkillFormat(
  skill: Skill,
  targetFormat: 'claude' | 'codex'
): Promise<Skill> {
  // Simple format conversion (can be enhanced with AI-based conversion)
  let convertedContent = skill.content;

  if (skill.format === 'claude' && targetFormat === 'codex') {
    // Claude → Codex: Convert markdown-style prompts to Codex JSON format
    convertedContent = `{
  "name": "${skill.name}",
  "description": "${skill.description}",
  "prompt": ${JSON.stringify(skill.content)}
}`;
  } else if (skill.format === 'codex' && targetFormat === 'claude') {
    // Codex → Claude: Extract prompt from JSON format
    try {
      const codexSkill = JSON.parse(skill.content);
      convertedContent = codexSkill.prompt || skill.content;
    } catch (error) {
      log.warn('Failed to parse Codex skill JSON, returning as-is');
    }
  }

  return {
    ...skill,
    format: targetFormat,
    content: convertedContent,
  };
}

/**
 * Find skills related to the given skill
 */
async function findRelatedSkills(
  db: ReturnType<typeof getDatabase>,
  skill: Skill
): Promise<string[]> {
  // Find skills with similar names or shared tags
  const tags = skill.metadata.tags || [];
  const category = skill.metadata.category;

  if (tags.length === 0 && !category) {
    return [];
  }

  // Build query to find skills with matching tags or category
  const sql = `
    SELECT id, name
    FROM skills
    WHERE id != ?
    AND (
      ${
        category
          ? "json_extract(metadata, '$.category') = ?"
          : 'json_extract(metadata, "$.category") IS NOT NULL'
      }
      ${tags.length > 0 ? "OR json_extract(metadata, '$.tags') LIKE ?" : ''}
    )
    LIMIT 5
  `;

  const params: any[] = [skill.id];
  if (category) {
    params.push(category);
  }
  if (tags.length > 0) {
    // Simple LIKE match for tags (can be improved with JSON functions)
    params.push(`%${tags[0]}%`);
  }

  try {
    const related = db.query<{ id: string; name: string }>(sql, params);
    return related.map((r) => r.id);
  } catch (error) {
    log.warn('Failed to find related skills:', error);
    return [];
  }
}

/**
 * Strip metadata from skill if include_metadata is false
 */
function stripMetadata(skill: Skill): Skill {
  return {
    ...skill,
    metadata: {
      created_at: skill.metadata.created_at,
      updated_at: skill.metadata.updated_at,
    },
  };
}
