# AGENTS.md Adoption Guide - BRAIN Network

> **Created:** 2026-01-13 | **Status:** Active | **Standard:** agents.md v1.0

## Overview

AGENTS.md is the **de facto open standard** for AI coding assistant context, adopted by 20,000+ repositories and supported by:
- Google Gemini (Android Studio)
- GitHub Copilot
- OpenAI Codex
- Cursor
- Amp, Windsurf, Zed, RooCode

**Claude Code does NOT natively support AGENTS.md** (see [issue #6235](https://github.com/anthropics/claude-code/issues/6235) with 1,800+ upvotes).

## Adoption Strategy

### Dual-File Approach (Recommended)

```
project/
├── AGENTS.md          # Cross-tool standard (source of truth)
├── CLAUDE.md          # Claude Code: imports AGENTS.md
└── .claude/
    └── settings.json  # Claude-specific advanced features
```

**CLAUDE.md imports AGENTS.md:**
```markdown
# Claude Code Context

@AGENTS.md

## Claude-Specific Extensions
<!-- Advanced features not in AGENTS.md standard -->
```

### Alternative: Symlink

```bash
ln -s AGENTS.md CLAUDE.md
```

**Pros:** Zero duplication
**Cons:** Can't add Claude-specific extensions

## AGENTS.md Best Practices

From [GitHub's analysis of 2,500+ repos](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/):

### Structure (6 Core Sections)

1. **Commands** - Executable tools with flags
2. **Testing** - How to run/write tests
3. **Structure** - File organization
4. **Style** - Code conventions with examples
5. **Workflow** - Development process
6. **Boundaries** - Three tiers (Always/Ask First/Never)

### Length

- **Target:** 200-400 words
- **Max:** 150 lines (context window efficiency)
- **Principle:** One real code snippet > three paragraphs

### Three-Tier Boundaries

```markdown
## Boundaries

### Always Do
- Run `swift build` before committing
- Use SwiftFormat on changed files
- Add unit tests for new public APIs

### Ask First
- Modifying Package.swift dependencies
- Changing public API signatures
- Deleting files

### Never Do
- Force push to main
- Skip tests with --skip-tests
- Commit secrets or API keys
```

## Templates

### Universal Template

```markdown
# Project Name

## Overview
[One-sentence project description]

## Tech Stack
- [Language/Framework] [version]
- [Key dependencies]

## Commands
| Action | Command |
|--------|---------|
| Build | `[build command]` |
| Test | `[test command]` |
| Lint | `[lint command]` |
| Format | `[format command]` |

## File Structure
```
src/
├── [key directories explained]
```

## Code Style
[Specific conventions with examples]

## Boundaries

### Always Do
- [Required behaviors]

### Ask First
- [Needs approval]

### Never Do
- [Forbidden actions]
```

### iOS/SwiftUI Template

See `agents-md-ios-template.md` in this directory.

## BRAIN Network Integration

### Sync Pattern

```bash
# In dotfiles-hub/claude/rules/
agents-md-adoption.md       # This guide
agents-md-ios-template.md   # iOS/SwiftUI template
```

### Per-Project Files

Each project gets its own AGENTS.md based on templates:

```bash
# Create for new project
cp ~/dotfiles-hub/claude/rules/agents-md-ios-template.md ./AGENTS.md
# Edit for project specifics
```

### Claude Code Bridge

Create minimal CLAUDE.md in each project:

```markdown
@AGENTS.md

## Claude Extensions

<!-- Project-specific Claude features -->
<!-- Skills, hooks, MCP config references -->
```

## Cross-Tool Compatibility Matrix

| Feature | AGENTS.md | CLAUDE.md |
|---------|-----------|-----------|
| Gemini | ✅ Native | ❌ |
| GitHub Copilot | ✅ Native | ❌ |
| Cursor | ✅ Native | ❌ |
| Claude Code | ❌ (via import) | ✅ Native |
| Codex | ✅ Native | ❌ |

## Migration Checklist

- [ ] Create AGENTS.md from template
- [ ] Create CLAUDE.md with `@AGENTS.md` import
- [ ] Test with Claude Code session
- [ ] Commit both to version control
- [ ] Document in project README

---

**Sources:**
- [AGENTS.md Spec](https://agents.md/)
- [GitHub Best Practices](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Android Studio Agent Files](https://developer.android.com/studio/gemini/agent-files)
- [Claude Code Issue #6235](https://github.com/anthropics/claude-code/issues/6235)
