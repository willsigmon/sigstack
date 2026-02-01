---
name: Task Decomposition
description: Break big tasks into small, actionable steps
allowed-tools: Read, Bash, TaskCreate
model: sonnet
---

# Task Decomposition

Big task → Small wins.

## Why Decompose

```
Big task: "Build auth system"
→ Overwhelming
→ Hard to estimate
→ Easy to stall

Decomposed: 8 small tasks
→ Each takes 15-30 min
→ Clear progress
→ Momentum builds
```

## Decomposition Patterns

### Feature Breakdown
```
"Add login feature"

→ 1. Create LoginView UI
→ 2. Add form validation
→ 3. Create AuthService
→ 4. Add API integration
→ 5. Handle errors
→ 6. Add loading states
→ 7. Write tests
→ 8. Update navigation
```

### Bug Fix Breakdown
```
"Fix login crash"

→ 1. Reproduce the bug
→ 2. Find the crash point
→ 3. Understand root cause
→ 4. Write failing test
→ 5. Implement fix
→ 6. Verify test passes
→ 7. Check edge cases
```

### Refactor Breakdown
```
"Refactor UserService"

→ 1. Document current behavior
→ 2. Write tests for current state
→ 3. Extract protocol
→ 4. Create new implementation
→ 5. Switch over
→ 6. Remove old code
→ 7. Update callers
```

## Size Guidelines

### Ideal Task Size
```
15-30 minutes each
Clear done state
One responsibility
Independently testable
```

### Too Big
```
"Build the app" → Multiple features
"Fix all bugs" → Many issues
"Refactor everything" → Multiple systems
```

### Too Small
```
"Add semicolon" → Too trivial
"Rename variable" → Part of larger task
```

## Quick Decomposition

### Ask Claude
```
"Break down: [big task]"

Claude returns:
1. First step
2. Second step
...
n. Final step
```

### Template
```
"For [task], break into:
- Setup steps
- Core implementation
- Error handling
- Testing
- Cleanup"
```

## Tracking Decomposed Tasks

### Mental (Solo, Short)
```
Work through list in order.
Cross off in your head.
Good for: 2-4 hour sessions.
```

### TodoWrite (Multi-Session)
```
Claude's task tracking:
- Creates tasks
- Marks progress
- Persists across messages
```

### External (Long-Term)
```
GitHub Issues, Linear, etc.
For: Team visibility, backlog
```

## Execution Patterns

### Sequential
```
When: Dependencies between steps
1 → 2 → 3 → 4

"First create the model,
then the view that uses it."
```

### Parallel (Agents)
```
When: Independent steps
[1, 2, 3] → [4] → [5, 6]

"Spawn agents for each module review"
```

### Priority-Based
```
When: Not everything needed
Do: High impact first

"Which of these will unblock other work?"
```

## Handling Blockers

### Discovered Dependency
```
"Step 3 needs API that doesn't exist"

Options:
1. Mock it, continue (parallel work)
2. Do API first (reorder)
3. Skip, come back (defer)
```

### Scope Creep
```
"Step 2 is much bigger than expected"

Options:
1. Decompose further
2. Simplify approach
3. Split into phases
```

### Unknown Unknown
```
"Not sure how to do step 4"

Options:
1. Research spike (time-boxed)
2. Ask Claude to explain
3. Find example to follow
```

## Anti-Patterns

### Don't
```
❌ Start without decomposing
❌ Make tasks too vague
❌ Skip the hard tasks
❌ Ignore blockers
```

### Do
```
✓ Decompose before starting
✓ Clear "done" criteria
✓ Do hardest early
✓ Surface blockers fast
```

## Quick Commands

```
"Break down: [task]" → Get task list
"What's blocking?" → Identify blockers
"Simplify: [complex task]" → Reduce scope
"Parallelize: [task list]" → Find parallel opportunities
```

Use when: Starting new features, facing complex tasks, feeling stuck
