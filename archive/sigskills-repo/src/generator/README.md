# Skill Generator Module

AI-powered skill generation using Claude API with template support and format conversion.

## Features

- **AI Generation**: Generate skills from natural language prompts using Claude API
- **Template System**: Pre-built templates for common skill types (git, debug, code-review, etc.)
- **Format Conversion**: Seamless conversion between Claude Code and Codex CLI formats
- **Validation**: Zod-based schema validation for all skill formats
- **Batch Operations**: Generate or convert multiple skills at once
- **Skill Refinement**: Improve existing skills with AI suggestions

## Quick Start

```typescript
import { createSkillGenerator } from './generator';

const generator = createSkillGenerator();

// Generate a skill from a prompt
const result = await generator.generateSkill({
  prompt: 'Create a skill that helps debug iOS memory leaks',
  template: 'debug',
  format: 'claude',
  save: true,
});

console.log(result.skill.name);
console.log(result.saved_path);
```

## Templates

Available templates in `src/generator/templates/`:

- **base.md** - Generic skill template
- **git.md** - Git operations (commits, PRs, etc.)
- **code-review.md** - Code review workflows
- **debug.md** - Debugging processes

### Template Variables

Templates use Handlebars-style syntax:

```markdown
---
name: {{name}}
description: {{description}}
{{#if allowed_tools}}allowed-tools: {{allowed_tools}}{{/if}}
---

# {{name}}

{{#each guidelines}}
- {{this}}
{{/each}}
```

## Format Conversion

### Claude Code → Codex CLI

```typescript
import { claudeToCodex } from './generator';

const result = await claudeToCodex('~/.claude/skills/my-skill.md', {
  createSubdirectories: true,
  includeMetadata: true,
});

// result.content = Codex-formatted skill
// result.filename = 'SKILL.md'
// result.subdirectory = 'my-skill'
```

### Codex CLI → Claude Code

```typescript
import { codexToClaude } from './generator';

const result = await codexToClaude('~/.codex/skills/my-skill/SKILL.md');

// result.content = Claude-formatted skill
// result.filename = 'my-skill.md'
```

### Batch Conversion

```typescript
import { batchClaudeToCodex, batchCodexToClaude } from './generator';

// Convert all Claude skills to Codex format
const stats = await batchClaudeToCodex(
  '~/.claude/skills',
  '~/.codex/skills',
  { createSubdirectories: true }
);

console.log(`Converted: ${stats.converted}, Errors: ${stats.errors}`);
```

## API Reference

### SkillGenerator

```typescript
class SkillGenerator {
  constructor(apiKey?: string, model?: string)
  
  generateSkill(request: GenerateSkillRequest): Promise<GenerateSkillResult>
  generateBatch(requests: GenerateSkillRequest[]): Promise<GenerateSkillResult[]>
  refineSkill(skillContent: string, improvements: string): Promise<string>
  applyTemplate(template: SkillTemplate, data: Record<string, any>): string
}
```

### GenerateSkillRequest

```typescript
interface GenerateSkillRequest {
  prompt: string;           // Natural language description
  template?: SkillTemplate; // 'base' | 'git' | 'code-review' | 'debug' | 'ios' | 'api'
  format?: 'claude' | 'codex' | 'universal';
  name?: string;            // Suggested skill name
  save?: boolean;           // Auto-save to ~/.claude/skills/
  savePath?: string;        // Custom save path
  metadata?: Partial<SkillMetadata>;
}
```

### GenerateSkillResult

```typescript
interface GenerateSkillResult {
  skill: Skill;
  saved_path?: string;
  suggestions?: string[];
  template_used?: string;
}
```

## Environment Variables

```bash
ANTHROPIC_API_KEY=sk-ant-...  # Required for skill generation
```

## Examples

See `example.ts` for complete usage examples:

```bash
# Run examples
tsx src/generator/example.ts
```

## Validation

All generated skills are validated using Zod schemas:

```typescript
import { validateSkillContent, validateAllowedTools } from '../utils/validator';

const validation = validateSkillContent(content);
if (!validation.valid) {
  console.error(validation.errors);
}
```

## Format Differences

### Claude Code Format
- **File**: `<skill-name>.md`
- **Location**: `~/.claude/skills/`
- **Frontmatter**: `name`, `description`, `allowed-tools`, `author`, `version`, `tags`, `category`
- **Runtime**: Full content injected into prompt

### Codex CLI Format
- **File**: `SKILL.md` (must be exact)
- **Location**: `~/.codex/skills/**/` (recursive)
- **Frontmatter**: `name` (max 100 chars), `description` (max 500 chars), optional `metadata`
- **Runtime**: Only name + description injected, body fetched on demand

## Best Practices

1. **Use specific prompts**: "Create a skill for debugging iOS memory leaks with Instruments" beats "debugging skill"
2. **Choose the right template**: Saves tokens and provides better structure
3. **Validate before saving**: Check `validateSkillContent()` results
4. **Version your skills**: Include version in metadata for tracking changes
5. **Tag appropriately**: Makes skills discoverable via search

## Advanced Usage

### Custom Templates

Create your own templates in `src/generator/templates/`:

```markdown
---
name: {{name}}
description: {{description}}
---

# {{name}}

{{custom_section}}
```

Then use it:

```typescript
const data = {
  name: 'My Skill',
  description: 'Does something cool',
  custom_section: 'Custom content here',
};

const content = generator.applyTemplate('my-template', data);
```

### Skill Refinement Workflow

```typescript
// Generate initial skill
const result = await generator.generateSkill({ prompt: '...' });

// Get user feedback
const improvements = 'Add more examples and a troubleshooting section';

// Refine the skill
const refined = await generator.refineSkill(result.skill.content, improvements);

// Save refined version
fs.writeFileSync('~/.claude/skills/refined-skill.md', refined);
```

## Troubleshooting

### "Invalid request" error
- Check that your prompt is at least 10 characters
- Verify GenerateSkillRequest fields are correct

### "Template not found" error
- Template files must be in `src/generator/templates/`
- File name must match template name + `.md`

### Generated skill fails validation
- Check skill content has headings (`#`, `##`)
- Ensure content is at least 50 characters
- Verify frontmatter has required fields

## License

MIT
