---
name: {{name}}
description: {{description}}
allowed-tools: Bash, Read, Grep
{{#if author}}author: {{author}}{{/if}}
category: git
---

# {{name}}

{{description}}

## Git Operations

### Common Commands

```bash
# Check repository status
git status

# View changes
git diff
git diff --staged

# Stage changes
git add <file>
git add .

# Commit changes
git commit -m "message"

# Push to remote
git push origin <branch>

# Pull from remote
git pull origin <branch>
```

{{#if specific_operations}}
### Specific Operations

{{#each specific_operations}}
#### {{@key}}

{{this}}

{{/each}}
{{/if}}

## Best Practices

1. **Write clear commit messages**
   - Use conventional commit format: `type(scope): description`
   - Types: feat, fix, docs, style, refactor, test, chore
   - Keep first line under 50 characters
   - Add detailed body if needed

2. **Check before committing**
   ```bash
   git status
   git diff
   ```

3. **Avoid large commits**
   - Break work into logical chunks
   - Each commit should be a single unit of work

4. **Keep history clean**
   - Use `git rebase` for local history cleanup
   - Don't force push to shared branches

{{#if examples}}
## Examples

{{#each examples}}
### {{this.title}}

{{this.description}}

```bash
{{this.commands}}
```

{{/each}}
{{/if}}

## Safety Checks

- ❌ Never force push to main/master without explicit approval
- ❌ Never commit secrets or credentials
- ✅ Always review changes before committing
- ✅ Test code before pushing
- ✅ Keep commits atomic and focused

## When to Use

{{when_to_use}}
