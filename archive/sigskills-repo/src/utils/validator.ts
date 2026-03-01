/**
 * Skill validation using Zod schemas
 */

import { z } from 'zod';

/**
 * Skill source schema
 */
export const skillSourceSchema = z.object({
  type: z.enum(['local', 'github', 'codex', 'custom', 'generated']),
  path: z.string().optional(),
  repo: z.string().optional(),
  branch: z.string().optional(),
  commit: z.string().optional(),
  url: z.string().url().optional(),
});

/**
 * Skill metadata schema
 */
export const skillMetadataSchema = z.object({
  author: z.string().optional(),
  version: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  mcp_tools: z.array(z.string()).optional(),
  allowed_tools: z.array(z.string()).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  last_used: z.date().optional(),
  usage_count: z.number().int().nonnegative().optional(),
});

/**
 * Skill schema
 */
export const skillSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  name: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(10),
  source: skillSourceSchema,
  format: z.enum(['claude', 'codex', 'universal']),
  metadata: skillMetadataSchema,
  embedding: z.array(z.number()).optional(),
  checksum: z.string().min(1),
});

/**
 * Claude Code skill frontmatter schema
 */
export const claudeSkillFrontmatterSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  'allowed-tools': z.string().optional(),
  author: z.string().optional(),
  version: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

/**
 * Codex CLI skill schema
 */
export const codexSkillSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  prompt: z.string().min(10),
  metadata: z
    .object({
      author: z.string().optional(),
      version: z.string().optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
    })
    .optional(),
});

/**
 * Skill generation request schema
 */
export const generateSkillRequestSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  template: z.enum(['base', 'git', 'code-review', 'debug', 'ios', 'api']).optional(),
  format: z.enum(['claude', 'codex', 'universal']).optional().default('claude'),
  name: z.string().optional(),
  save: z.boolean().optional().default(false),
  savePath: z.string().optional(),
  metadata: skillMetadataSchema.partial().optional(),
});

/**
 * Template data schema
 */
export const templateDataSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  allowed_tools: z.array(z.string()).optional(),
  custom_sections: z.record(z.string()).optional(),
  examples: z.array(z.string()).optional(),
});

/**
 * Validate a skill object
 */
export function validateSkill(data: unknown) {
  return skillSchema.safeParse(data);
}

/**
 * Validate Claude Code skill frontmatter
 */
export function validateClaudeFrontmatter(data: unknown) {
  return claudeSkillFrontmatterSchema.safeParse(data);
}

/**
 * Validate Codex CLI skill
 */
export function validateCodexSkill(data: unknown) {
  return codexSkillSchema.safeParse(data);
}

/**
 * Validate skill generation request
 */
export function validateGenerateRequest(data: unknown) {
  return generateSkillRequestSchema.safeParse(data);
}

/**
 * Validate template data
 */
export function validateTemplateData(data: unknown) {
  return templateDataSchema.safeParse(data);
}

/**
 * Check if skill content meets minimum requirements
 */
export function validateSkillContent(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Minimum length
  if (content.length < 50) {
    errors.push('Skill content is too short (minimum 50 characters)');
  }

  // Should have some structure (headings, sections, etc.)
  if (!content.includes('#') && !content.includes('##')) {
    errors.push('Skill content should include markdown headings for structure');
  }

  // Should have meaningful content (not just whitespace)
  const meaningfulContent = content.replace(/\s+/g, ' ').trim();
  if (meaningfulContent.length < 30) {
    errors.push('Skill content lacks meaningful text');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate allowed-tools list
 */
export function validateAllowedTools(tools: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validTools = new Set([
    'Read',
    'Write',
    'Edit',
    'Bash',
    'Grep',
    'Glob',
    'NotebookEdit',
    'WebFetch',
    'WebSearch',
    'TodoWrite',
    'Skill',
  ]);

  const invalidTools = tools.filter((tool) => !validTools.has(tool));

  if (invalidTools.length > 0) {
    errors.push(`Invalid tools: ${invalidTools.join(', ')}`);
    errors.push(`Valid tools: ${Array.from(validTools).join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export type SkillValidationResult = z.SafeParseReturnType<unknown, z.infer<typeof skillSchema>>;
export type ClaudeFrontmatterValidationResult = z.SafeParseReturnType<
  unknown,
  z.infer<typeof claudeSkillFrontmatterSchema>
>;
export type CodexSkillValidationResult = z.SafeParseReturnType<
  unknown,
  z.infer<typeof codexSkillSchema>
>;
