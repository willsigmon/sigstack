# Codex CLI Integration

This document describes the Codex CLI skills integration in SigSkills, including format differences, bi-directional conversion, and usage patterns.

## Overview

SigSkills provides seamless integration with OpenAI's Codex CLI, allowing you to:

- Index Codex skills alongside Claude Code skills
- Search across both skill ecosystems
- Convert skills between formats (Claude ↔ Codex)
- Sync skills bi-directionally
- Maintain a unified skill database

## Codex CLI Skill Format

### File Structure

Codex skills follow a strict format:

```
~/.codex/skills/
├── skill-name/              # Optional: skills can be in subdirectories
│   ├── SKILL.md            # Required: must be named exactly "SKILL.md"
│   ├── scripts/            # Optional: executable scripts
│   │   └── helper.py
│   └── references/         # Optional: reference documentation
│       └── api-docs.md
└── another-skill/
    └── SKILL.md
```

**Key points:**
- File MUST be named exactly `SKILL.md` (case-sensitive)
- Skills can be nested in subdirectories (recursive discovery)
- Hidden directories (starting with `.`) are ignored
- Supports `scripts/` and `references/` subdirectories for additional resources

### SKILL.md Format

```markdown
---
name: skill-name
description: Brief description of what the skill does (max 500 chars)
metadata:                    # Optional, non-standard extension
  author: Your Name
  version: 1.0.0
  tags: [category1, category2]
  category: Development
---

# Skill Body

Full skill instructions go here. This content stays on disk and is
only loaded when the skill is explicitly referenced.

## References
- See references/api-docs.md for API details
- Run scripts/helper.py for setup

## Usage
Reference this skill with $skill-name in Codex prompts.
```

**Frontmatter fields:**
- `name` (required): Max 100 chars, sanitized to single line
- `description` (required): Max 500 chars, sanitized to single line
- `metadata` (optional): Extended metadata (non-standard, observed in practice)

### Runtime Behavior

Unlike Claude Code, Codex only injects minimal context:

```
## Skills
- skill-name: Brief description (file: /absolute/path/to/SKILL.md)
```

The skill body remains on disk and is only loaded when referenced with `$skill-name`.

## Format Differences: Claude vs Codex

| Aspect | Claude Code | Codex CLI |
|--------|-------------|-----------|
| **File naming** | `<skill-name>.md` (flexible) | `SKILL.md` (strict) |
| **Location** | `~/.claude/skills/` (flat) | `~/.codex/skills/` (recursive) |
| **Runtime context** | Full content injected | Only name + description + path |
| **Frontmatter** | name, description, allowed-tools, author, version, tags, category | name (max 100), description (max 500), optional metadata |
| **MCP integration** | `allowed-tools` field | Not supported |
| **Resources** | Single file | Can have `scripts/` and `references/` directories |
| **Reference syntax** | N/A | `$<skill-name>` |
| **File structure** | Flat directory | Nested subdirectories supported |

### Key Implications

1. **Context size**: Codex skills are more context-efficient (only metadata in prompt)
2. **Complexity**: Codex skills can include scripts and reference docs
3. **Discoverability**: Claude skills are always visible; Codex skills are lazy-loaded
4. **MCP tools**: Claude skills can specify allowed MCP tools; Codex cannot

## Using the Codex Indexer

### Basic Indexing

```typescript
import { indexCodexSkills } from './src/indexer/codex-indexer.js';

// Index all Codex skills
const result = await indexCodexSkills(
  async (skill) => {
    // Save to database
    await db.insertSkill(skill);
  },
  (current, total, name) => {
    console.log(`Indexing ${current}/${total}: ${name}`);
  }
);

console.log(`Indexed: ${result.indexed}, Errors: ${result.errors}`);
```

### Watching for Changes

```typescript
import { watchCodexSkills } from './src/indexer/codex-indexer.js';

const watcher = watchCodexSkills((skillPath, event) => {
  console.log(`${event}: ${skillPath}`);

  if (event === 'add' || event === 'change') {
    // Re-index skill
  } else if (event === 'unlink') {
    // Remove from database
  }
});

// Stop watching
watcher?.close();
```

### Getting Stats

```typescript
import { getCodexSkillStats } from './src/indexer/codex-indexer.js';

const stats = await getCodexSkillStats();
console.log(`Total: ${stats.total}`);
console.log(`With scripts: ${stats.withScripts}`);
console.log(`With references: ${stats.withReferences}`);
console.log('By category:', stats.byCategory);
```

## Format Conversion

### Converting Individual Skills

#### Codex → Claude

```typescript
import { codexToClaude } from './src/generator/converter.js';

const result = await codexToClaude(
  '/Users/you/.codex/skills/my-skill/SKILL.md',
  {
    includeMetadata: true, // Add conversion comment
  }
);

console.log(`Filename: ${result.filename}`); // "my-skill.md"
console.log(`Content:\n${result.content}`);

// Save to Claude skills directory
await fs.writeFile(
  `~/.claude/skills/${result.filename}`,
  result.content
);
```

#### Claude → Codex

```typescript
import { claudeToCodex } from './src/generator/converter.js';

const result = await claudeToCodex(
  '/Users/you/.claude/skills/my-skill.md',
  {
    createSubdirectories: true, // Create skill-name/ directory
    includeMetadata: true,
  }
);

console.log(`Subdirectory: ${result.subdirectory}`); // "my-skill"
console.log(`Filename: ${result.filename}`); // "SKILL.md"

// Save to Codex skills directory
const targetPath = path.join(
  '~/.codex/skills',
  result.subdirectory,
  result.filename
);
await fs.mkdir(path.dirname(targetPath), { recursive: true });
await fs.writeFile(targetPath, result.content);
```

### Batch Conversion

#### Entire Claude skills directory → Codex

```typescript
import { batchClaudeToCodex } from './src/generator/converter.js';

const result = await batchClaudeToCodex(
  '~/.claude/skills',
  '~/.codex/skills',
  {
    createSubdirectories: true,
    includeMetadata: true,
  }
);

console.log(`Converted: ${result.converted}, Errors: ${result.errors}`);
```

#### Entire Codex skills directory → Claude

```typescript
import { batchCodexToClaude } from './src/generator/converter.js';

const result = await batchCodexToClaude(
  '~/.codex/skills',
  '~/.claude/skills',
  {
    includeMetadata: true,
  }
);

console.log(`Converted: ${result.converted}, Errors: ${result.errors}`);
```

### Universal Format Conversion

```typescript
import { skillToClaudeFormat, skillToCodexFormat } from './src/generator/converter.js';

// From universal Skill object
const claudeContent = skillToClaudeFormat(skill);
const codexContent = skillToCodexFormat(skill);

// Save to respective formats
await fs.writeFile(`~/.claude/skills/${skill.name}.md`, claudeContent);
await fs.writeFile(`~/.codex/skills/${skill.name}/SKILL.md`, codexContent);
```

## Conversion Guidelines

### When to Use Each Format

**Use Claude Code format when:**
- You want the full skill content in the prompt context
- The skill is simple and doesn't need external resources
- You need MCP tool integration (`allowed-tools`)
- You prefer flat file structure

**Use Codex CLI format when:**
- Skills are large (>1KB) and you want to save context
- Skills need external scripts or reference documentation
- You want to organize skills in nested directories
- You're building a skill library with complex dependencies

### Conversion Caveats

**Claude → Codex:**
- `allowed-tools` field is converted to a comment in the body
- Description is truncated to 500 chars if longer
- Name is truncated to 100 chars if longer
- Creates subdirectory named after skill (kebab-case)

**Codex → Claude:**
- `scripts/` and `references/` directories are NOT copied
- You'll need to manually handle external dependencies
- Skill body becomes part of the prompt context (increases token usage)
- Subdirectory name is lost (filename becomes skill-name.md)

## Integration with SigSkills MCP Server

The MCP server automatically indexes both Claude and Codex skills:

```json
{
  "mcpServers": {
    "sigskills": {
      "command": "node",
      "args": ["/path/to/sigskills/dist/index.js"]
    }
  }
}
```

### MCP Tool Usage

```typescript
// Search across both ecosystems
const results = await mcp.search_skills({
  query: "git workflow",
  source: "all", // or "codex" for Codex-only
  format: "both",
});

// Fetch skill (auto-converts to requested format)
const skill = await mcp.fetch_skill({
  skill_id: "codex:2044fbf53110d76b",
  format: "claude", // Convert Codex skill to Claude format
});

// Sync between formats
await mcp.sync_skills({
  source: "codex",
  direction: "pull",
  strategy: "merge",
});
```

## Testing

Run the test scripts to verify integration:

```bash
# Test Codex indexer
npx tsx src/indexer/test-codex.ts

# Test format converter
npx tsx src/generator/test-converter.ts
```

## Troubleshooting

### Codex Not Found

If Codex is not installed:
- Install Codex CLI: https://developers.openai.com/codex/cli
- Set `CODEX_HOME` environment variable if using custom location
- Skills directory defaults to `~/.codex/skills/`

### Skills Not Indexed

- Ensure files are named exactly `SKILL.md` (case-sensitive)
- Check that skills are not in hidden directories (starting with `.`)
- Verify frontmatter has required `name` and `description` fields
- Run `npx tsx src/indexer/test-codex.ts` for diagnostics

### Conversion Errors

- Long descriptions (>500 chars) are truncated for Codex format
- Undefined metadata fields cause YAML errors (now fixed)
- External resources (`scripts/`, `references/`) must be manually migrated

## Future Enhancements

- [ ] Auto-sync scripts and references during conversion
- [ ] Preserve allowed-tools in Codex metadata
- [ ] Bidirectional MCP tool mapping
- [ ] Skill dependency graph across formats
- [ ] Merge conflicts resolution UI
- [ ] Format-agnostic skill templates

## References

- [Codex CLI Skills Documentation](https://github.com/openai/codex/blob/main/docs/skills.md)
- [Claude Code Skills Format](https://github.com/anthropics/claude-code/docs/skills.md)
- [SigSkills Architecture](../ARCHITECTURE.md)

---

**Last Updated:** 2025-12-21
**Version:** 1.0.0
