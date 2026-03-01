# SigSkills 🎯

**Semantic skill search, generation, and sync for Claude Code & Codex CLI**

SigSkills is a hybrid local/cloud MCP server that solves the "do I already have a skill for this?" problem by providing:

- 🔍 **Semantic search** across all your skills (local, GitHub, Codex)
- ⚡ **Progressive disclosure** - snippets first, full content on demand
- 🤖 **AI skill generation** - auto-create skills when none exist
- 🔄 **Auto-sync** - keep skills up to date from source repos
- 🛠️ **MCP tool indexing** - search available MCP capabilities
- 🔀 **Cross-pollination** - port skills between Claude ↔ Codex

---

## Quick Start

### 1. Install
```bash
cd ~/Projects/sigskills
npm install
npm run build
```

### 2. Configure
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Add to Claude Code
Add to `~/.config/claude/mcp.json`:
```json
{
  "mcpServers": {
    "sigskills": {
      "command": "node",
      "args": ["/Users/wsig/Projects/sigskills/dist/index.js"],
      "env": {
        "OPENAI_API_KEY": "your-key",
        "ANTHROPIC_API_KEY": "your-key"
      }
    }
  }
}
```

### 4. Index your skills
```bash
npm run index:local
```

---

## MCP Tools

### `search_skills`
Hybrid search (keyword + semantic) across all skill sources
```typescript
{
  query: "commit with conventional commits",
  source: "all",  // local | github | codex | all
  limit: 10
}
```

### `fetch_skill`
Get full skill content with auto-format conversion
```typescript
{
  skill_id: "abc123",
  format: "claude"  // claude | codex | raw
}
```

### `generate_skill`
AI-powered skill generation
```typescript
{
  prompt: "Create a skill that reviews PRs for security issues",
  format: "claude",
  save: true
}
```

### `search_mcp_tools`
Find available MCP tools by capability
```typescript
{
  query: "search apple documentation",
  server: "sosumi"
}
```

### `sync_skills`
Sync skills from configured sources
```typescript
{
  source: "github",
  direction: "pull",
  dry_run: false
}
```

---

## Features

### Multi-Source Indexing
- ✅ Local skills (`~/.claude/skills/`)
- ✅ **Codex CLI skills** (`~/.codex/skills/`)
- 🚧 GitHub repositories
- 🚧 Custom registries

### Semantic Search
- ✅ **Vector embeddings for fuzzy matching**
- ✅ **Keyword fallback for exact matches**
- ✅ **Hybrid ranking with auto-fallback**
- ✅ **Relevance scoring**
- ✅ **Tag/category filtering**

### Skill Generation
- 🚧 Claude-powered generation
- 🚧 Template-based creation
- ✅ **Format conversion (Claude ↔ Codex)**
- 🚧 Auto-validation

### MCP Tool Discovery
- Index installed MCP servers
- Search tools by capability
- Track skill → tool dependencies

### Cloud Sync (Upcoming)
- Cross-device sync
- Community skill sharing
- Version history
- Conflict resolution

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design docs.

---

## Development

```bash
# Dev mode with auto-reload
npm run dev

# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

---

## Roadmap

- [x] Phase 1: Project structure
- [x] **Codex CLI integration** (`src/indexer/codex-indexer.ts`)
- [x] **Format conversion** (Claude ↔ Codex, `src/generator/converter.ts`)
- [x] Phase 2: Basic MCP server scaffold
- [x] **Phase 3: Semantic search with embeddings** ✨ **COMPLETE!**
- [x] **Phase 3.5: Hybrid search with auto-fallback** ✨ **NEW!**
- [ ] Phase 4: Skill generation from prompts
- [ ] Phase 5: GitHub repo crawler
- [ ] Phase 6: Cloud sync

## Documentation

- [**Codex Integration Guide**](./docs/CODEX_INTEGRATION.md) - Full Codex CLI integration documentation
- [**Format Comparison**](./docs/FORMAT_COMPARISON.md) - Claude vs Codex format reference
- [Architecture Overview](./ARCHITECTURE.md) - System design and components

## Testing

```bash
# Test Codex indexer
npx tsx src/indexer/test-codex.ts

# Test format converter
npx tsx src/generator/test-converter.ts
```

---

## License

MIT
