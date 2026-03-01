---
name: n8n-ops
description: Operate n8n environments: health checks, workflow diagnostics, and incident response.
disable-model-invocation: false
context: fork
user-invocable: true
argument-hint: "[health|debug|deploy] [workflow-id]"
---

# N8N Ops

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
