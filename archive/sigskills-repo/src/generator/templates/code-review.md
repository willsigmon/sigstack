---
name: {{name}}
description: {{description}}
allowed-tools: Read, Grep, Bash
{{#if author}}author: {{author}}{{/if}}
category: code-review
---

# {{name}}

{{description}}

## Review Checklist

### 1. Code Quality
- [ ] Code follows project style guide
- [ ] Variable and function names are descriptive
- [ ] No unnecessary complexity
- [ ] DRY principle applied (Don't Repeat Yourself)
- [ ] SOLID principles followed where applicable

### 2. Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] No obvious bugs or logic errors

### 3. Performance
- [ ] No unnecessary loops or operations
- [ ] Efficient algorithms used
- [ ] Database queries optimized
- [ ] No memory leaks

### 4. Security
- [ ] Input validation present
- [ ] No hardcoded secrets
- [ ] Authentication/authorization checked
- [ ] SQL injection prevention
- [ ] XSS prevention (if web app)

### 5. Testing
- [ ] Unit tests included
- [ ] Tests cover edge cases
- [ ] Tests are readable and maintainable
- [ ] Test coverage is adequate

### 6. Documentation
- [ ] Complex logic explained with comments
- [ ] Public API documented
- [ ] README updated if needed
- [ ] CHANGELOG updated

{{#if language_specific}}
## Language-Specific Checks

{{#each language_specific}}
### {{@key}}

{{this}}

{{/each}}
{{/if}}

## Review Process

1. **Understand the context**
   - Read the PR description
   - Understand what problem is being solved
   - Check related issues

2. **Review the code**
   ```bash
   # Check changed files
   git diff main...feature-branch

   # Look at specific files
   git show <commit>:<file>
   ```

3. **Test locally**
   - Checkout the branch
   - Run tests
   - Try to break it

4. **Provide feedback**
   - Be constructive
   - Explain the "why" behind suggestions
   - Acknowledge good work
   - Use conventional comments:
     - `nit:` - Minor suggestion
     - `question:` - Need clarification
     - `suggestion:` - Improvement idea
     - `issue:` - Must be fixed

## Common Issues to Look For

### Code Smells
- Long functions/methods (>50 lines)
- Too many parameters (>3-4)
- Deep nesting (>3 levels)
- Magic numbers
- Commented-out code
- TODO comments without tickets

### Anti-Patterns
- God objects
- Spaghetti code
- Premature optimization
- Copy-paste programming
- Not invented here syndrome

{{#if framework_specific}}
## Framework-Specific Checks

{{framework_specific}}

{{/if}}

## Example Review Comments

### Positive Feedback
```
✅ Great use of dependency injection here!
✅ I like how you broke this into smaller functions.
✅ Excellent test coverage on edge cases.
```

### Constructive Feedback
```
💡 suggestion: Consider extracting this logic into a separate function for reusability.
🤔 question: What happens if the API returns null here?
⚠️ issue: This could cause a memory leak - we're not cleaning up the listener.
```

## When to Use

{{when_to_use}}
