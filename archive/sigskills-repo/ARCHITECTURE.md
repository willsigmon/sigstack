# SigSkills Architecture

## Vision
A hybrid local/cloud MCP server that provides semantic search, auto-sync, and generation for skills + MCP tools across Claude Code and Codex CLI ecosystems.

## Core Principles
1. **Local-first**: Works offline, indexes local skills immediately
2. **Progressive disclosure**: Return skill snippets, fetch full content only when needed
3. **Multi-source**: Aggregate skills from local, GitHub, Codex, custom registries
4. **Generative**: Auto-generate skills when none exist
5. **Cross-platform**: Seamless Claude ↔ Codex skill portability
6. **MCP-aware**: Index and search available MCP tools alongside skills

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Claude Code / Codex CLI                 │
│                     (MCP Client)                             │
└───────────────────────┬─────────────────────────────────────┘
                        │ MCP Protocol
┌───────────────────────▼─────────────────────────────────────┐
│                 SigSkills MCP Server (Local)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  MCP Tools:                                            │ │
│  │  - search_skills(query, source?, limit?)              │ │
│  │  - fetch_skill(skill_id, format?)                     │ │
│  │  - generate_skill(prompt, template?)                  │ │
│  │  - sync_skills(source?, direction?)                   │ │
│  │  - search_mcp_tools(query, capability?)               │ │
│  │  - list_sources()                                     │ │
│  │  - update_skills(source?)                             │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Core Components:                                      │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │  Skill       │  │  Semantic    │  │  Skill      │ │ │
│  │  │  Indexer     │─▶│  Search      │  │  Generator  │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │  Source      │  │  Sync        │  │  MCP Tool   │ │ │
│  │  │  Manager     │  │  Engine      │  │  Indexer    │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ REST API (optional cloud sync)
┌───────────────────────▼─────────────────────────────────────┐
│                 SigSkills Cloud (Optional)                   │
│  - Skill registry backup                                    │
│  - Cross-device sync                                        │
│  - Community skill sharing                                  │
│  - Analytics & usage tracking                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Skill Schema
```typescript
interface Skill {
  id: string;              // UUID or hash
  name: string;            // Skill name (e.g., "commit", "review-pr")
  description: string;     // Brief description
  content: string;         // Full skill prompt/template
  source: SkillSource;     // Where it came from
  format: 'claude' | 'codex' | 'universal';
  metadata: {
    author?: string;
    version?: string;
    tags?: string[];
    category?: string;
    dependencies?: string[];
    mcp_tools?: string[];  // MCP tools this skill uses
    created_at: Date;
    updated_at: Date;
    last_used?: Date;
    usage_count?: number;
  };
  embedding?: number[];    // For semantic search
  checksum: string;        // For change detection
}

interface SkillSource {
  type: 'local' | 'github' | 'codex' | 'custom' | 'generated';
  path?: string;           // Local file path
  repo?: string;           // GitHub repo URL
  branch?: string;
  commit?: string;
  url?: string;            // Custom URL
}

interface MCPTool {
  id: string;
  server_name: string;     // e.g., "sosumi", "github", "memory"
  tool_name: string;       // e.g., "searchAppleDocumentation"
  description: string;
  parameters: JSONSchema;
  source: string;          // Server config path
  embedding?: number[];
}
```

---

## Component Details

### 1. Skill Indexer
**Responsibilities:**
- Scan local skills directory (~/.claude/skills/)
- Parse skill files (markdown, JSON, YAML)
- Extract metadata (frontmatter, comments, annotations)
- Generate embeddings for semantic search
- Detect changes (checksum comparison)
- Index Codex CLI skills

**Technologies:**
- Chokidar for file watching
- Gray-matter for frontmatter parsing
- Crypto for checksums
- OpenAI API for embeddings (or local model)

### 2. Semantic Search
**Responsibilities:**
- Generate query embeddings
- Vector similarity search
- Keyword fallback for exact matches
- Ranking and relevance scoring
- Multi-source result merging

**Technologies:**
- SQLite with sqlite-vss (vector similarity search)
- OR ChromaDB for pure vector store
- Cosine similarity for ranking

### 3. Skill Generator
**Responsibilities:**
- Accept natural language prompts
- Generate skill content using Claude API
- Apply skill templates
- Validate generated skills
- Save to local skills directory
- Cross-compile between Claude/Codex formats

**Technologies:**
- Anthropic SDK (Claude API)
- Handlebars for templates
- Zod for validation

### 4. Source Manager
**Responsibilities:**
- Register skill sources (local, GitHub, custom)
- Fetch remote skills
- Cache remote content
- Handle authentication (GitHub tokens)
- Resolve conflicts across sources

**Technologies:**
- Octokit for GitHub API
- Node-fetch for HTTP
- SQLite for source registry

### 5. Sync Engine
**Responsibilities:**
- Detect local vs remote changes
- Bi-directional sync (push/pull)
- Conflict resolution strategies
- Version tracking
- Backup before overwrites

**Technologies:**
- Diff algorithms
- SQLite for sync state
- Optional cloud API

### 6. MCP Tool Indexer
**Responsibilities:**
- Parse MCP server configs (~/.config/claude/mcp.json, etc.)
- Extract available tools from each server
- Index tool capabilities
- Search tools by functionality
- Track which skills use which tools

**Technologies:**
- JSON schema parsing
- MCP protocol introspection

---

## MCP Tools Specification

### `search_skills`
```typescript
interface SearchSkillsParams {
  query: string;              // Semantic or keyword query
  source?: 'local' | 'github' | 'codex' | 'all';
  limit?: number;             // Max results (default: 10)
  format?: 'claude' | 'codex' | 'both';
  include_content?: boolean;  // Return full content or snippets
}

interface SearchSkillsResult {
  skills: Array<{
    id: string;
    name: string;
    description: string;
    source: string;
    score: number;            // Relevance score
    snippet?: string;         // First 200 chars
    path?: string;            // Local path if available
  }>;
  total: number;
}
```

### `fetch_skill`
```typescript
interface FetchSkillParams {
  skill_id: string;
  format?: 'claude' | 'codex' | 'raw';  // Auto-convert format
  include_metadata?: boolean;
}

interface FetchSkillResult {
  skill: Skill;
  related_skills?: string[];  // Similar skills
  dependencies?: string[];    // Required MCP tools/other skills
}
```

### `generate_skill`
```typescript
interface GenerateSkillParams {
  prompt: string;             // Natural language description
  template?: string;          // Base template to use
  format?: 'claude' | 'codex';
  name?: string;              // Suggested skill name
  save?: boolean;             // Auto-save to local skills
}

interface GenerateSkillResult {
  skill: Skill;
  saved_path?: string;
  suggestions?: string[];     // Improvement suggestions
}
```

### `sync_skills`
```typescript
interface SyncSkillsParams {
  source?: string;            // Specific source to sync
  direction?: 'pull' | 'push' | 'both';
  dry_run?: boolean;          // Preview changes
  strategy?: 'overwrite' | 'merge' | 'skip';
}

interface SyncSkillsResult {
  added: number;
  updated: number;
  skipped: number;
  conflicts: Array<{
    skill: string;
    reason: string;
    resolution?: string;
  }>;
}
```

### `search_mcp_tools`
```typescript
interface SearchMCPToolsParams {
  query: string;
  capability?: string;        // Filter by capability type
  server?: string;            // Filter by server name
}

interface SearchMCPToolsResult {
  tools: Array<{
    server: string;
    tool: string;
    description: string;
    parameters: object;
    example_usage?: string;
  }>;
}
```

### `list_sources`
```typescript
interface ListSourcesResult {
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
```

### `update_skills`
```typescript
interface UpdateSkillsParams {
  source?: string;            // Update specific source
  force?: boolean;            // Force re-index
}

interface UpdateSkillsResult {
  updated: number;
  added: number;
  removed: number;
  errors?: string[];
}
```

---

## Tech Stack

### Local MCP Server
- **Runtime**: Node.js 20+ / Bun (for speed)
- **Language**: TypeScript 5+
- **MCP Framework**: @modelcontextprotocol/sdk
- **Database**: SQLite + better-sqlite3
- **Vector Search**: sqlite-vss OR ChromaDB
- **Embeddings**: OpenAI API OR local (transformers.js)
- **Validation**: Zod
- **File watching**: Chokidar
- **GitHub API**: Octokit

### Cloud Sync (Optional Phase)
- **Backend**: Hono (edge-compatible)
- **Deploy**: Cloudflare Workers
- **Storage**: Cloudflare R2 + D1 (SQLite)
- **Auth**: GitHub OAuth

---

## Development Phases

### Phase 1: MVP (Local Only)
- [x] Project structure
- [ ] Basic MCP server scaffold
- [ ] Local skill indexer (~/.claude/skills/)
- [ ] Simple keyword search
- [ ] Fetch skill content
- [ ] MCP client configuration

### Phase 2: Semantic Search
- [ ] Embedding generation
- [ ] Vector database setup
- [ ] Semantic search implementation
- [ ] Ranking algorithm

### Phase 3: Skill Generation
- [ ] Claude API integration
- [ ] Skill templates
- [ ] Generation from prompts
- [x] Format conversion (Claude ↔ Codex)

### Phase 4: Multi-Source
- [ ] GitHub repo crawler
- [x] Codex CLI integration
- [ ] Custom registry support
- [ ] Source management UI

### Phase 5: MCP Tool Indexing
- [ ] Parse MCP configs
- [ ] Extract tool schemas
- [ ] Tool search functionality
- [ ] Skill → Tool dependency mapping

### Phase 6: Cloud Sync
- [ ] Backend API
- [ ] Sync protocol
- [ ] Conflict resolution
- [ ] Cross-device sync

### Phase 7: Advanced Features
- [ ] Auto-update mechanism
- [ ] Skill validation/testing
- [ ] Usage analytics
- [ ] Community sharing
- [ ] Skill marketplace

---

## File Structure
```
sigskills/
├── src/
│   ├── mcp/
│   │   ├── server.ts          # Main MCP server
│   │   ├── tools/             # MCP tool implementations
│   │   │   ├── search-skills.ts
│   │   │   ├── fetch-skill.ts
│   │   │   ├── generate-skill.ts
│   │   │   ├── sync-skills.ts
│   │   │   ├── search-mcp-tools.ts
│   │   │   ├── list-sources.ts
│   │   │   └── update-skills.ts
│   │   └── types.ts           # MCP type definitions
│   ├── indexer/
│   │   ├── local-indexer.ts   # Local skills scanner
│   │   ├── github-indexer.ts  # GitHub repo crawler
│   │   ├── codex-indexer.ts   # Codex CLI integration
│   │   ├── mcp-indexer.ts     # MCP tool indexer
│   │   └── embeddings.ts      # Embedding generation
│   ├── search/
│   │   ├── semantic.ts        # Vector search
│   │   ├── keyword.ts         # Fallback keyword search
│   │   └── ranking.ts         # Result ranking
│   ├── generator/
│   │   ├── skill-generator.ts # Skill generation logic
│   │   ├── templates/         # Skill templates
│   │   └── converter.ts       # Claude ↔ Codex conversion
│   ├── sync/
│   │   ├── sync-engine.ts     # Bi-directional sync
│   │   ├── conflict.ts        # Conflict resolution
│   │   └── cloud-client.ts    # Optional cloud API client
│   ├── db/
│   │   ├── schema.sql         # Database schema
│   │   ├── migrations/        # Schema migrations
│   │   └── index.ts           # Database interface
│   ├── utils/
│   │   ├── parser.ts          # Skill file parsing
│   │   ├── validator.ts       # Skill validation
│   │   └── logger.ts          # Logging
│   └── index.ts               # Entry point
├── templates/                 # Skill generation templates
├── tests/
├── docs/
├── package.json
├── tsconfig.json
├── .env.example
├── ARCHITECTURE.md            # This file
└── README.md
```

---

## Configuration

### MCP Client Config (~/.config/claude/mcp.json)
```json
{
  "mcpServers": {
    "sigskills": {
      "command": "node",
      "args": ["/Users/wsig/Projects/sigskills/dist/index.js"],
      "env": {
        "OPENAI_API_KEY": "sk-...",
        "ANTHROPIC_API_KEY": "sk-ant-...",
        "GITHUB_TOKEN": "ghp_..."
      }
    }
  }
}
```

### SigSkills Config (~/.sigskills/config.json)
```json
{
  "sources": [
    {
      "type": "local",
      "path": "~/.claude/skills/",
      "enabled": true,
      "watch": true
    },
    {
      "type": "codex",
      "path": "~/.codex/skills/",
      "enabled": true
    },
    {
      "type": "github",
      "repo": "wsig/my-skills",
      "branch": "main",
      "enabled": true,
      "sync_interval": "1h"
    }
  ],
  "embeddings": {
    "provider": "openai",
    "model": "text-embedding-3-small"
  },
  "generator": {
    "provider": "anthropic",
    "model": "claude-sonnet-4-5-20250929"
  },
  "search": {
    "default_limit": 10,
    "include_snippets": true
  },
  "sync": {
    "cloud_enabled": false,
    "conflict_strategy": "merge"
  }
}
```

---

## Success Metrics

1. **Search accuracy**: >90% of queries return relevant skills in top 3 results
2. **Speed**: Search latency <100ms for local, <500ms for multi-source
3. **Token efficiency**: Avg 80% token reduction vs. fetching full skills
4. **Generation quality**: >85% of generated skills work without modification
5. **Sync reliability**: Zero data loss, <1% conflict rate

---

## Future Enhancements

- [ ] Skill dependency graph visualization
- [ ] A/B testing framework for skill variants
- [ ] Skill performance analytics (success rate, token usage)
- [ ] Auto-deprecation of unused skills
- [ ] Skill composition (combine multiple skills)
- [ ] Natural language skill refinement
- [ ] Integration with Claude.ai projects
- [ ] Skill marketplace with ratings/reviews
- [ ] AI-powered skill optimization
- [ ] Skill versioning with rollback
