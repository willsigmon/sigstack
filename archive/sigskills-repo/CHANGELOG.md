# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Codex CLI Integration (2025-12-21)

**Full support for OpenAI Codex CLI skills with indexing, parsing, and bi-directional conversion.**

**New Files:**
- `src/indexer/codex-indexer.ts` (347 lines) - Codex skills indexer with recursive discovery, parsing, and file watching
- `src/generator/converter.ts` (378 lines) - Bi-directional format converter (Claude ↔ Codex)
- `src/types/codex.ts` (69 lines) - TypeScript type definitions for Codex skill format
- `src/indexer/test-codex.ts` - Test script for Codex indexer
- `src/generator/test-converter.ts` - Test script for format converter

**Documentation:**
- `docs/CODEX_INTEGRATION.md` (375 lines) - Comprehensive Codex integration guide
- `docs/CODEX_QUICK_START.md` (364 lines) - Quick start guide for Codex features
- `docs/FORMAT_COMPARISON.md` (327 lines) - Side-by-side format comparison reference

**Features:**

1. **Codex Skills Indexer** (`src/indexer/codex-indexer.ts`)
   - Auto-discover all `SKILL.md` files in `~/.codex/skills/` (recursive)
   - Parse YAML frontmatter and validate required fields
   - Analyze directory structure (detect `scripts/`, `references/` subdirectories)
   - Convert to universal `Skill` format for database storage
   - File watching for real-time updates
   - Statistics and analytics (total skills, by category, with resources)
   - Checksum-based change detection

2. **Format Converter** (`src/generator/converter.ts`)
   - Convert individual skills: `claudeToCodex()`, `codexToClaude()`
   - Batch directory conversion: `batchClaudeToCodex()`, `batchCodexToClaude()`
   - Universal format conversion: `skillToClaudeFormat()`, `skillToCodexFormat()`
   - Auto-detect format: `detectSkillFormat()`
   - Handle metadata normalization (truncation, sanitization)
   - Preserve conversion history with metadata comments
   - Create subdirectories for Codex skills
   - Map `allowed-tools` to body comments

3. **Type System** (`src/types/codex.ts`)
   - `CodexSkillFrontmatter` - YAML frontmatter structure
   - `CodexSkillMetadata` - Extended metadata fields
   - `CodexSkillFile` - Parsed skill representation
   - `CodexSkillDirectory` - Directory structure info
   - `CodexPaths` - Installation path types
   - Full TypeScript type safety

**Format Support:**

| Feature | Claude Code | Codex CLI |
|---------|-------------|-----------|
| File naming | `<name>.md` | `SKILL.md` |
| Location | `~/.claude/skills/` | `~/.codex/skills/` (recursive) |
| Runtime context | Full content | Name + description only |
| Name limit | None | 100 chars |
| Description limit | None | 500 chars |
| MCP tools | `allowed-tools` field | Not supported |
| Resources | Single file | `scripts/`, `references/` dirs |

**Testing:**
- Successfully tested with real Codex installation (`~/.codex/`)
- Indexed 1 production skill (`homey-self-hosted`)
- Validated frontmatter parsing and metadata extraction
- Verified directory structure analysis
- Confirmed format conversion (Claude ↔ Codex)
- All tests passing

**Updated Files:**
- `ARCHITECTURE.md` - Marked Codex integration complete in Phase 4
- `README.md` - Added Codex features, documentation links, testing instructions

**Statistics:**
- **Code:** 794 lines of TypeScript
- **Documentation:** 1,066 lines of Markdown
- **Test Coverage:** 2 test scripts with real-world validation

## [0.1.0] - 2025-12-21

### Added
- Initial project structure
- Architecture documentation
- Type definitions for skills, sources, metadata
- Database schema design
- MCP server scaffolding

[Unreleased]: https://github.com/wsig/sigskills/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/wsig/sigskills/releases/tag/v0.1.0
