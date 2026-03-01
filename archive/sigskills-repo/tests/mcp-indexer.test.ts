/**
 * Tests for MCP Tool Indexer
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import * as fs from 'fs/promises';
import * as path from 'path';
import { tmpdir } from 'os';
import { MCPIndexer } from '../src/indexer/mcp-indexer.js';
import { MCPDependencyMapper } from '../src/indexer/mcp-dependency-mapper.js';

describe('MCPIndexer', () => {
  let db: Database.Database;
  let dbPath: string;
  let indexer: MCPIndexer;

  beforeEach(async () => {
    // Create temp database
    dbPath = path.join(tmpdir(), `test-${Date.now()}.db`);
    db = new Database(dbPath);

    // Initialize schema
    const schema = await fs.readFile('./src/db/schema.sql', 'utf-8');
    db.exec(schema);

    indexer = new MCPIndexer(db);
  });

  afterEach(() => {
    db.close();
    try {
      fs.unlink(dbPath);
    } catch {}
  });

  it('should generate unique tool IDs', () => {
    const id1 = (indexer as any).generateToolId('sosumi', 'searchAppleDocumentation');
    const id2 = (indexer as any).generateToolId('sosumi', 'searchAppleDocumentation');
    const id3 = (indexer as any).generateToolId('github', 'create_pull_request');

    expect(id1).toBe(id2); // Same inputs = same ID
    expect(id1).not.toBe(id3); // Different inputs = different ID
    expect(id1.length).toBe(16); // Truncated SHA-256
  });

  it('should detect transport types', () => {
    const detectTransport = (indexer as any).detectTransport.bind(indexer);

    expect(detectTransport({ url: 'https://example.com' })).toBe('sse');
    expect(detectTransport({ command: 'node', args: ['server.js'] })).toBe('stdio');
    expect(detectTransport({})).toBe('unknown');
  });

  it('should return known tools for Sosumi', () => {
    const tools = (indexer as any).getSosumiTools();

    expect(tools).toHaveLength(2);
    expect(tools[0].name).toBe('searchAppleDocumentation');
    expect(tools[1].name).toBe('fetchAppleDocumentation');
  });

  it('should return known tools for GitHub', () => {
    const tools = (indexer as any).getGitHubTools();

    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t: any) => t.name === 'create_pull_request')).toBe(true);
  });

  it('should store tools in database', () => {
    const tool = {
      name: 'testTool',
      description: 'A test tool',
      inputSchema: {
        type: 'object' as const,
        properties: {
          input: { type: 'string' },
        },
        required: ['input'],
      },
    };

    (indexer as any).storeToolInDB('testserver', tool, '/test/config.json');

    const stored = indexer.getToolsByServer('testserver');
    expect(stored).toHaveLength(1);
    expect(stored[0].tool_name).toBe('testTool');
    expect(stored[0].description).toBe('A test tool');
  });

  it('should search tools by query', () => {
    // Store some test tools
    const tools = [
      {
        name: 'searchDocs',
        description: 'Search documentation',
        inputSchema: { type: 'object' as const },
      },
      {
        name: 'createFile',
        description: 'Create a file',
        inputSchema: { type: 'object' as const },
      },
    ];

    for (const tool of tools) {
      (indexer as any).storeToolInDB('testserver', tool, '/test/config.json');
    }

    const results = indexer.searchTools('documentation');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].tool_name).toBe('searchDocs');
  });

  it('should filter by server when searching', () => {
    (indexer as any).storeToolInDB(
      'server1',
      {
        name: 'tool1',
        description: 'A test tool',
        inputSchema: { type: 'object' as const },
      },
      '/test/config.json'
    );

    (indexer as any).storeToolInDB(
      'server2',
      {
        name: 'tool2',
        description: 'Another test tool',
        inputSchema: { type: 'object' as const },
      },
      '/test/config.json'
    );

    const results = indexer.searchTools('test', { server: 'server1' });
    expect(results).toHaveLength(1);
    expect(results[0].server_name).toBe('server1');
  });

  it('should get all tools', () => {
    (indexer as any).storeToolInDB(
      'server1',
      {
        name: 'tool1',
        description: 'Tool 1',
        inputSchema: { type: 'object' as const },
      },
      '/test/config.json'
    );

    (indexer as any).storeToolInDB(
      'server2',
      {
        name: 'tool2',
        description: 'Tool 2',
        inputSchema: { type: 'object' as const },
      },
      '/test/config.json'
    );

    const allTools = indexer.getAllTools();
    expect(allTools).toHaveLength(2);
  });
});

describe('MCPDependencyMapper', () => {
  let db: Database.Database;
  let dbPath: string;
  let mapper: MCPDependencyMapper;

  beforeEach(async () => {
    dbPath = path.join(tmpdir(), `test-${Date.now()}.db`);
    db = new Database(dbPath);

    const schema = await fs.readFile('./src/db/schema.sql', 'utf-8');
    db.exec(schema);

    mapper = new MCPDependencyMapper(db);
  });

  afterEach(() => {
    db.close();
    try {
      fs.unlink(dbPath);
    } catch {}
  });

  const insertTestSkill = (id: string, name: string, content: string) => {
    db.prepare(`
      INSERT INTO skills (id, name, description, content, format, source_type, metadata, checksum)
      VALUES (?, ?, ?, ?, 'claude', 'local', '{}', 'test')
    `).run(id, name, 'Test skill', content);
  };

  it('should detect explicit MCP tool references', () => {
    insertTestSkill(
      'skill1',
      'ios-helper',
      'Use mcp__sosumi__searchAppleDocumentation to find Swift docs'
    );

    const tools = (mapper as any).detectMCPTools(
      'Use mcp__sosumi__searchAppleDocumentation to find Swift docs',
      'Test'
    );

    expect(tools).toContain('sosumi__searchAppleDocumentation');
  });

  it('should detect known server patterns', () => {
    const tools = (mapper as any).detectMCPTools(
      'This skill uses Sosumi to search Apple documentation',
      'iOS development helper'
    );

    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t: string) => t.includes('sosumi'))).toBe(true);
  });

  it('should update skill dependencies', async () => {
    insertTestSkill('skill1', 'test', 'content');

    const tools = ['sosumi__searchAppleDocumentation', 'github__create_pull_request'];
    (mapper as any).updateSkillDependencies('skill1', tools);

    const skill = db
      .prepare('SELECT metadata FROM skills WHERE id = ?')
      .get('skill1') as { metadata: string };

    const metadata = JSON.parse(skill.metadata);
    expect(metadata.mcp_tools).toEqual(tools);
  });

  it('should analyze all skills', async () => {
    insertTestSkill('skill1', 'ios-api', 'Use mcp__sosumi__searchAppleDocumentation');
    insertTestSkill('skill2', 'github-pr', 'Use mcp__github__create_pull_request');
    insertTestSkill('skill3', 'plain', 'Just a regular skill');

    const result = await mapper.analyzeAllSkills();

    expect(result.analyzed).toBe(3);
    expect(result.updated).toBe(2); // Only skill1 and skill2 have MCP tools
  });

  it('should find skills using a tool', () => {
    insertTestSkill('skill1', 'ios-api', 'content');

    // Update with tool dependency
    (mapper as any).updateSkillDependencies('skill1', ['sosumi__searchAppleDocumentation']);

    const skills = mapper.findSkillsUsingTool('sosumi', 'searchAppleDocumentation');

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toBe('ios-api');
  });

  it('should get tool usage statistics', async () => {
    insertTestSkill('skill1', 'ios-api', 'content');
    insertTestSkill('skill2', 'swift-helper', 'content');
    insertTestSkill('skill3', 'github-pr', 'content');

    (mapper as any).updateSkillDependencies('skill1', ['sosumi__searchAppleDocumentation']);
    (mapper as any).updateSkillDependencies('skill2', ['sosumi__searchAppleDocumentation']);
    (mapper as any).updateSkillDependencies('skill3', ['github__create_pull_request']);

    const stats = mapper.getToolUsageStats();

    expect(stats.length).toBe(2);
    expect(stats[0].tool_name).toBe('searchAppleDocumentation');
    expect(stats[0].usage_count).toBe(2);
  });

  it('should suggest tools based on content', () => {
    insertTestSkill('skill1', 'ios-helper', 'This skill helps with iOS and Swift development');

    const suggestions = mapper.suggestToolsForSkill('skill1');

    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some((s) => s.server === 'sosumi')).toBe(true);
  });

  it('should get dependency graph', async () => {
    insertTestSkill('skill1', 'ios-api', 'content');
    insertTestSkill('skill2', 'github-pr', 'content');

    (mapper as any).updateSkillDependencies('skill1', ['sosumi__searchAppleDocumentation']);
    (mapper as any).updateSkillDependencies('skill2', ['github__create_pull_request']);

    const graph = mapper.getDependencyGraph();

    expect(graph.size).toBe(2);
    expect(graph.get('ios-api')).toContain('sosumi__searchAppleDocumentation');
    expect(graph.get('github-pr')).toContain('github__create_pull_request');
  });
});
