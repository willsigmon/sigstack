/**
 * MCP Tool Dependency Mapper
 *
 * Analyzes skills to detect which MCP tools they use
 * and creates dependency mappings.
 */

import { Logger } from '../utils/logger.js';
import type { SkillsDatabase } from '../db/index.js';

const logger = new Logger({ prefix: 'mcp-dependency-mapper' });

// ============================================================================
// Types
// ============================================================================

export interface SkillToolDependency {
  skill_id: string;
  skill_name: string;
  mcp_tools: string[];
}

export interface ToolUsageStats {
  server_name: string;
  tool_name: string;
  usage_count: number;
  skills: Array<{ id: string; name: string }>;
}

// ============================================================================
// MCP Tool Reference Patterns
// ============================================================================

/**
 * Common patterns for detecting MCP tool usage in skill content
 */
const MCP_TOOL_PATTERNS = {
  // Explicit MCP tool calls: mcp__server__toolName
  explicit: /mcp__([a-zA-Z0-9_-]+)__([a-zA-Z0-9_]+)/g,

  // Common MCP servers mentioned in text
  sosumi: /sosumi|searchAppleDocumentation|fetchAppleDocumentation/gi,
  github: /github.*mcp|create_pull_request|create_or_update_file/gi,
  memory: /memory.*mcp|create_memory|get_memory/gi,
  puppeteer: /puppeteer.*mcp|puppeteer_navigate|puppeteer_screenshot/gi,
  xcode: /xcode.*mcp|getDiagnostics|executeCode/gi,
  omi: /omi.*mcp|search_memories|get_recent_memories/gi,
};

// Known tool mappings for common patterns
const KNOWN_TOOLS: Record<string, Array<{ server: string; tool: string }>> = {
  sosumi: [
    { server: 'sosumi', tool: 'searchAppleDocumentation' },
    { server: 'sosumi', tool: 'fetchAppleDocumentation' },
  ],
  github: [
    { server: 'github', tool: 'create_pull_request' },
    { server: 'github', tool: 'create_or_update_file' },
  ],
  memory: [
    { server: 'memory', tool: 'create_memory' },
    { server: 'memory', tool: 'get_memory' },
  ],
  puppeteer: [
    { server: 'puppeteer', tool: 'puppeteer_navigate' },
    { server: 'puppeteer', tool: 'puppeteer_screenshot' },
  ],
  xcode: [
    { server: 'xcode', tool: 'getDiagnostics' },
    { server: 'xcode', tool: 'executeCode' },
  ],
  omi: [
    { server: 'omi', tool: 'search_memories' },
    { server: 'omi', tool: 'get_recent_memories' },
  ],
};

// ============================================================================
// MCPDependencyMapper Class
// ============================================================================

export class MCPDependencyMapper {
  private db: SkillsDatabase;

  constructor(db: SkillsDatabase) {
    this.db = db;
  }

  /**
   * Analyze all skills and extract MCP tool dependencies
   */
  async analyzeAllSkills(): Promise<{ analyzed: number; updated: number }> {
    logger.info('Analyzing all skills for MCP tool dependencies...');

    const skills = this.getAllSkills();
    let updated = 0;

    for (const skill of skills) {
      const tools = this.detectMCPTools(skill.content, skill.description);

      if (tools.length > 0) {
        this.updateSkillDependencies(skill.id, tools);
        updated++;
        logger.debug(`Skill ${skill.name}: ${tools.join(', ')}`);
      }
    }

    logger.info(`Analyzed ${skills.length} skills, updated ${updated} with MCP tool dependencies`);
    return { analyzed: skills.length, updated };
  }

  /**
   * Analyze a single skill for MCP tool usage
   */
  analyzeSkill(skillId: string): string[] {
    const skill = this.getSkillById(skillId);
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`);
    }

    const tools = this.detectMCPTools(skill.content, skill.description);
    this.updateSkillDependencies(skillId, tools);

    return tools;
  }

  /**
   * Detect MCP tools used in skill content
   */
  private detectMCPTools(content: string, description: string): string[] {
    const tools = new Set<string>();
    const combinedText = `${description}\n${content}`;

    // 1. Detect explicit MCP tool references (mcp__server__tool)
    const explicitMatches = combinedText.matchAll(MCP_TOOL_PATTERNS.explicit);
    for (const match of explicitMatches) {
      const [, server, tool] = match;
      tools.add(`${server}__${tool}`);
    }

    // 2. Detect known server/tool patterns
    for (const [serverKey, pattern] of Object.entries(MCP_TOOL_PATTERNS)) {
      if (serverKey === 'explicit') continue;

      if (pattern.test(combinedText)) {
        // Add all known tools for this server
        const knownTools = KNOWN_TOOLS[serverKey] || [];
        for (const { server, tool } of knownTools) {
          tools.add(`${server}__${tool}`);
        }
      }
    }

    return Array.from(tools);
  }

  /**
   * Update skill's MCP tool dependencies in metadata
   */
  private updateSkillDependencies(skillId: string, tools: string[]): void {
    const skill = this.db.getSkill(skillId);
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`);
    }

    const updatedSkill = {
      ...skill,
      metadata: {
        ...skill.metadata,
        mcp_tools: tools,
      },
    };

    this.db.upsertSkill(updatedSkill);
  }

  /**
   * Get all skills from database
   */
  private getAllSkills() {
    return this.db.listSkills();
  }

  /**
   * Get skill by ID
   */
  private getSkillById(id: string) {
    return this.db.getSkill(id);
  }

  /**
   * Get tool usage statistics across all skills
   */
  getToolUsageStats(): ToolUsageStats[] {
    const skills = this.db.listSkills();

    // Aggregate tool usage
    const toolUsage = new Map<string, { server: string; tool: string; skills: Array<{ id: string; name: string }> }>();

    for (const skill of skills) {
      const mcpTools = skill.metadata.mcp_tools || [];

      for (const toolRef of mcpTools) {
        const [server, tool] = toolRef.split('__');
        const key = toolRef;

        if (!toolUsage.has(key)) {
          toolUsage.set(key, { server, tool, skills: [] });
        }

        toolUsage.get(key)!.skills.push({ id: skill.id, name: skill.name });
      }
    }

    // Convert to stats array
    return Array.from(toolUsage.entries()).map(([key, data]) => ({
      server_name: data.server,
      tool_name: data.tool,
      usage_count: data.skills.length,
      skills: data.skills,
    })).sort((a, b) => b.usage_count - a.usage_count);
  }

  /**
   * Find skills that use a specific MCP tool
   */
  findSkillsUsingTool(serverName: string, toolName: string): Array<{ id: string; name: string }> {
    const toolRef = `${serverName}__${toolName}`;
    const skills = this.db.listSkills();

    return skills
      .filter(skill => {
        const mcpTools = skill.metadata.mcp_tools || [];
        return mcpTools.includes(toolRef);
      })
      .map(skill => ({ id: skill.id, name: skill.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get all MCP tools used by a specific skill
   */
  getSkillToolDependencies(skillId: string): string[] {
    const skill = this.getSkillById(skillId);
    if (!skill) {
      return [];
    }

    return skill.metadata.mcp_tools || [];
  }

  /**
   * Get dependency graph: which skills depend on which tools
   */
  getDependencyGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    const skills = this.db.listSkills();

    for (const skill of skills) {
      const tools = skill.metadata.mcp_tools || [];
      if (tools.length > 0) {
        graph.set(skill.name, tools);
      }
    }

    return graph;
  }

  /**
   * Suggest MCP tools for a skill based on content analysis
   */
  suggestToolsForSkill(skillId: string): Array<{ server: string; tool: string; reason: string }> {
    const skill = this.getSkillById(skillId);
    if (!skill) {
      return [];
    }

    const suggestions: Array<{ server: string; tool: string; reason: string }> = [];
    const content = skill.content.toLowerCase();
    const description = skill.description.toLowerCase();
    const combined = `${description} ${content}`;

    // Suggest Sosumi for iOS/Apple related content
    if (combined.match(/ios|swift|apple|xcode|swiftui|uikit|macos/i)) {
      suggestions.push({
        server: 'sosumi',
        tool: 'searchAppleDocumentation',
        reason: 'Skill mentions iOS/Swift development',
      });
    }

    // Suggest GitHub tools for PR/repo content
    if (combined.match(/pull request|github|repository|commit/i)) {
      suggestions.push({
        server: 'github',
        tool: 'create_pull_request',
        reason: 'Skill mentions GitHub/PR operations',
      });
    }

    // Suggest Memory for context/state management
    if (combined.match(/memory|context|remember|state/i)) {
      suggestions.push({
        server: 'memory',
        tool: 'create_memory',
        reason: 'Skill involves state/context management',
      });
    }

    // Suggest Puppeteer for browser/web automation
    if (combined.match(/browser|web|screenshot|navigate|automation/i)) {
      suggestions.push({
        server: 'puppeteer',
        tool: 'puppeteer_navigate',
        reason: 'Skill involves web automation',
      });
    }

    return suggestions;
  }
}

export default MCPDependencyMapper;
