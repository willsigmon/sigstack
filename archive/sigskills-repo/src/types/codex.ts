/**
 * Codex CLI skill format type definitions
 */

/**
 * Codex skill frontmatter format
 */
export interface CodexSkillFrontmatter {
  name: string; // Max 100 chars
  description: string; // Max 500 chars
  metadata?: {
    author?: string;
    version?: string;
    tags?: string[];
    category?: string;
    dependencies?: string[];
    mcp_tools?: string[];
  };
}

/**
 * Codex skill file structure
 */
export interface CodexSkillFile {
  name: string;
  description: string;
  content: string;
  body: string; // Markdown body content (same as content)
  filePath: string; // Path to the SKILL.md file
  metadata?: CodexSkillFrontmatter['metadata'];
  relativePath?: string; // Relative path from skills root
}

/**
 * Codex directory paths
 */
export interface CodexPaths {
  home: string; // ~/.codex
  config: string; // ~/.codex/config
  skills: string; // ~/.codex/skills
  plans?: string; // ~/.codex/plans
  scripts?: string;
  references?: string;
}

/**
 * Codex skill directory structure
 */
export interface CodexSkillDirectory {
  /** Path to the skill directory */
  path: string;
  /** Parent directory name */
  parentDir?: string;
  /** Path to SKILL.md file */
  skillPath: string;
  /** SKILL.md file */
  skillFile: string;
  /** Optional scripts directory */
  scripts?: string[];
  /** Has scripts directory */
  hasScripts: boolean;
  /** Optional references directory */
  references?: string[];
  /** Has references directory */
  hasReferences: boolean;
  /** Additional files in directory */
  additionalFiles?: string[];
}

/**
 * Codex skill runtime representation
 */
export interface CodexSkillRuntime {
  name: string;
  description: string;
  path: string; // Path to SKILL.md
  /** Body content is NOT loaded in runtime by default */
  metadata?: CodexSkillFrontmatter['metadata'];
}
