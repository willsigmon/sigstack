/**
 * Skill file parser - handles markdown, JSON, and YAML formats
 */

import matter from 'gray-matter';
import { parse as parseYAML } from 'yaml';
import { readFileSync } from 'fs';
import { extname } from 'path';
import { createHash } from 'crypto';
import { logger } from './logger.js';

export interface ParsedSkill {
  name: string;
  description: string;
  content: string;
  metadata: SkillMetadata;
  checksum: string;
  format: 'claude' | 'codex' | 'universal';
}

export interface SkillMetadata {
  author?: string;
  version?: string;
  tags?: string[];
  category?: string;
  dependencies?: string[];
  mcp_tools?: string[];
  created_at: Date;
  updated_at: Date;
  last_used?: Date;
  usage_count?: number;
  [key: string]: unknown;
}

export class SkillParser {
  private log = logger.child('parser');

  /**
   * Parse a skill file and extract metadata
   */
  async parseFile(filePath: string): Promise<ParsedSkill> {
    const ext = extname(filePath).toLowerCase();
    const rawContent = readFileSync(filePath, 'utf-8');
    const checksum = this.generateChecksum(rawContent);

    try {
      switch (ext) {
        case '.md':
        case '.markdown':
          return this.parseMarkdown(filePath, rawContent, checksum);
        case '.json':
          return this.parseJSON(filePath, rawContent, checksum);
        case '.yaml':
        case '.yml':
          return this.parseYAML(filePath, rawContent, checksum);
        default:
          // Try markdown as default for unknown extensions
          this.log.warn(`Unknown file extension ${ext}, treating as markdown: ${filePath}`);
          return this.parseMarkdown(filePath, rawContent, checksum);
      }
    } catch (error) {
      this.log.error(`Failed to parse file ${filePath}:`, error);
      throw new Error(`Failed to parse skill file: ${filePath}`);
    }
  }

  /**
   * Parse markdown file with frontmatter
   */
  private parseMarkdown(filePath: string, content: string, checksum: string): ParsedSkill {
    const parsed = matter(content);
    const frontmatter = parsed.data as Partial<SkillMetadata>;
    const body = parsed.content.trim();

    // Extract name from frontmatter or filename
    const name = (frontmatter.name as string) || this.extractNameFromPath(filePath);

    // Extract description from frontmatter or first paragraph
    const description =
      (frontmatter.description as string) || this.extractDescriptionFromContent(body);

    // Determine format from metadata or content
    const format = this.detectFormat(frontmatter, body);

    const metadata: SkillMetadata = {
      author: frontmatter.author,
      version: frontmatter.version,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      category: frontmatter.category,
      dependencies: Array.isArray(frontmatter.dependencies) ? frontmatter.dependencies : [],
      mcp_tools: Array.isArray(frontmatter.mcp_tools) ? frontmatter.mcp_tools : [],
      created_at: frontmatter.created_at ? new Date(frontmatter.created_at) : new Date(),
      updated_at: frontmatter.updated_at ? new Date(frontmatter.updated_at) : new Date(),
      last_used: frontmatter.last_used ? new Date(frontmatter.last_used) : undefined,
      usage_count: frontmatter.usage_count || 0,
      ...this.extractCustomMetadata(frontmatter),
    };

    return {
      name,
      description,
      content: body,
      metadata,
      checksum,
      format,
    };
  }

  /**
   * Parse JSON skill definition
   */
  private parseJSON(filePath: string, content: string, checksum: string): ParsedSkill {
    const data = JSON.parse(content);

    const name = data.name || this.extractNameFromPath(filePath);
    const description = data.description || 'No description';
    const skillContent = data.content || data.prompt || '';
    const format = data.format || this.detectFormat(data, skillContent);

    const metadata: SkillMetadata = {
      author: data.author,
      version: data.version,
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: data.category,
      dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
      mcp_tools: Array.isArray(data.mcp_tools) ? data.mcp_tools : [],
      created_at: data.created_at ? new Date(data.created_at) : new Date(),
      updated_at: data.updated_at ? new Date(data.updated_at) : new Date(),
      last_used: data.last_used ? new Date(data.last_used) : undefined,
      usage_count: data.usage_count || 0,
      ...this.extractCustomMetadata(data),
    };

    return {
      name,
      description,
      content: skillContent,
      metadata,
      checksum,
      format,
    };
  }

  /**
   * Parse YAML skill definition
   */
  private parseYAML(filePath: string, content: string, checksum: string): ParsedSkill {
    const data = parseYAML(content);

    const name = data.name || this.extractNameFromPath(filePath);
    const description = data.description || 'No description';
    const skillContent = data.content || data.prompt || '';
    const format = data.format || this.detectFormat(data, skillContent);

    const metadata: SkillMetadata = {
      author: data.author,
      version: data.version,
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: data.category,
      dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
      mcp_tools: Array.isArray(data.mcp_tools) ? data.mcp_tools : [],
      created_at: data.created_at ? new Date(data.created_at) : new Date(),
      updated_at: data.updated_at ? new Date(data.updated_at) : new Date(),
      last_used: data.last_used ? new Date(data.last_used) : undefined,
      usage_count: data.usage_count || 0,
      ...this.extractCustomMetadata(data),
    };

    return {
      name,
      description,
      content: skillContent,
      metadata,
      checksum,
      format,
    };
  }

  /**
   * Extract skill name from file path
   */
  private extractNameFromPath(filePath: string): string {
    const basename = filePath.split('/').pop() || 'unknown';
    return basename.replace(/\.(md|json|yaml|yml)$/, '');
  }

  /**
   * Extract description from markdown content (first paragraph or heading)
   */
  private extractDescriptionFromContent(content: string): string {
    // Try to find first heading
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      return headingMatch[1].trim();
    }

    // Try to find first paragraph
    const paragraphMatch = content.match(/^(?!#)(.+?)(?:\n\n|$)/m);
    if (paragraphMatch) {
      return paragraphMatch[1].trim().substring(0, 200);
    }

    return 'No description';
  }

  /**
   * Detect skill format (claude, codex, or universal)
   */
  private detectFormat(
    metadata: Record<string, unknown>,
    content: string
  ): 'claude' | 'codex' | 'universal' {
    // Check explicit format in metadata
    if (metadata.format === 'claude' || metadata.format === 'codex' || metadata.format === 'universal') {
      return metadata.format;
    }

    // Detect from content patterns
    if (content.includes('claude') || content.includes('Claude')) {
      return 'claude';
    }
    if (content.includes('codex') || content.includes('Codex')) {
      return 'codex';
    }

    return 'universal';
  }

  /**
   * Extract custom metadata fields
   */
  private extractCustomMetadata(data: Record<string, unknown>): Record<string, unknown> {
    const standardFields = new Set([
      'name',
      'description',
      'content',
      'prompt',
      'author',
      'version',
      'tags',
      'category',
      'dependencies',
      'mcp_tools',
      'created_at',
      'updated_at',
      'last_used',
      'usage_count',
      'format',
    ]);

    const custom: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (!standardFields.has(key)) {
        custom[key] = value;
      }
    }

    return custom;
  }

  /**
   * Generate SHA256 checksum for content
   */
  private generateChecksum(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Validate parsed skill
   */
  validateSkill(skill: ParsedSkill): boolean {
    if (!skill.name || skill.name.trim().length === 0) {
      this.log.error('Skill validation failed: missing name');
      return false;
    }

    if (!skill.content || skill.content.trim().length === 0) {
      this.log.error('Skill validation failed: missing content');
      return false;
    }

    return true;
  }
}

// Export singleton instance
export const skillParser = new SkillParser();
