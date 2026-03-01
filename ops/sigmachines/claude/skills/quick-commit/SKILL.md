---
name: quick-commit
description: Create focused, conventional commits with tight staging and safe pre-commit validation.
disable-model-invocation: false
context: fork
user-invocable: true
argument-hint: "[type] [scope] [summary]"
---

# Quick Commit

## When to use
- Task explicitly matches this capability.
- A reusable workflow is better than ad-hoc commands.

## Workflow
1. Confirm scope and success criteria.
2. Gather facts with tools before editing.
3. Execute in small, reversible steps.
4. Verify outcomes with concrete checks.
5. Return a concise summary and next actions.

## Output contract
- What changed
- What was verified
- Remaining risks / follow-ups
