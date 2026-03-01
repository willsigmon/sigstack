# Skill Format Comparison: Claude Code vs Codex CLI

Quick reference for understanding the differences between Claude Code and Codex CLI skill formats.

## Side-by-Side Comparison

### Claude Code Skill Example

**File:** `~/.claude/skills/git-commit.md`

```markdown
---
name: git-commit
description: Generate conventional commit messages and create Git commits
allowed-tools: Bash, Read, Grep
author: wsig
version: 1.0.0
tags: [git, commits, workflows]
category: Development
---

# Git Commit Skill

## Purpose
Helps create well-formatted conventional commits following best practices.

## Workflow
1. Run `git status` to see changes
2. Run `git diff` to understand modifications
3. Generate commit message following format: `type(scope): description`
4. Create commit with message

## Commit Types
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code restructuring
- test: Testing changes

## Examples
- `feat(auth): add OAuth2 login flow`
- `fix(api): handle null responses in user endpoint`
- `docs(readme): update installation instructions`
```

### Equivalent Codex CLI Skill

**File:** `~/.codex/skills/git-commit/SKILL.md`

```markdown
---
name: git-commit
description: Generate conventional commit messages and create Git commits
metadata:
  author: wsig
  version: 1.0.0
  tags: [git, commits, workflows]
  category: Development
---

# Git Commit Skill

## Purpose
Helps create well-formatted conventional commits following best practices.

## Workflow
1. Run `git status` to see changes
2. Run `git diff` to understand modifications
3. Generate commit message following format: `type(scope): description`
4. Create commit with message

## MCP Tools
Allowed tools: Bash, Read, Grep

## Commit Types
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code restructuring
- test: Testing changes

## Examples
- `feat(auth): add OAuth2 login flow`
- `fix(api): handle null responses in user endpoint`
- `docs(readme): update installation instructions`

## References
See references/conventional-commits.md for full specification.
```

**Additional files:**

```
~/.codex/skills/git-commit/
├── SKILL.md
├── references/
│   └── conventional-commits.md
└── scripts/
    └── validate-commit-msg.sh
```

## Format Specifications

### Claude Code Format

```yaml
# Frontmatter (YAML)
name: string                    # Required
description: string             # Required
allowed-tools: string           # Optional, comma-separated MCP tools
author: string                  # Optional
version: string                 # Optional
tags: array                     # Optional
category: string                # Optional
```

**Characteristics:**
- **File naming:** Flexible (`<name>.md`, `<name>-<variant>.md`)
- **Location:** `~/.claude/skills/` (flat directory)
- **Runtime:** Full content injected into prompt context
- **Size limit:** None (but affects token usage)
- **MCP tools:** Specified via `allowed-tools` field
- **Resources:** Single file only

### Codex CLI Format

```yaml
# Frontmatter (YAML)
name: string                    # Required, max 100 chars
description: string             # Required, max 500 chars
metadata:                       # Optional
  author: string
  version: string
  tags: array
  category: string
```

**Characteristics:**
- **File naming:** Must be exactly `SKILL.md`
- **Location:** `~/.codex/skills/` (recursive subdirectories)
- **Runtime:** Only name + description + path injected (body stays on disk)
- **Size limit:** Name 100 chars, description 500 chars
- **MCP tools:** Not supported (mention in body)
- **Resources:** Can have `scripts/` and `references/` directories

## Runtime Context Injection

### Claude Code

```
System prompt includes:
---
name: git-commit
description: Generate conventional commit messages...
allowed-tools: Bash, Read, Grep
...
---

# Git Commit Skill
## Purpose
[Full skill body injected here]
...
```

**Token impact:** Full skill content counts toward context window.

### Codex CLI

```
System prompt includes:
## Skills
- git-commit: Generate conventional commit messages... (file: /Users/you/.codex/skills/git-commit/SKILL.md)
```

**Token impact:** Only metadata (~50 tokens per skill). Body loaded on demand when referenced with `$git-commit`.

## Conversion Matrix

| Feature | Claude → Codex | Codex → Claude |
|---------|---------------|---------------|
| **Name** | Truncate to 100 chars | Direct copy |
| **Description** | Truncate to 500 chars | Direct copy |
| **allowed-tools** | Convert to body comment | Lost (manual extraction needed) |
| **Metadata** | Move to `metadata` field | Flatten to frontmatter |
| **Body** | Direct copy | Direct copy |
| **File structure** | Create `<name>/SKILL.md` | Create `<name>.md` |
| **scripts/** | Not copied (manual) | N/A |
| **references/** | Not copied (manual) | N/A |

## Decision Guide

### Choose Claude Code Format When:

1. Skills are small (<1KB)
2. You want full context in every prompt
3. You need MCP tool integration
4. You prefer simple, flat file organization
5. You're building simple, single-purpose skills

**Example use cases:**
- Quick git workflows
- Code review checklists
- Simple automation tasks
- One-off helper prompts

### Choose Codex CLI Format When:

1. Skills are large (>2KB)
2. You want to save context tokens
3. Skills need external scripts/references
4. You want nested organization
5. You're building a skill library

**Example use cases:**
- Complex deployment workflows with scripts
- Multi-step processes with reference docs
- Skills with platform-specific variations
- Skills that evolve over time

## Migration Strategies

### From Claude to Codex

**Simple approach:**
```bash
npx tsx -e "
import { claudeToCodex } from './src/generator/converter.js';
import * as fs from 'fs/promises';
const result = await claudeToCodex('~/.claude/skills/my-skill.md', { createSubdirectories: true });
const path = \`~/.codex/skills/\${result.subdirectory}/\${result.filename}\`;
await fs.mkdir(require('path').dirname(path), { recursive: true });
await fs.writeFile(path, result.content);
"
```

**Batch approach:**
```bash
npx tsx -e "
import { batchClaudeToCodex } from './src/generator/converter.js';
await batchClaudeToCodex('~/.claude/skills', '~/.codex/skills');
"
```

### From Codex to Claude

**Simple approach:**
```bash
npx tsx -e "
import { codexToClaude } from './src/generator/converter.js';
import * as fs from 'fs/promises';
const result = await codexToClaude('~/.codex/skills/my-skill/SKILL.md');
await fs.writeFile(\`~/.claude/skills/\${result.filename}\`, result.content);
"
```

**Batch approach:**
```bash
npx tsx -e "
import { batchCodexToClaude } from './src/generator/converter.js';
await batchCodexToClaude('~/.codex/skills', '~/.claude/skills');
"
```

## Best Practices

### For Claude Code Skills

1. **Keep it concise:** Every char counts toward context
2. **Use allowed-tools:** Specify MCP capabilities
3. **Flat structure:** One file per skill
4. **Descriptive names:** `git-commit.md`, not `commit.md`

### For Codex CLI Skills

1. **Use subdirectories:** Organize related skills
2. **Add references:** Use `references/` for docs
3. **Include scripts:** Use `scripts/` for automation
4. **Short descriptions:** Max 500 chars (will be truncated)
5. **Name skills clearly:** Name is the primary reference point

### Cross-Format Skills

If you want to maintain skills in both formats:

1. **Source of truth:** Pick one format as canonical
2. **Auto-convert:** Use SigSkills converter in CI/CD
3. **Sync regularly:** Keep both in sync via `sync_skills` MCP tool
4. **Test both:** Verify skills work in both ecosystems

## Common Pitfalls

### Claude → Codex

- **Missing resources:** Scripts and references must be manually migrated
- **Token savings lost:** If you don't reference skills with `$skill-name`
- **Description truncation:** Long descriptions silently truncated

### Codex → Claude

- **Context explosion:** Large skills now fully injected (high token cost)
- **Lost references:** External docs not copied
- **No MCP tools:** `allowed-tools` not preserved

## Tools

```bash
# Detect format
npx tsx -e "
import { detectSkillFormat } from './src/generator/converter.js';
console.log(await detectSkillFormat('./path/to/skill.md'));
"

# Convert single skill
npx tsx src/generator/test-converter.ts

# Batch convert directory
npx tsx -e "
import { batchClaudeToCodex } from './src/generator/converter.js';
await batchClaudeToCodex('./source', './target');
"
```

---

**See also:**
- [Codex Integration Guide](./CODEX_INTEGRATION.md)
- [Architecture Overview](../ARCHITECTURE.md)
