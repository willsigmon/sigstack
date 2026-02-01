---
name: Spawn Swarm
description: Spawn multiple agents in parallel for maximum throughput
allowed-tools: Task, Read, Bash
model: sonnet
---

# Spawn Swarm

**Parallel agents for parallel work.**

## The Pattern

```
Single message → Multiple Task calls → Parallel execution → Collected results
```

One message with 5-20 Task tool invocations.
All run simultaneously.
Results come back together.

## Swarm Templates

### Bug Hunt (5-10 agents)
```
"Find bugs across the codebase"

Spawn per module:
- auth-agent
- payment-agent
- user-agent
- api-agent
- data-agent
```

### PR Review (3-4 agents)
```
"Review PR #123"

Spawn specialists:
- security-reviewer
- performance-reviewer
- style-reviewer
- test-coverage-reviewer
```

### Feature Build (4 agents)
```
"Build [feature]"

Spawn workers:
- ui-agent
- logic-agent
- test-agent
- docs-agent
```

### Codebase Exploration (5 agents)
```
"Understand how [thing] works"

Spawn explorers:
- entry-point-finder
- flow-tracer
- dependency-mapper
- pattern-identifier
- edge-case-hunter
```

## Invocation

### Single Message, Multiple Tasks
```
[Task: Search auth/ for security issues]
[Task: Search payment/ for security issues]
[Task: Search api/ for security issues]
[Task: Search data/ for security issues]
[Task: Search user/ for security issues]
```

All in ONE message.

### Use run_in_background
```
For long-running work:
run_in_background: true

Continue other work.
Check results with TaskOutput later.
```

## Agent Types

### Explore (subagent_type: Explore)
```
Fast file/code search
Pattern finding
Codebase questions
```

### General (subagent_type: general-purpose)
```
Multi-step implementation
Complex changes
Autonomous work
```

### Specialists
```
code-reviewer
debugger
security-reviewer
performance-reviewer
```

## Sizing Guidelines

| Task | Agents | Why |
|------|--------|-----|
| Small search | 3-5 | Quick coverage |
| Full codebase | 5-10 | One per major area |
| Deep analysis | 10-15 | Thorough exploration |
| Massive refactor | 15-20 | Maximum parallelism |

## Token Efficiency

### Agents Have Narrow Context
```
Main conversation: Full codebase
Each agent: Only its target area

5 agents searching 5 areas:
- Same tokens as 1 agent doing all 5
- 5x faster
- Each has focused context
```

### Agent Summary Pattern
```
Agent explores extensively.
Returns: "Found issue in auth.swift:142"

You get 1-line summary.
Not the full exploration trace.
```

## Anti-Patterns

### ❌ Don't
```
- Spawn for simple reads (just use Read tool)
- Spawn with dependencies (race conditions)
- Spawn 50 agents (chaos)
- Wait on each before spawning next
```

### ✓ Do
```
- One message, all agents
- Independent targets
- 5-20 agents max
- Background for long work
```

## Example Prompt

```
Spawn a bug-hunting swarm:

1. Search src/auth/ for security vulnerabilities
2. Search src/payment/ for data handling issues
3. Search src/api/ for input validation bugs
4. Search src/user/ for permission issues
5. Search src/data/ for race conditions

Return findings ranked by severity.
```

Use when: Any parallel work opportunity
