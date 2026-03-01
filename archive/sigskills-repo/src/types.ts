/**
 * Shared type definitions for SigSkills
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

export interface SkillSource {
  type: 'local' | 'github' | 'codex' | 'custom' | 'generated';
  path?: string; // Local file path
  repo?: string; // GitHub repo URL
  branch?: string;
  commit?: string;
  url?: string; // Custom URL
}

export interface SkillMetadata {
  author?: string;
  version?: string;
  tags?: string[];
  category?: string;
  dependencies?: string[];
  mcp_tools?: string[]; // MCP tools this skill uses
  created_at: Date;
  updated_at: Date;
  last_used?: Date;
  usage_count?: number;
  [key: string]: unknown; // Allow custom metadata
}

export interface MCPTool {
  id: string;
  server_name: string; // e.g., "sosumi", "github", "memory"
  tool_name: string; // e.g., "searchAppleDocumentation"
  description: string;
  parameters: Record<string, unknown>; // JSONSchema
  source: string; // Server config path
  embedding?: number[];
}

export interface IndexerOptions {
  watchForChanges?: boolean;
  debounceMs?: number;
  ignoreDotfiles?: boolean;
  maxFileSize?: number; // in bytes
}

export interface IndexResult {
  added: number;
  updated: number;
  removed: number;
  errors: string[];
}

export interface SkillSearchResult {
  id: string;
  name: string;
  description: string;
  source: string;
  score: number;
  snippet?: string;
  path?: string;
}
