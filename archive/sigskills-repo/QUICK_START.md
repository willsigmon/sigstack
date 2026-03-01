# Skill Generator - Quick Start Guide

## Installation

```bash
cd ~/Projects/sigskills
npm install
```

## Setup

Set your Anthropic API key:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

## Basic Usage

### 1. Generate a Skill

```typescript
import { createSkillGenerator } from './src/generator';

const generator = createSkillGenerator();

const result = await generator.generateSkill({
  prompt: 'Create a skill that helps debug SwiftUI view lifecycle issues',
  template: 'debug',  // Options: 'base', 'git', 'code-review', 'debug'
  format: 'claude',   // Options: 'claude', 'codex', 'universal'
  save: true,         // Auto-save to ~/.claude/skills/
});

console.log(`Generated: ${result.skill.name}`);
console.log(`Saved to: ${result.saved_path}`);
```

### 2. Convert Formats

```typescript
import { claudeToCodex, codexToClaude } from './src/generator';

// Claude → Codex
const codexSkill = await claudeToCodex('~/.claude/skills/my-skill.md', {
  createSubdirectories: true,
});

// Codex → Claude
const claudeSkill = await codexToClaude('~/.codex/skills/my-skill/SKILL.md');
```

### 3. Validate a Skill

```typescript
import { validateSkillContent } from './src/utils/validator';

const validation = validateSkillContent(skillContent);

if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
```

## Run Examples

```bash
tsx src/generator/example.ts
```

## Available Templates

1. **base** - Generic skill template
2. **git** - Git operations and workflows
3. **code-review** - Code review checklist
4. **debug** - Debugging processes and tools

## Common Tasks

### Generate Multiple Skills

```typescript
const requests = [
  { prompt: 'iOS debugging skill', template: 'debug' },
  { prompt: 'Git PR review skill', template: 'git' },
  { prompt: 'Code quality checker', template: 'code-review' },
];

const results = await generator.generateBatch(requests);
```

### Refine Existing Skill

```typescript
const refined = await generator.refineSkill(
  existingSkillContent,
  'Add section on performance profiling and memory analysis'
);
```

### Batch Convert Directory

```typescript
import { batchClaudeToCodex } from './src/generator';

const stats = await batchClaudeToCodex(
  '~/.claude/skills',
  '~/.codex/skills',
  { createSubdirectories: true }
);

console.log(`Converted ${stats.converted} skills, ${stats.errors} errors`);
```

## File Locations

- **Templates**: `/Users/wsig/Projects/sigskills/src/generator/templates/`
- **Generated Skills**: `~/.claude/skills/` (Claude format)
- **Converted Skills**: `~/.codex/skills/` (Codex format)

## Documentation

- **Full API**: `src/generator/README.md`
- **Examples**: `src/generator/example.ts`
- **Architecture**: `ARCHITECTURE.md`
- **Completion Summary**: `GENERATOR_COMPLETE.md`

## Troubleshooting

### "Invalid request" error
Check that your prompt is at least 10 characters long.

### "Template not found" error
Use one of: 'base', 'git', 'code-review', 'debug'

### Generated skill fails validation
Ensure the generated content has:
- At least 50 characters
- Markdown headings (`#`, `##`)
- Required frontmatter fields

## Next Steps

1. Generate your first skill with the example above
2. Check the output in `~/.claude/skills/`
3. Try converting between formats
4. Create custom templates in `src/generator/templates/`
5. Integrate with the MCP server

For more details, see `src/generator/README.md`
