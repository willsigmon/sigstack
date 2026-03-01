---
name: browser-automation
description: Use browser automation safely for repeatable flows, verification steps, and UI evidence capture.
disable-model-invocation: false
context: fork
user-invocable: true
argument-hint: "[site] [flow]"
---

# Browser Automation

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
