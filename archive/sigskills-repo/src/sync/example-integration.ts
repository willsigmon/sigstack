/**
 * Example: How to integrate sync engine with source indexers
 * This file demonstrates the integration pattern - not meant to be imported
 */

import { syncEngine, SyncEngine } from './sync-engine.js';
import type { SourceIndexer, SourceMetadata } from './types.js';
import type { Skill } from '../types/skill.js';

/**
 * Example: Local Indexer Implementation
 */
class ExampleLocalIndexer implements SourceIndexer {
  sourceId = 'local-claude-skills';
  sourceType = 'local' as const;
  private basePath = process.env.HOME + '/.claude/skills';
  private skillsCache = new Map<string, Skill>();

  async fetchSkills(): Promise<Skill[]> {
    // In real implementation:
    // 1. Scan directory for .md, .json, .yml files
    // 2. Parse each file using SkillParser
    // 3. Return array of Skill objects

    const skills: Skill[] = [];
    // ... scanning logic here ...
    return skills;
  }

  async fetchSkill(skillId: string): Promise<Skill | null> {
    if (this.skillsCache.has(skillId)) {
      return this.skillsCache.get(skillId)!;
    }

    // Load from filesystem
    return null;
  }

  canPush(): boolean {
    return true; // Local filesystem supports writes
  }

  canDelete(): boolean {
    return true;
  }

  async pushSkill(skill: Skill): Promise<void> {
    // Write skill to filesystem
    const filePath = `${this.basePath}/${skill.name}.md`;
    // ... write logic using skill parser ...
  }

  async deleteSkill(skillId: string): Promise<void> {
    // Delete skill file from filesystem
  }

  getMetadata(): SourceMetadata {
    return {
      id: this.sourceId,
      type: this.sourceType,
      name: 'Local Claude Skills',
      path: this.basePath,
      enabled: true,
      skillCount: this.skillsCache.size,
    };
  }
}

/**
 * Example: GitHub Indexer Implementation
 */
class ExampleGitHubIndexer implements SourceIndexer {
  sourceId: string;
  sourceType = 'github' as const;
  private repo: string;
  private branch: string;

  constructor(sourceId: string, repo: string, branch = 'main') {
    this.sourceId = sourceId;
    this.repo = repo;
    this.branch = branch;
  }

  async fetchSkills(): Promise<Skill[]> {
    // In real implementation:
    // 1. Use Octokit to fetch repository tree
    // 2. Download skill files
    // 3. Parse and return skills

    const skills: Skill[] = [];
    // ... GitHub API calls ...
    return skills;
  }

  async fetchSkill(skillId: string): Promise<Skill | null> {
    // Fetch specific file from GitHub
    return null;
  }

  canPush(): boolean {
    return true; // If we have write access to repo
  }

  canDelete(): boolean {
    return true; // If we have write access
  }

  async pushSkill(skill: Skill): Promise<void> {
    // Create/update file in GitHub repo via API
    // Use Octokit to create commit
  }

  async deleteSkill(skillId: string): Promise<void> {
    // Delete file from GitHub repo via API
  }

  getMetadata(): SourceMetadata {
    return {
      id: this.sourceId,
      type: this.sourceType,
      name: `GitHub: ${this.repo}`,
      repo: this.repo,
      branch: this.branch,
      enabled: true,
      skillCount: 0, // Would track actual count
    };
  }
}

/**
 * Example: Codex CLI Indexer Implementation
 */
class ExampleCodexIndexer implements SourceIndexer {
  sourceId = 'codex-skills';
  sourceType = 'codex' as const;
  private codexPath = process.env.HOME + '/.codex/skills';

  async fetchSkills(): Promise<Skill[]> {
    // In real implementation:
    // 1. Scan Codex skills directory
    // 2. Parse Codex skill format (may differ from Claude)
    // 3. Convert to universal Skill format

    const skills: Skill[] = [];
    // ... scanning and conversion logic ...
    return skills;
  }

  async fetchSkill(skillId: string): Promise<Skill | null> {
    // Load specific Codex skill
    return null;
  }

  canPush(): boolean {
    return true; // Codex filesystem is writable
  }

  canDelete(): boolean {
    return true;
  }

  async pushSkill(skill: Skill): Promise<void> {
    // Convert from universal format to Codex format
    // Write to Codex skills directory
  }

  async deleteSkill(skillId: string): Promise<void> {
    // Delete from Codex directory
  }

  getMetadata(): SourceMetadata {
    return {
      id: this.sourceId,
      type: this.sourceType,
      name: 'Codex CLI Skills',
      path: this.codexPath,
      enabled: true,
      skillCount: 0,
    };
  }
}

/**
 * Example: Read-only Custom Registry Indexer
 */
class ExampleCustomRegistryIndexer implements SourceIndexer {
  sourceId: string;
  sourceType = 'custom' as const;
  private apiUrl: string;

  constructor(sourceId: string, apiUrl: string) {
    this.sourceId = sourceId;
    this.apiUrl = apiUrl;
  }

  async fetchSkills(): Promise<Skill[]> {
    // Fetch from custom API
    const response = await fetch(`${this.apiUrl}/skills`);
    const data = await response.json();

    // Convert API format to Skill format
    const skills: Skill[] = data.map((item: any) => ({
      // ... mapping logic ...
    }));

    return skills;
  }

  async fetchSkill(skillId: string): Promise<Skill | null> {
    const response = await fetch(`${this.apiUrl}/skills/${skillId}`);
    if (!response.ok) return null;

    const data = await response.json();
    // Convert to Skill format
    return null; // placeholder
  }

  canPush(): boolean {
    return false; // Read-only registry
  }

  canDelete(): boolean {
    return false;
  }

  getMetadata(): SourceMetadata {
    return {
      id: this.sourceId,
      type: this.sourceType,
      name: 'Custom Skill Registry',
      url: this.apiUrl,
      enabled: true,
      skillCount: 0,
    };
  }
}

// ============================================================================
// Usage Examples
// ============================================================================

/**
 * Example 1: Setup and register indexers
 */
async function setupSync() {
  // Create indexer instances
  const localIndexer = new ExampleLocalIndexer();
  const githubIndexer = new ExampleGitHubIndexer('my-github-skills', 'user/my-skills-repo');
  const codexIndexer = new ExampleCodexIndexer();
  const registryIndexer = new ExampleCustomRegistryIndexer(
    'skill-registry',
    'https://skills.example.com/api'
  );

  // Register with sync engine
  syncEngine.registerIndexer(localIndexer.sourceId, localIndexer);
  syncEngine.registerIndexer(githubIndexer.sourceId, githubIndexer);
  syncEngine.registerIndexer(codexIndexer.sourceId, codexIndexer);
  syncEngine.registerIndexer(registryIndexer.sourceId, registryIndexer);

  console.log('Sync engine initialized with 4 sources');
}

/**
 * Example 2: Pull all sources
 */
async function pullAllSources() {
  const result = await syncEngine.sync({
    direction: 'pull',
    strategy: 'merge',
    dry_run: false,
  });

  console.log('Sync completed:');
  console.log(`  Added: ${result.added}`);
  console.log(`  Updated: ${result.updated}`);
  console.log(`  Skipped: ${result.skipped}`);
  console.log(`  Conflicts: ${result.conflicts.length}`);

  if (result.conflicts.length > 0) {
    console.log('\nConflicts:');
    result.conflicts.forEach((c) => {
      console.log(`  - ${c.skill}: ${c.reason} (${c.resolution})`);
    });
  }
}

/**
 * Example 3: Dry run to preview changes
 */
async function previewSync() {
  console.log('Previewing sync changes (dry run)...\n');

  const result = await syncEngine.sync({
    direction: 'pull',
    dry_run: true,
  });

  console.log('Changes that would be applied:');
  console.log(`  ${result.added} skills would be added`);
  console.log(`  ${result.updated} skills would be updated`);
  console.log(`  ${result.skipped} skills would be skipped`);
}

/**
 * Example 4: Sync specific source only
 */
async function syncGitHub() {
  const result = await syncEngine.sync({
    source: 'my-github-skills',
    direction: 'pull',
    strategy: 'overwrite', // Always use GitHub version
  });

  console.log(`GitHub sync: ${result.added} added, ${result.updated} updated`);
}

/**
 * Example 5: Push local changes to GitHub
 */
async function pushToGitHub() {
  const result = await syncEngine.sync({
    source: 'my-github-skills',
    direction: 'push',
  });

  console.log(`Pushed ${result.updated} skills to GitHub`);
}

/**
 * Example 6: Bi-directional sync with conflict resolution
 */
async function bidirectionalSync() {
  // First, preview what would happen
  const preview = await syncEngine.sync({
    direction: 'both',
    dry_run: true,
  });

  console.log('Preview:');
  console.log(`  Would add: ${preview.added}`);
  console.log(`  Would update: ${preview.updated}`);

  // If looks good, execute
  const result = await syncEngine.sync({
    direction: 'both',
    strategy: 'newest', // Use newest version on conflict
  });

  console.log('\nCompleted:');
  console.log(`  Added: ${result.added}`);
  console.log(`  Updated: ${result.updated}`);
  console.log(`  Conflicts resolved: ${result.conflicts.length}`);
}

/**
 * Example 7: Integration with MCP tool handler
 */
async function mcpSyncHandler(params: {
  source?: string;
  direction?: 'pull' | 'push' | 'both';
  dry_run?: boolean;
  strategy?: 'overwrite' | 'merge' | 'skip';
}) {
  // This would be called from the MCP server's sync_skills tool
  const result = await syncEngine.sync(params);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

// Export examples (for documentation purposes)
export const examples = {
  setupSync,
  pullAllSources,
  previewSync,
  syncGitHub,
  pushToGitHub,
  bidirectionalSync,
  mcpSyncHandler,
};
