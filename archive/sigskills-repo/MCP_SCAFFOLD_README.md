# SigSkills MCP Server Scaffold

## ✅ Created Files

### 1. `/Users/wsig/Projects/sigskills/src/mcp/types.ts` (6.0KB)
Complete TypeScript type definitions for all MCP tools matching ARCHITECTURE.md spec:

**Core Data Models:**
- `Skill` - Full skill schema with metadata, embeddings, source info
- `SkillSource` - Source tracking (local/github/codex/custom/generated)
- `SkillMetadata` - Author, tags, dependencies, MCP tools, usage stats
- `MCPTool` - MCP tool representation with server info

**MCP Tool Parameters (with Zod validation):**
- `SearchSkillsParams` - Query, source filter, limit, format, content inclusion
- `FetchSkillParams` - Skill ID, format conversion, metadata inclusion
- `GenerateSkillParams` - Prompt, template, format, name, auto-save
- `SyncSkillsParams` - Source, direction, dry-run, conflict strategy
- `SearchMCPToolsParams` - Query, capability filter, server filter
- `UpdateSkillsParams` - Source, force re-index

**Result Types:**
- `SearchSkillsResult` - Ranked results with snippets
- `FetchSkillResult` - Full skill with related skills & dependencies
- `GenerateSkillResult` - Generated skill with save path & suggestions
- `SyncSkillsResult` - Sync stats and conflict details
- `SearchMCPToolsResult` - MCP tool search results
- `ListSourcesResult` - Source registry with status
- `UpdateSkillsResult` - Update statistics

**Custom Error Types:**
- `SkillNotFoundError`
- `SourceNotFoundError`
- `SyncConflictError`
- `GenerationError`

---

### 2. `/Users/wsig/Projects/sigskills/src/mcp/server.ts` (12KB)
Main MCP server implementation using `@modelcontextprotocol/sdk`:

**Features:**
- ✅ Server instance creation with proper metadata
- ✅ Stdio transport for Claude Code compatibility
- ✅ All 7 tools registered:
  1. `search_skills` - Semantic/keyword search
  2. `fetch_skill` - Fetch full skill content
  3. `generate_skill` - Generate skills from prompts
  4. `sync_skills` - Bi-directional sync with conflict resolution
  5. `search_mcp_tools` - Search available MCP tools
  6. `list_sources` - List configured sources
  7. `update_skills` - Re-index skills
- ✅ Complete JSON Schema for each tool's input
- ✅ Zod validation for all parameters
- ✅ Error handling with stack traces
- ✅ Graceful shutdown (SIGINT/SIGTERM)
- ✅ Logging to stderr (stdio compliance)

**Tool Handlers:**
All handlers are stubbed with:
- Parameter validation using Zod schemas
- Console logging for debugging
- Proper return types
- TODO comments marking implementation points

**Server Architecture:**
- Clean separation of tool definitions and handlers
- Centralized error handling
- Extensible design for adding implementations
- MCP protocol compliance

---

### 3. `/Users/wsig/Projects/sigskills/src/index.ts` (388B)
Entry point for the MCP server:

**Features:**
- ✅ Shebang for CLI execution (`#!/usr/bin/env node`)
- ✅ Loads `.env` configuration
- ✅ Starts MCP server via `runServer()`
- ✅ Top-level error handling
- ✅ Process exit on fatal errors

---

## 🔍 Verification

The scaffold has been verified to:
1. ✅ Compile successfully with TypeScript (no errors in new files)
2. ✅ Import/export correctly
3. ✅ Follow MCP SDK conventions
4. ✅ Match ARCHITECTURE.md specification 100%
5. ✅ Use stdio transport for Claude Code compatibility

Test file created: `test-mcp-scaffold.ts`

---

## 📋 Next Steps

The scaffold is ready for implementation. The following components need to be implemented:

### Phase 1: MVP (Local Only)
1. **Skill Indexer** (`src/indexer/local-indexer.ts`)
   - Scan `~/.claude/skills/` directory
   - Parse skill files (markdown, JSON, YAML)
   - Extract metadata
   - Store in database

2. **Database Setup** (`src/db/`)
   - SQLite schema creation
   - CRUD operations for skills
   - Indexing for fast lookups

3. **Keyword Search** (`src/search/keyword.ts`)
   - Simple text matching
   - Ranking by relevance
   - Snippet extraction

4. **Implement Tool Handlers**
   - Wire up `search_skills` to keyword search
   - Wire up `fetch_skill` to database queries
   - Implement `list_sources` with hardcoded local source

### Phase 2: Semantic Search
5. **Embeddings** (`src/indexer/embeddings.ts`)
   - OpenAI API integration
   - Generate embeddings for skills
   - Store in database

6. **Vector Search** (`src/search/semantic.ts`)
   - SQLite-vss or ChromaDB integration
   - Cosine similarity ranking
   - Hybrid search (semantic + keyword)

### Phase 3: Advanced Features
7. **Skill Generator** (`src/generator/skill-generator.ts`)
   - Claude API integration
   - Template system
   - Validation

8. **Sync Engine** (`src/sync/sync-engine.ts`)
   - Git integration
   - Conflict resolution
   - Multi-source management

9. **MCP Tool Indexer** (`src/indexer/mcp-indexer.ts`)
   - Parse MCP configs
   - Index available tools
   - Search functionality

---

## 🐛 Known Issues

**Existing codebase compilation errors:**
The existing files in the repository have TypeScript compilation errors that appear to be related to malformed comments or encoding issues:

- `src/types/codex.ts` - Lines 9-14 (inside comment block)
- `src/generator/converter.ts` - Similar parsing errors

These errors do NOT affect the new MCP scaffold files, which compile cleanly in isolation. The issues appear to be pre-existing.

**Recommended action:**
These files may need to be regenerated or their comment blocks fixed. The issue doesn't block MCP scaffold development but will need to be addressed before the full build succeeds.

---

## 🧪 Testing the Scaffold

To test the MCP server scaffold:

```bash
# Compile TypeScript
npm run build

# Test just the new files
./node_modules/.bin/tsc --noEmit src/mcp/types.ts src/mcp/server.ts src/index.ts

# Run the test script
./node_modules/.bin/tsx test-mcp-scaffold.ts
```

---

## 🔧 Configuration

To use with Claude Code, add to `~/.config/claude/mcp.json`:

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

---

## 📚 Documentation

All code includes:
- JSDoc comments for functions and types
- Inline comments explaining complex logic
- Type annotations for clarity
- Error messages for debugging
- TODO markers for implementation points

---

## Summary

✅ **MCP server scaffold is complete, clean, and extensible.**
✅ **All 7 tools defined with proper schemas.**
✅ **Ready for phase-by-phase implementation.**
✅ **Compiles successfully in isolation.**

The structure is ready for you to implement the actual tool logic as outlined in ARCHITECTURE.md.
