/**
 * Codex CLI Skills Indexer
 *
 * Discovers, parses, and indexes Codex CLI skills from ~/.codex/skills/
 * Codex uses SKILL.md format with YAML frontmatter
 *
 * Features:
 * - Recursive discovery of SKILL.md files
 * - Parse frontmatter + body
 * - Index into database with source='codex'
 * - File watching for changes
 * - Convert to universal Skill format
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { watch } from 'chokidar';
import matter from 'gray-matter';
import { createHash } from 'crypto';
import type {
  CodexSkillFrontmatter,
  CodexSkillFile,
  CodexSkillDirectory,
  CodexPaths,
} from '../types/codex.js';
import type { Skill } from '../types/skill.js';

/**
 * Detect Codex installation location
 */
export function getCodexPaths(): CodexPaths {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');

  return {
    home: codexHome,
    skills: path.join(codexHome, 'skills'),
    config: path.join(codexHome, 'config.toml'),
    plans: path.join(codexHome, 'plans'),
  };
}

/**
 * Check if Codex is installed
 */
export async function isCodexInstalled(): Promise<boolean> {
  try {
    const paths = getCodexPaths();
    const stats = await fs.stat(paths.home);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Recursively find all SKILL.md files in Codex skills directory
 * Follows Codex spec: only files named exactly "SKILL.md", skip hidden dirs
 */
export async function findCodexSkills(skillsDir: string): Promise<string[]> {
  const skillPaths: string[] = [];

  async function traverse(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        // Skip hidden entries (Codex spec)
        if (entry.name.startsWith('.')) {
          continue;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recurse into subdirectories
          await traverse(fullPath);
        } else if (entry.isFile() && entry.name === 'SKILL.md') {
          // Found a skill file
          skillPaths.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Failed to read directory ${dir}:`, error);
    }
  }

  await traverse(skillsDir);
  return skillPaths;
}

/**
 * Parse a single SKILL.md file
 */
export async function parseCodexSkill(
  filePath: string,
  skillsDir: string
): Promise<CodexSkillFile> {
  const content = await fs.readFile(filePath, 'utf-8');
  const parsed = matter(content);

  const frontmatter = parsed.data as CodexSkillFrontmatter;

  // Validate required fields (Codex spec)
  if (!frontmatter.name || typeof frontmatter.name !== 'string') {
    throw new Error(`Invalid or missing 'name' in ${filePath}`);
  }

  if (!frontmatter.description || typeof frontmatter.description !== 'string') {
    throw new Error(`Invalid or missing 'description' in ${filePath}`);
  }

  // Sanitize to single line (Codex spec)
  const name = frontmatter.name.replace(/\n/g, ' ').slice(0, 100).trim();
  const description = frontmatter.description.replace(/\n/g, ' ').slice(0, 500).trim();

  const relativePath = path.relative(skillsDir, filePath);

  const trimmedContent = parsed.content.trim();

  return {
    name,
    description,
    content: trimmedContent,
    body: trimmedContent, // body is same as content
    metadata: frontmatter.metadata,
    filePath,
    relativePath,
  };
}

/**
 * Analyze skill directory structure
 */
export async function analyzeSkillDirectory(
  skillPath: string
): Promise<CodexSkillDirectory> {
  const parentDir = path.dirname(skillPath);
  const dirName = path.basename(parentDir);

  try {
    const entries = await fs.readdir(parentDir, { withFileTypes: true });

    const hasScripts = entries.some(
      (e) => e.isDirectory() && e.name === 'scripts'
    );
    const hasReferences = entries.some(
      (e) => e.isDirectory() && e.name === 'references'
    );

    const additionalFiles = entries
      .filter((e) => e.isFile() && e.name !== 'SKILL.md')
      .map((e) => e.name);

    return {
      path: parentDir,
      skillPath,
      skillFile: 'SKILL.md',
      parentDir: dirName,
      hasScripts,
      hasReferences,
      additionalFiles,
    };
  } catch {
    return {
      path: parentDir,
      skillPath,
      skillFile: 'SKILL.md',
      parentDir: dirName,
      hasScripts: false,
      hasReferences: false,
      additionalFiles: [],
    };
  }
}

/**
 * Convert Codex skill to universal Skill format
 */
export function codexToSkill(codexSkill: CodexSkillFile): Skill {
  const id = createHash('sha256')
    .update(`codex:${codexSkill.filePath}`)
    .digest('hex')
    .slice(0, 16);

  const checksum = createHash('sha256')
    .update(codexSkill.name + codexSkill.description + codexSkill.body)
    .digest('hex');

  const now = new Date();

  return {
    id,
    name: codexSkill.name,
    description: codexSkill.description,
    content: codexSkill.body,
    source: {
      type: 'codex',
      path: codexSkill.filePath,
    },
    format: 'codex',
    metadata: {
      author: codexSkill.metadata?.author,
      version: codexSkill.metadata?.version,
      tags: codexSkill.metadata?.tags || [],
      category: codexSkill.metadata?.category,
      dependencies: codexSkill.metadata?.dependencies,
      created_at: now,
      updated_at: now,
    },
    checksum,
  };
}

/**
 * Index all Codex skills into the database
 */
export async function indexCodexSkills(
  onSkillFound: (skill: Skill) => Promise<void>,
  onProgress?: (current: number, total: number, skillName: string) => void
): Promise<{ indexed: number; errors: number }> {
  const paths = getCodexPaths();

  // Check if Codex is installed
  const installed = await isCodexInstalled();
  if (!installed) {
    console.log('Codex not installed, skipping Codex skills indexing');
    return { indexed: 0, errors: 0 };
  }

  // Check if skills directory exists
  try {
    await fs.access(paths.skills);
  } catch {
    console.log(`Codex skills directory not found: ${paths.skills}`);
    return { indexed: 0, errors: 0 };
  }

  console.log(`Indexing Codex skills from: ${paths.skills}`);

  const skillPaths = await findCodexSkills(paths.skills);
  console.log(`Found ${skillPaths.length} Codex SKILL.md files`);

  let indexed = 0;
  let errors = 0;

  for (let i = 0; i < skillPaths.length; i++) {
    const skillPath = skillPaths[i];

    try {
      const codexSkill = await parseCodexSkill(skillPath, paths.skills);
      const skill = codexToSkill(codexSkill);

      await onSkillFound(skill);
      indexed++;

      if (onProgress) {
        onProgress(i + 1, skillPaths.length, skill.name);
      }
    } catch (error) {
      console.error(`Failed to index ${skillPath}:`, error);
      errors++;
    }
  }

  return { indexed, errors };
}

/**
 * Watch Codex skills directory for changes
 */
export function watchCodexSkills(
  onChange: (skillPath: string, event: 'add' | 'change' | 'unlink') => void
): { close: () => void } | null {
  const paths = getCodexPaths();

  try {
    const watcher = watch(paths.skills, {
      ignored: /(^|[\/\\])\../, // Ignore hidden files/dirs
      persistent: true,
      ignoreInitial: true,
    });

    watcher
      .on('add', (filePath) => {
        if (path.basename(filePath) === 'SKILL.md') {
          onChange(filePath, 'add');
        }
      })
      .on('change', (filePath) => {
        if (path.basename(filePath) === 'SKILL.md') {
          onChange(filePath, 'change');
        }
      })
      .on('unlink', (filePath) => {
        if (path.basename(filePath) === 'SKILL.md') {
          onChange(filePath, 'unlink');
        }
      });

    return {
      close: () => watcher.close(),
    };
  } catch (error) {
    console.error('Failed to watch Codex skills directory:', error);
    return null;
  }
}

/**
 * Get skill statistics
 */
export async function getCodexSkillStats(): Promise<{
  total: number;
  withScripts: number;
  withReferences: number;
  byCategory: Record<string, number>;
}> {
  const paths = getCodexPaths();

  try {
    const skillPaths = await findCodexSkills(paths.skills);
    let withScripts = 0;
    let withReferences = 0;
    const byCategory: Record<string, number> = {};

    for (const skillPath of skillPaths) {
      const skill = await parseCodexSkill(skillPath, paths.skills);
      const dirInfo = await analyzeSkillDirectory(skillPath);

      if (dirInfo.hasScripts) withScripts++;
      if (dirInfo.hasReferences) withReferences++;

      if (skill.metadata?.category) {
        byCategory[skill.metadata.category] =
          (byCategory[skill.metadata.category] || 0) + 1;
      }
    }

    return {
      total: skillPaths.length,
      withScripts,
      withReferences,
      byCategory,
    };
  } catch {
    return {
      total: 0,
      withScripts: 0,
      withReferences: 0,
      byCategory: {},
    };
  }
}
