/**
 * Core type definitions for SigSkills
 */

export interface Skill {
  id: string; // UUID or hash
  name: string; // Skill name (e.g., "commit", "review-pr")
  description: string; // Brief description
  content: string; // Full skill prompt/template
  source: SkillSource; // Where it came from
  format: 'claude' | 'codex' | 'universal';
  metadata: SkillMetadata;
  embedding?: number[]; // For semantic search
  checksum: string; // For change detection
}

export interface SkillMetadata {
  author?: string;
  version?: string;
  tags?: string[];
  category?: string;
  dependencies?: string[];
  mcp_tools?: string[]; // MCP tools this skill uses
  allowed_tools?: string[]; // Claude Code allowed-tools
  created_at: Date;
  updated_at: Date;
  last_used?: Date;
  usage_count?: number;
}

export interface SkillSource {
  type: 'local' | 'github' | 'codex' | 'custom' | 'generated';
  path?: string; // Local file path
  repo?: string; // GitHub repo URL
  branch?: string;
  commit?: string;
  url?: string; // Custom URL
}

/**
 * Claude Code skill frontmatter format
 */
export interface ClaudeSkillFrontmatter {
  name: string;
  description: string;
  'allowed-tools'?: string;
  author?: string;
  version?: string;
  tags?: string[];
  category?: string;
}

/**
 * Codex CLI skill format (typically JSON)
 */
export interface CodexSkill {
  name: string;
  description: string;
  prompt: string;
  metadata?: {
    author?: string;
    version?: string;
    tags?: string[];
    category?: string;
  };
}

/**
 * Skill generation request
 */
export interface GenerateSkillRequest {
  prompt: string; // Natural language description
  template?: SkillTemplate; // Base template to use
  format?: 'claude' | 'codex' | 'universal';
  name?: string; // Suggested skill name
  save?: boolean; // Auto-save to local skills
  savePath?: string; // Custom save path
  metadata?: Partial<SkillMetadata>;
}

/**
 * Skill generation result
 */
export interface GenerateSkillResult {
  skill: Skill;
  saved_path?: string;
  suggestions?: string[]; // Improvement suggestions
  template_used?: string;
}

/**
 * Skill template type
 */
export type SkillTemplate = 'base' | 'git' | 'code-review' | 'debug' | 'ios' | 'api';

/**
 * Template variable substitution data
 */
export interface TemplateData {
  name: string;
  description: string;
  allowed_tools?: string[];
  custom_sections?: Record<string, string>;
  examples?: string[];
  [key: string]: any;
}
