# Codex CLI Integration - Quick Start

## TL;DR

SigSkills now supports Codex CLI skills with full indexing, searching, and bi-directional conversion.

```bash
# Test it works
npx tsx src/indexer/test-codex.ts

# Convert your skills
npx tsx src/generator/test-converter.ts
```

## What's New

### 1. Codex Skills Indexer (`src/indexer/codex-indexer.ts`)

Discovers and indexes all `SKILL.md` files in `~/.codex/skills/`:

```typescript
import { indexCodexSkills } from './src/indexer/codex-indexer.js';

await indexCodexSkills(
  async (skill) => {
    // skill is in universal format
    console.log(skill.name, skill.source.type); // "my-skill", "codex"
  }
);
```

**Features:**
- Recursive discovery of `SKILL.md` files
- Validates frontmatter (name, description)
- Analyzes directory structure (scripts/, references/)
- Converts to universal Skill format
- File watching for real-time updates
- Statistics and analytics

### 2. Format Converter (`src/generator/converter.ts`)

Bi-directional conversion between Claude Code and Codex CLI formats:

```typescript
import { claudeToCodex, codexToClaude } from './src/generator/converter.js';

// Claude → Codex
const result = await claudeToCodex('~/.claude/skills/git-commit.md', {
  createSubdirectories: true, // Creates git-commit/SKILL.md
  includeMetadata: true,      // Adds conversion comment
});

// Codex → Claude
const result = await codexToClaude('~/.codex/skills/git-commit/SKILL.md', {
  includeMetadata: true, // Preserves source info
});
```

**Handles:**
- Frontmatter normalization (truncation, sanitization)
- Metadata mapping (author, version, tags, category)
- `allowed-tools` → body comment conversion
- Batch directory conversion
- Format detection

### 3. Type Definitions (`src/types/codex.ts`)

TypeScript types for Codex skill format:

```typescript
interface CodexSkillFrontmatter {
  name: string;        // Max 100 chars
  description: string; // Max 500 chars
  metadata?: {
    author?: string;
    version?: string;
    tags?: string[];
    category?: string;
  };
}
```

## Examples

### Index Your Codex Skills

```bash
$ npx tsx src/indexer/test-codex.ts

=== Codex Skills Indexer Test ===

1. Checking Codex installation...
   Codex installed: true

2. Codex paths:
   Home: /Users/wsig/.codex
   Skills: /Users/wsig/.codex/skills

3. Finding SKILL.md files...
   Found 4 skills

4. Parsing skills:
   plan
   - Description: Generate a plan for a complex task
   - Has scripts: true
   - Has references: false

   homey-self-hosted
   - Description: Install, configure, update Homey...
   - Has scripts: false
   - Has references: true

5. Skill statistics:
   Total skills: 4
   With scripts: 1
   With references: 2
```

### Convert Between Formats

```bash
$ npx tsx src/generator/test-converter.ts

=== Format Converter Test ===

1. Testing Codex → Claude conversion...
   Detected format: codex
   Output filename: homey-self-hosted.md

2. Testing universal Skill → formats...
   Claude format preview:
   ---
   name: homey-self-hosted
   description: Install, configure, update...
   ---
   # Homey Self-Hosted Server
   ...

   Codex format preview:
   ---
   name: homey-self-hosted
   description: Install, configure, update...
   ---
   # Homey Self-Hosted Server
   ...
```

### Batch Convert Directory

```typescript
import { batchClaudeToCodex } from './src/generator/converter.js';

// Convert all Claude skills to Codex format
await batchClaudeToCodex(
  '~/.claude/skills',
  '~/.codex/skills',
  { createSubdirectories: true }
);

// Output:
// Converted: git-commit.md → ~/.codex/skills/git-commit/SKILL.md
// Converted: review-pr.md → ~/.codex/skills/review-pr/SKILL.md
```

## Use Cases

### 1. Migrate Skills Between Ecosystems

You started with Claude Code but want to use Codex CLI (or vice versa):

```bash
# Backup first
cp -r ~/.claude/skills ~/.claude/skills.backup

# Convert all skills
npx tsx -e "
import { batchClaudeToCodex } from './src/generator/converter.js';
await batchClaudeToCodex('~/.claude/skills', '~/.codex/skills', {
  createSubdirectories: true,
  includeMetadata: true,
});
"
```

### 2. Maintain Skills in Both Formats

Keep skills in sync across both Claude Code and Codex CLI:

```typescript
// In your CI/CD or cron job
import { indexCodexSkills } from './src/indexer/codex-indexer.js';
import { skillToClaudeFormat } from './src/generator/converter.js';
import * as fs from 'fs/promises';

// Index Codex skills
await indexCodexSkills(async (skill) => {
  // Auto-generate Claude version
  const claudeContent = skillToClaudeFormat(skill);
  const filename = `${skill.name}.md`;

  await fs.writeFile(
    `~/.claude/skills/${filename}`,
    claudeContent
  );
});
```

### 3. Search Across Both Ecosystems

Use SigSkills MCP server to search all skills:

```typescript
// This will work once MCP server is implemented
await mcp.search_skills({
  query: "git workflow",
  source: "all", // Searches both Claude and Codex
  format: "claude", // Results in Claude format
});
```

## Format Differences to Know

| What | Claude | Codex |
|------|--------|-------|
| **File name** | `git-commit.md` | `SKILL.md` |
| **Location** | `~/.claude/skills/` | `~/.codex/skills/git-commit/` |
| **Runtime** | Full body in context | Only name + description |
| **MCP tools** | `allowed-tools: Bash, Read` | Not supported |
| **Resources** | Single file | Can have `scripts/`, `references/` |

**Key implication:** Codex skills save context tokens but lose immediate discoverability.

## API Reference

### Indexer Functions

```typescript
// Check if Codex is installed
const installed = await isCodexInstalled();

// Get Codex paths
const paths = getCodexPaths(); // { home, skills, config, plans }

// Find all SKILL.md files
const skillPaths = await findCodexSkills('~/.codex/skills');

// Parse single skill
const skill = await parseCodexSkill(skillPath, skillsDir);

// Analyze directory
const dirInfo = await analyzeSkillDirectory(skillPath);

// Convert to universal format
const universalSkill = codexToSkill(codexSkill);

// Watch for changes
const watcher = watchCodexSkills((path, event) => {
  console.log(event, path); // 'add' | 'change' | 'unlink'
});
watcher?.close();

// Get stats
const stats = await getCodexSkillStats();
```

### Converter Functions

```typescript
// Single file conversion
await claudeToCodex(filePath, options);
await codexToClaude(filePath, options);

// Batch conversion
await batchClaudeToCodex(sourceDir, targetDir, options);
await batchCodexToClaude(sourceDir, targetDir, options);

// Universal format
skillToClaudeFormat(skill);
skillToCodexFormat(skill);

// Format detection
const format = await detectSkillFormat(filePath); // 'claude' | 'codex' | 'unknown'
```

### Options

```typescript
interface ConversionOptions {
  preserveFormatting?: boolean;     // Keep original formatting
  includeMetadata?: boolean;        // Add conversion comments
  outputDir?: string;               // Target directory
  createSubdirectories?: boolean;   // Create skill-name/ dirs
}
```

## Next Steps

1. **MCP Server Integration**: Wire indexer into MCP server
2. **Database Schema**: Add Codex skills to SQLite database
3. **Search Implementation**: Enable searching across both formats
4. **Auto-Sync**: Watch both directories and keep in sync
5. **Conflict Resolution**: Handle when same skill exists in both

## Troubleshooting

**Codex not found:**
```bash
# Check installation
ls -la ~/.codex/

# Set custom path
export CODEX_HOME=/path/to/codex
```

**Skills not indexed:**
```bash
# Must be named exactly SKILL.md
find ~/.codex/skills -name "*.md" -type f

# Valid:   ~/.codex/skills/my-skill/SKILL.md
# Invalid: ~/.codex/skills/my-skill/skill.md
```

**Conversion errors:**
```typescript
// Descriptions >500 chars are truncated for Codex
const desc = skill.description.slice(0, 500);

// Undefined metadata causes YAML errors
// Fixed: Only add fields that exist
```

## Documentation

- [Full Codex Integration Guide](./CODEX_INTEGRATION.md) - Comprehensive documentation
- [Format Comparison](./FORMAT_COMPARISON.md) - Side-by-side format reference
- [Architecture](../ARCHITECTURE.md) - System design overview

## Files Created

```
src/
├── indexer/
│   ├── codex-indexer.ts         # Main indexer (300+ lines)
│   └── test-codex.ts            # Test script
├── generator/
│   ├── converter.ts             # Format converter (400+ lines)
│   └── test-converter.ts        # Test script
├── types/
│   └── codex.ts                 # TypeScript definitions
docs/
├── CODEX_INTEGRATION.md         # Full integration guide
├── FORMAT_COMPARISON.md         # Format reference
└── CODEX_QUICK_START.md         # This file
```

---

**Ready to use!** Run the test scripts to verify everything works with your Codex installation.

```bash
npx tsx src/indexer/test-codex.ts
npx tsx src/generator/test-converter.ts
```
