/**
 * MCP Tool Type Definitions for SigSkills
 * Matches spec in ARCHITECTURE.md
 */

import { z } from 'zod';

// ============================================================================
// Core Data Models
// ============================================================================

export const SkillSourceSchema = z.object({
  type: z.enum(['local', 'github', 'codex', 'custom', 'generated']),
  path: z.string().optional(),
  repo: z.string().optional(),
  branch: z.string().optional(),
  commit: z.string().optional(),
  url: z.string().optional(),
});

export type SkillSource = z.infer<typeof SkillSourceSchema>;

export const SkillMetadataSchema = z.object({
  author: z.string().optional(),
  version: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  mcp_tools: z.array(z.string()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
  last_used: z.date().optional(),
  usage_count: z.number().optional(),
});

export type SkillMetadata = z.infer<typeof SkillMetadataSchema>;

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  content: z.string(),
  source: SkillSourceSchema,
  format: z.enum(['claude', 'codex', 'universal']),
  metadata: SkillMetadataSchema,
  embedding: z.array(z.number()).optional(),
  checksum: z.string(),
});

export type Skill = z.infer<typeof SkillSchema>;

export const MCPToolSchema = z.object({
  id: z.string(),
  server_name: z.string(),
  tool_name: z.string(),
  description: z.string(),
  parameters: z.record(z.any()),
  source: z.string(),
  embedding: z.array(z.number()).optional(),
});

export type MCPTool = z.infer<typeof MCPToolSchema>;

// ============================================================================
// MCP Tool Parameters & Results
// ============================================================================

// search_skills
export const SearchSkillsParamsSchema = z.object({
  query: z.string(),
  source: z.enum(['local', 'github', 'codex', 'all']).optional(),
  limit: z.number().optional().default(10),
  format: z.enum(['claude', 'codex', 'both']).optional(),
  include_content: z.boolean().optional().default(false),
});

export type SearchSkillsParams = z.infer<typeof SearchSkillsParamsSchema>;

export interface SearchSkillsResult {
  skills: Array<{
    id: string;
    name: string;
    description: string;
    source: string;
    score: number;
    snippet?: string;
    path?: string;
  }>;
  total: number;
}

// fetch_skill
export const FetchSkillParamsSchema = z.object({
  skill_id: z.string(),
  format: z.enum(['claude', 'codex', 'raw']).optional(),
  include_metadata: z.boolean().optional().default(true),
});

export type FetchSkillParams = z.infer<typeof FetchSkillParamsSchema>;

export interface FetchSkillResult {
  skill: Skill;
  related_skills?: string[];
  dependencies?: string[];
}

// generate_skill
export const GenerateSkillParamsSchema = z.object({
  prompt: z.string(),
  template: z.string().optional(),
  format: z.enum(['claude', 'codex']).optional().default('claude'),
  name: z.string().optional(),
  save: z.boolean().optional().default(false),
});

export type GenerateSkillParams = z.infer<typeof GenerateSkillParamsSchema>;

export interface GenerateSkillResult {
  skill: Skill;
  saved_path?: string;
  suggestions?: string[];
}

// sync_skills
export const SyncSkillsParamsSchema = z.object({
  source: z.string().optional(),
  direction: z.enum(['pull', 'push', 'both']).optional().default('pull'),
  dry_run: z.boolean().optional().default(false),
  strategy: z.enum(['overwrite', 'merge', 'skip']).optional().default('merge'),
});

export type SyncSkillsParams = z.infer<typeof SyncSkillsParamsSchema>;

export interface SyncSkillsResult {
  added: number;
  updated: number;
  skipped: number;
  conflicts: Array<{
    skill: string;
    reason: string;
    resolution?: string;
  }>;
}

// search_mcp_tools
export const SearchMCPToolsParamsSchema = z.object({
  query: z.string(),
  capability: z.string().optional(),
  server: z.string().optional(),
});

export type SearchMCPToolsParams = z.infer<typeof SearchMCPToolsParamsSchema>;

export interface SearchMCPToolsResult {
  tools: Array<{
    server: string;
    tool: string;
    description: string;
    parameters: object;
    example_usage?: string;
  }>;
}

// get_status
export const GetStatusParamsSchema = z.object({});

export interface GetStatusResult {
  db_path: string;
  uptime_seconds: number;
  skills_total: number;
  sources_total: number;
  sources_enabled: number;
  mcp_tools_total: number;
}

// list_sources
export interface ListSourcesResult {
  sources: Array<{
    id: string;
    type: 'local' | 'github' | 'codex' | 'custom';
    path?: string;
    repo?: string;
    skill_count: number;
    last_synced?: Date;
    enabled: boolean;
  }>;
}

// update_skills
export const UpdateSkillsParamsSchema = z.object({
  source: z.string().optional(),
  force: z.boolean().optional().default(false),
});

export type UpdateSkillsParams = z.infer<typeof UpdateSkillsParamsSchema>;

export interface UpdateSkillsResult {
  updated: number;
  added: number;
  removed: number;
  errors?: string[];
}

// ============================================================================
// MCP Tool Handler Type
// ============================================================================

export type ToolHandler<TParams = unknown, TResult = unknown> = (
  params: TParams
) => Promise<TResult>;

// ============================================================================
// Error Types
// ============================================================================

export class SkillNotFoundError extends Error {
  constructor(skillId: string) {
    super(`Skill not found: ${skillId}`);
    this.name = 'SkillNotFoundError';
  }
}

export class SourceNotFoundError extends Error {
  constructor(source: string) {
    super(`Source not found: ${source}`);
    this.name = 'SourceNotFoundError';
  }
}

export class SyncConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyncConflictError';
  }
}

export class GenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GenerationError';
  }
}
