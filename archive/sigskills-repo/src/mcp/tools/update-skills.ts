/**
 * Update Skills Tool Handler
 * Re-indexes and updates skills from configured sources
 */

import { getDatabase } from '../../db/index.js';
import {
  UpdateSkillsParams,
  UpdateSkillsParamsSchema,
  UpdateSkillsResult,
  SourceNotFoundError,
} from '../types.js';
import { logger } from '../../utils/logger.js';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import { createHash } from 'crypto';
import { randomUUID } from 'crypto';

const log = logger.child('update-skills');

interface SourceRow {
  id: string;
  type: string;
  path: string | null;
  repo: string | null;
  branch: string | null;
  enabled: number;
}

interface ExistingSkill {
  id: string;
  checksum: string;
  source_path: string;
}

/**
 * Update skills from configured sources
 */
export async function handleUpdateSkills(
  params: unknown
): Promise<UpdateSkillsResult> {
  const validated = UpdateSkillsParamsSchema.parse(params);
  const db = getDatabase();

  log.info('Starting skill update/re-index');

  // Get sources to update
  const sources = await getSourcesToUpdate(db, validated.source);

  if (sources.length === 0) {
    if (validated.source) {
      throw new SourceNotFoundError(validated.source);
    }
    log.warn('No enabled sources found to update');
    return {
      updated: 0,
      added: 0,
      removed: 0,
      errors: ['No enabled sources found'],
    };
  }

  let totalUpdated = 0;
  let totalAdded = 0;
  let totalRemoved = 0;
  const allErrors: string[] = [];

  // Update each source
  for (const source of sources) {
    try {
      const result = await updateSource(db, source, validated.force || false);
      totalUpdated += result.updated;
      totalAdded += result.added;
      totalRemoved += result.removed;

      if (result.errors) {
        allErrors.push(...result.errors);
      }

      // Update source metadata
      await updateSourceMetadata(db, source.id, result.added + result.updated);
    } catch (error) {
      const errorMsg = `Failed to update source ${source.id}: ${error instanceof Error ? error.message : String(error)}`;
      log.error(errorMsg);
      allErrors.push(errorMsg);
    }
  }

  log.info(
    `Update complete: ${totalAdded} added, ${totalUpdated} updated, ${totalRemoved} removed, ${allErrors.length} errors`
  );

  return {
    updated: totalUpdated,
    added: totalAdded,
    removed: totalRemoved,
    errors: allErrors.length > 0 ? allErrors : undefined,
  };
}

/**
 * Get sources to update
 */
async function getSourcesToUpdate(
  db: ReturnType<typeof getDatabase>,
  sourceId?: string
): Promise<SourceRow[]> {
  let sql = 'SELECT id, type, path, repo, branch, enabled FROM sources WHERE enabled = 1';
  const params: any[] = [];

  if (sourceId) {
    sql += ' AND id = ?';
    params.push(sourceId);
  }

  return db.query<SourceRow>(sql, params);
}

/**
 * Update a single source
 */
async function updateSource(
  db: ReturnType<typeof getDatabase>,
  source: SourceRow,
  force: boolean
): Promise<UpdateSkillsResult> {
  log.info(`Updating source: ${source.type} - ${source.path || source.repo}`);

  switch (source.type) {
    case 'local':
      return await updateLocalSource(db, source, force);

    case 'github':
      return await updateGithubSource(db, source, force);

    case 'codex':
      return await updateCodexSource(db, source, force);

    default:
      log.warn(`Unsupported source type: ${source.type}`);
      return {
        updated: 0,
        added: 0,
        removed: 0,
        errors: [`Unsupported source type: ${source.type}`],
      };
  }
}

/**
 * Update local filesystem source
 */
async function updateLocalSource(
  db: ReturnType<typeof getDatabase>,
  source: SourceRow,
  force: boolean
): Promise<UpdateSkillsResult> {
  if (!source.path) {
    throw new Error('Local source missing path');
  }

  const result: UpdateSkillsResult = {
    updated: 0,
    added: 0,
    removed: 0,
    errors: [],
  };

  try {
    // Scan directory for skill files
    const skillFiles = await scanSkillDirectory(source.path);

    log.info(`Found ${skillFiles.length} skill files in ${source.path}`);

    // Get existing skills for this source
    const existingSkills = await getExistingSkills(db, source.id);
    const existingPaths = new Set(existingSkills.map((s) => s.source_path));
    const processedPaths = new Set<string>();

    // Process each skill file
    for (const filePath of skillFiles) {
      try {
        processedPaths.add(filePath);

        // Read and parse skill
        const skillData = await parseSkillFile(filePath);
        const checksum = createHash('sha256').update(skillData.content).digest('hex');

        // Check if skill exists
        const existing = existingSkills.find((s) => s.source_path === filePath);

        if (existing) {
          // Update if checksum changed or force flag set
          if (force || existing.checksum !== checksum) {
            await updateSkill(db, existing.id, skillData, checksum, filePath, source.id);
            result.updated++;
            log.debug(`Updated skill: ${skillData.name}`);
          }
        } else {
          // Add new skill
          const skillId = randomUUID();
          await insertSkill(db, skillId, skillData, checksum, filePath, source);
          result.added++;
          log.debug(`Added skill: ${skillData.name}`);
        }
      } catch (error) {
        const errorMsg = `Failed to process ${filePath}: ${error instanceof Error ? error.message : String(error)}`;
        log.error(errorMsg);
        result.errors?.push(errorMsg);
      }
    }

    // Remove skills that no longer exist in filesystem
    for (const path of existingPaths) {
      if (!processedPaths.has(path)) {
        const skill = existingSkills.find((s) => s.source_path === path);
        if (skill) {
          await removeSkill(db, skill.id);
          result.removed++;
          log.debug(`Removed skill: ${skill.id}`);
        }
      }
    }
  } catch (error) {
    result.errors?.push(
      `Failed to update local source: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return result;
}

/**
 * Update GitHub repository source
 */
async function updateGithubSource(
  db: ReturnType<typeof getDatabase>,
  source: SourceRow,
  force: boolean
): Promise<UpdateSkillsResult> {
  // GitHub indexing requires Octokit integration
  log.warn('GitHub source update not yet implemented');

  return {
    updated: 0,
    added: 0,
    removed: 0,
    errors: ['GitHub source update not yet implemented'],
  };
}

/**
 * Update Codex CLI source
 */
async function updateCodexSource(
  db: ReturnType<typeof getDatabase>,
  source: SourceRow,
  force: boolean
): Promise<UpdateSkillsResult> {
  // Codex indexing requires Codex CLI integration
  log.warn('Codex source update not yet implemented');

  return {
    updated: 0,
    added: 0,
    removed: 0,
    errors: ['Codex source update not yet implemented'],
  };
}

/**
 * Scan directory for skill files
 */
async function scanSkillDirectory(dirPath: string): Promise<string[]> {
  const skillFiles: string[] = [];
  const validExtensions = ['.md', '.txt', '.json'];

  try {
    const files = readdirSync(dirPath);

    for (const file of files) {
      // Skip dotfiles and directories
      if (file.startsWith('.')) continue;

      const filePath = join(dirPath, file);
      const stats = statSync(filePath);

      if (stats.isDirectory()) continue;

      // Check if file has valid extension
      const ext = extname(file);
      if (validExtensions.includes(ext)) {
        skillFiles.push(filePath);
      }
    }
  } catch (error) {
    log.error(`Failed to scan directory ${dirPath}:`, error);
    throw error;
  }

  return skillFiles;
}

/**
 * Parse skill file and extract metadata
 */
async function parseSkillFile(filePath: string): Promise<{
  name: string;
  description: string;
  content: string;
  format: 'claude' | 'codex' | 'universal';
  metadata: any;
}> {
  const content = readFileSync(filePath, 'utf-8');
  const ext = extname(filePath);

  // Simple parsing - can be enhanced with frontmatter parsing
  if (ext === '.json') {
    // Codex JSON format
    try {
      const json = JSON.parse(content);
      return {
        name: json.name || 'Unnamed Skill',
        description: json.description || '',
        content: json.prompt || content,
        format: 'codex',
        metadata: json.metadata || {},
      };
    } catch (error) {
      throw new Error(`Invalid JSON in ${filePath}`);
    }
  }

  // Markdown or text format (Claude)
  const nameMatch = content.match(/^#\s+(.+)$/m);
  const name = nameMatch ? nameMatch[1].trim() : filePath.split('/').pop() || 'Unnamed';

  // Extract first paragraph as description
  const lines = content.split('\n').filter((l) => l.trim());
  const description = lines.slice(1, 3).join(' ').substring(0, 200);

  return {
    name,
    description,
    content,
    format: 'claude',
    metadata: {},
  };
}

/**
 * Get existing skills for a source
 */
async function getExistingSkills(
  db: ReturnType<typeof getDatabase>,
  sourceId: string
): Promise<ExistingSkill[]> {
  const sql = `
    SELECT s.id, s.checksum, s.source_path
    FROM skills s
    INNER JOIN sync_state ss ON s.id = ss.skill_id
    WHERE ss.source_id = ?
  `;

  return db.query<ExistingSkill>(sql, [sourceId]);
}

/**
 * Insert new skill into database
 */
async function insertSkill(
  db: ReturnType<typeof getDatabase>,
  skillId: string,
  skillData: any,
  checksum: string,
  filePath: string,
  source: SourceRow
): Promise<void> {
  const sql = `
    INSERT INTO skills (
      id, name, description, content, format,
      source_type, source_path,
      metadata, checksum,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
  `;

  db.execute(sql, [
    skillId,
    skillData.name,
    skillData.description,
    skillData.content,
    skillData.format,
    source.type,
    filePath,
    JSON.stringify(skillData.metadata),
    checksum,
  ]);

  // Add sync state
  const syncSql = `
    INSERT INTO sync_state (skill_id, source_id, checksum, synced_at)
    VALUES (?, ?, ?, unixepoch())
  `;

  db.execute(syncSql, [skillId, source.id, checksum]);
}

/**
 * Update existing skill in database
 */
async function updateSkill(
  db: ReturnType<typeof getDatabase>,
  skillId: string,
  skillData: any,
  checksum: string,
  filePath: string,
  sourceId: string
): Promise<void> {
  const sql = `
    UPDATE skills
    SET
      name = ?,
      description = ?,
      content = ?,
      checksum = ?,
      updated_at = unixepoch()
    WHERE id = ?
  `;

  db.execute(sql, [
    skillData.name,
    skillData.description,
    skillData.content,
    checksum,
    skillId,
  ]);

  // Update sync state
  const syncSql = `
    UPDATE sync_state
    SET checksum = ?, synced_at = unixepoch()
    WHERE skill_id = ? AND source_id = ?
  `;

  db.execute(syncSql, [checksum, skillId, sourceId]);
}

/**
 * Remove skill from database
 */
async function removeSkill(
  db: ReturnType<typeof getDatabase>,
  skillId: string
): Promise<void> {
  const sql = 'DELETE FROM skills WHERE id = ?';
  db.execute(sql, [skillId]);
}

/**
 * Update source metadata after indexing
 */
async function updateSourceMetadata(
  db: ReturnType<typeof getDatabase>,
  sourceId: string,
  skillCount: number
): Promise<void> {
  const sql = `
    UPDATE sources
    SET
      skill_count = ?,
      last_synced_at = unixepoch(),
      updated_at = unixepoch()
    WHERE id = ?
  `;

  db.execute(sql, [skillCount, sourceId]);
}
