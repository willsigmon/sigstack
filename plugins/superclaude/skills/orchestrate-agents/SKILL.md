---
name: Orchestrate Agents
description: Coordinate multi-agent workflows with handoffs and dependencies
allowed-tools: Task, TaskOutput, Read
model: sonnet
---

# Orchestrate Agents

**Complex workflows across multiple agents.**

## Orchestration Patterns

### Pipeline (Sequential)
```
Agent 1 → Agent 2 → Agent 3

Each depends on previous output.
Use for: Analysis → Design → Implementation
```

### Parallel + Merge
```
[Agent 1]
[Agent 2] → Merge → Final Agent
[Agent 3]

Independent work, combined results.
Use for: Multi-area search → Synthesis
```

### Supervisor
```
Supervisor Agent
    ├── Worker 1
    ├── Worker 2
    └── Worker 3

Supervisor delegates and collects.
Use for: Complex features
```

### Specialist Ensemble
```
Security Agent ─┐
Performance Agent ─┼── Decision Agent
Style Agent ─────┘

Multiple perspectives, one decision.
Use for: Code review, architecture
```

## Dependency Management

### Sequential Dependencies
```
Can't parallelize:
1. Create model
2. Create view using model
3. Create tests for view

Run in order. No agents.
```

### Parallel Independence
```
Can parallelize:
1. Search auth/
2. Search payment/
3. Search user/

No dependencies. Spawn all.
```

### Partial Dependencies
```
[A, B, C] → D → [E, F]

A, B, C parallel
D waits for all
E, F parallel after D
```

## Handoff Protocol

### Agent to Agent
```
Agent 1 completes:
"Found issue in auth.swift:142"

You relay to Agent 2:
"Fix the issue in auth.swift:142"

Context transferred explicitly.
```

### Agent to Main
```
Agent returns summary.
You decide next action.
Main conversation has full control.
```

### Background Check-In
```
run_in_background: true

Later:
TaskOutput to check status
Resume if needed
```

## Complex Workflow Example

### Feature Implementation
```
Phase 1 (Parallel):
- Design agent: Plan the feature
- Research agent: Find similar patterns

Phase 2 (After Phase 1):
- Implementation agent: Build it

Phase 3 (Parallel):
- Test agent: Write tests
- Docs agent: Write documentation

Phase 4:
- Review agent: Final check
```

### Bug Investigation
```
Phase 1 (Parallel):
- Reproduce agent: Confirm the bug
- Search agent: Find related code

Phase 2:
- Analysis agent: Root cause

Phase 3:
- Fix agent: Implement solution

Phase 4 (Parallel):
- Test agent: Verify fix
- Regression agent: Check side effects
```

## Coordination Commands

### Start Workflow
```
"Start [workflow] for [target]"

Spawns appropriate agents.
Tracks progress.
```

### Check Progress
```
"Status of [workflow]?"

Shows:
- Completed steps
- In progress
- Blocked
- Next steps
```

### Adjust Workflow
```
"Skip [step]"
"Add [step] before [step]"
"Retry [step]"
```

## Error Handling

### Agent Fails
```
Agent hits error →
Report to main →
Decide: retry, skip, or abort
```

### Dependency Blocked
```
Blocker identified →
Create workaround or
Escalate for decision
```

### Timeout
```
Background agent too long →
Check with TaskOutput →
Decide: wait, cancel, or resume
```

## Best Practices

### ✓ Do
```
- Clear handoff messages
- Explicit dependencies
- Background for long work
- Check-in periodically
- Handle errors gracefully
```

### ❌ Don't
```
- Implicit dependencies
- Fire and forget
- Over-orchestrate simple tasks
- Ignore failures
```

Use when: Multi-step features, complex investigations, coordinated work
