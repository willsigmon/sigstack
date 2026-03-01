/**
 * Format Converter: Claude Code ↔ Codex CLI
 *
 * Handles bi-directional conversion between skill formats:
 *
 * CLAUDE CODE FORMAT:
 * - File naming: <skill-name>.md (flexible naming)
 * - Location: ~/.claude/skills/
 * - Frontmatter: name, description, allowed-tools, author, version, tags, category
 * - Full content injected at runtime
 * - Can reference allowed-tools for MCP capabilities
 *
 * CODEX CLI FORMAT:
 * - File naming: SKILL.md (strict, must be exactly this)
 * - Location: ~/.codex/skills/ (supports recursive subdirectories)
 * - Frontmatter: name (max 100 chars), description (max 500 chars), optional metadata
 * - Only name + description + path injected at runtime (body stays on disk)
 * - Can have scripts/ and references/ subdirectories
 * - Referenced via $<skill-name> syntax
 *
 * KEY DIFFERENCES:
 * 1. Claude skills: entire content in prompt context
 * 2. Codex skills: only metadata in context, body fetched on demand
 * 3. Claude skills: flat file structure
 * 4. Codex skills: can be nested in directories with resources
 * 5. Claude: allowed-tools for MCP integration
 * 6. Codex: scripts/ and references/ for external resources
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import type { Skill, ClaudeSkillFrontmatter } from '../types/skill.js';
import type { CodexSkillFrontmatter } from '../types/codex.js';

/**
 * Conversion options
 */
export interface ConversionOptions {
  /** Preserve original formatting where possible */
  preserveFormatting?: boolean;
  /** Include metadata comments in output */
  includeMetadata?: boolean;
  /** Target directory for output */
  outputDir?: string;
  /** Whether to create subdirectories for Codex skills */
  createSubdirectories?: boolean;
}

/**
 * Convert Claude skill to Codex format
 *
 * Strategy:
 * 1. Extract frontmatter
 * 2. Sanitize name/description to meet Codex limits
 * 3. Move allowed-tools to body as reference
 * 4. Create SKILL.md with limited frontmatter
 * 5. Optionally create subdirectory with skill name
 */
export async function claudeToCodex(
  claudeSkillPath: string,
  options: ConversionOptions = {}
): Promise<{ content: string; filename: string; subdirectory?: string }> {
  const content = await fs.readFile(claudeSkillPath, 'utf-8');
  const parsed = matter(content);
  const frontmatter = parsed.data as ClaudeSkillFrontmatter;

  // Sanitize for Codex limits
  const name = frontmatter.name.replace(/\n/g, ' ').slice(0, 100).trim();
  const description = frontmatter.description
    .replace(/\n/g, ' ')
    .slice(0, 500)
    .trim();

  // Build Codex frontmatter
  const codexFrontmatter: CodexSkillFrontmatter = {
    name,
    description,
  };

  // Add optional metadata if present
  if (
    frontmatter.author ||
    frontmatter.version ||
    frontmatter.tags ||
    frontmatter.category
  ) {
    codexFrontmatter.metadata = {
      author: frontmatter.author,
      version: frontmatter.version,
      tags: frontmatter.tags,
      category: frontmatter.category,
    };
  }

  // Build body with allowed-tools reference if present
  let body = parsed.content.trim();

  if (frontmatter['allowed-tools']) {
    const toolsSection = `\n\n## MCP Tools\n\nAllowed tools: \`${frontmatter['allowed-tools']}\`\n`;
    body = toolsSection + body;
  }

  if (options.includeMetadata) {
    const metadataComment = `<!-- Converted from Claude Code skill: ${path.basename(claudeSkillPath)} -->\n\n`;
    body = metadataComment + body;
  }

  // Generate SKILL.md content
  const codexContent = matter.stringify(body, codexFrontmatter);

  // Determine subdirectory name (use skill name, kebab-case)
  const subdirectory = options.createSubdirectories
    ? name.toLowerCase().replace(/\s+/g, '-')
    : undefined;

  return {
    content: codexContent,
    filename: 'SKILL.md',
    subdirectory,
  };
}

/**
 * Convert Codex skill to Claude format
 *
 * Strategy:
 * 1. Parse SKILL.md frontmatter
 * 2. Extract metadata if present
 * 3. Create Claude frontmatter with full fields
 * 4. Generate filename from skill name
 * 5. Include full body content
 */
export async function codexToClaude(
  codexSkillPath: string,
  options: ConversionOptions = {}
): Promise<{ content: string; filename: string }> {
  const content = await fs.readFile(codexSkillPath, 'utf-8');
  const parsed = matter(content);
  const frontmatter = parsed.data as CodexSkillFrontmatter;

  // Build Claude frontmatter
  const claudeFrontmatter: ClaudeSkillFrontmatter = {
    name: frontmatter.name,
    description: frontmatter.description,
  };

  // Add metadata if present
  if (frontmatter.metadata) {
    if (frontmatter.metadata.author) {
      claudeFrontmatter.author = frontmatter.metadata.author;
    }
    if (frontmatter.metadata.version) {
      claudeFrontmatter.version = frontmatter.metadata.version;
    }
    if (frontmatter.metadata.tags) {
      claudeFrontmatter.tags = frontmatter.metadata.tags;
    }
    if (frontmatter.metadata.category) {
      claudeFrontmatter.category = frontmatter.metadata.category;
    }
  }

  let body = parsed.content.trim();

  if (options.includeMetadata) {
    const skillDir = path.dirname(codexSkillPath);
    const metadataComment = `<!-- Converted from Codex skill: ${path.basename(skillDir)} -->\n\n`;
    body = metadataComment + body;
  }

  // Generate Claude skill content
  const claudeContent = matter.stringify(body, claudeFrontmatter);

  // Generate filename from skill name (kebab-case)
  const filename = frontmatter.name.toLowerCase().replace(/\s+/g, '-') + '.md';

  return {
    content: claudeContent,
    filename,
  };
}

/**
 * Batch convert directory of Claude skills to Codex format
 */
export async function batchClaudeToCodex(
  sourceDir: string,
  targetDir: string,
  options: ConversionOptions = {}
): Promise<{ converted: number; errors: number }> {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  let converted = 0;
  let errors = 0;

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    const sourcePath = path.join(sourceDir, entry.name);

    try {
      const result = await claudeToCodex(sourcePath, {
        ...options,
        createSubdirectories: true,
      });

      const targetPath = result.subdirectory
        ? path.join(targetDir, result.subdirectory, result.filename)
        : path.join(targetDir, result.filename);

      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, result.content, 'utf-8');

      console.log(`Converted: ${entry.name} → ${targetPath}`);
      converted++;
    } catch (error) {
      console.error(`Failed to convert ${entry.name}:`, error);
      errors++;
    }
  }

  return { converted, errors };
}

/**
 * Batch convert directory of Codex skills to Claude format
 */
export async function batchCodexToClaude(
  sourceDir: string,
  targetDir: string,
  options: ConversionOptions = {}
): Promise<{ converted: number; errors: number }> {
  // Recursively find all SKILL.md files
  const skillFiles: string[] = [];

  async function traverse(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await traverse(fullPath);
      } else if (entry.isFile() && entry.name === 'SKILL.md') {
        skillFiles.push(fullPath);
      }
    }
  }

  await traverse(sourceDir);

  let converted = 0;
  let errors = 0;

  for (const skillPath of skillFiles) {
    try {
      const result = await codexToClaude(skillPath, options);
      const targetPath = path.join(targetDir, result.filename);

      await fs.mkdir(targetDir, { recursive: true });
      await fs.writeFile(targetPath, result.content, 'utf-8');

      console.log(`Converted: ${skillPath} → ${result.filename}`);
      converted++;
    } catch (error) {
      console.error(`Failed to convert ${skillPath}:`, error);
      errors++;
    }
  }

  return { converted, errors };
}

/**
 * Convert universal Skill object to Claude format file
 */
export function skillToClaudeFormat(skill: Skill): string {
  const frontmatter: ClaudeSkillFrontmatter = {
    name: skill.name,
    description: skill.description,
  };

  // Only add optional fields if they exist
  if (skill.metadata.author) {
    frontmatter.author = skill.metadata.author;
  }
  if (skill.metadata.version) {
    frontmatter.version = skill.metadata.version;
  }
  if (skill.metadata.tags && skill.metadata.tags.length > 0) {
    frontmatter.tags = skill.metadata.tags;
  }
  if (skill.metadata.category) {
    frontmatter.category = skill.metadata.category;
  }

  // Add allowed-tools if present
  if (skill.metadata.allowed_tools && skill.metadata.allowed_tools.length > 0) {
    frontmatter['allowed-tools'] = skill.metadata.allowed_tools.join(', ');
  }

  return matter.stringify(skill.content, frontmatter);
}

/**
 * Convert universal Skill object to Codex format file
 */
export function skillToCodexFormat(skill: Skill): string {
  const frontmatter: CodexSkillFrontmatter = {
    name: skill.name.slice(0, 100),
    description: skill.description.slice(0, 500),
  };

  // Add metadata if present
  if (
    skill.metadata.author ||
    skill.metadata.version ||
    (skill.metadata.tags && skill.metadata.tags.length > 0) ||
    skill.metadata.category
  ) {
    frontmatter.metadata = {};

    if (skill.metadata.author) {
      frontmatter.metadata.author = skill.metadata.author;
    }
    if (skill.metadata.version) {
      frontmatter.metadata.version = skill.metadata.version;
    }
    if (skill.metadata.tags && skill.metadata.tags.length > 0) {
      frontmatter.metadata.tags = skill.metadata.tags;
    }
    if (skill.metadata.category) {
      frontmatter.metadata.category = skill.metadata.category;
    }
  }

  return matter.stringify(skill.content, frontmatter);
}

/**
 * Detect skill format from file content
 */
export async function detectSkillFormat(
  filePath: string
): Promise<'claude' | 'codex' | 'unknown'> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = matter(content);

    // Codex: must be named SKILL.md
    if (path.basename(filePath) === 'SKILL.md') {
      return 'codex';
    }

    // Claude: has allowed-tools field
    if ('allowed-tools' in parsed.data) {
      return 'claude';
    }

    // Check for Codex metadata structure
    if ('metadata' in parsed.data && typeof parsed.data.metadata === 'object') {
      return 'codex';
    }

    // Default to Claude if it has name + description
    if (parsed.data.name && parsed.data.description) {
      return 'claude';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}
