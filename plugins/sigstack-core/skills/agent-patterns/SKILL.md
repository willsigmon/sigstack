---
name: Agent Patterns
description: When to spawn agents vs work directly - parallel execution, specialization
allowed-tools: Read, Bash, Task
model: sonnet
---

# Agent Patterns

Spawn smart, not often.

## When to Spawn Agents

### Good: Parallel Independent Work
```
"Search for auth bugs"
→ Spawn 5 agents, one per module
→ 5x faster, same tokens
```

### Good: Specialized Tasks
```
"Review this PR"
→ security-agent
→ performance-agent
→ style-agent
Each has focused expertise
```

### Bad: Sequential Dependencies
```
❌ Agent 1 creates file
❌ Agent 2 needs that file
= Race condition, wasted tokens

✓ Do sequentially in main conversation
```

### Bad: Simple Single Tasks
```
❌ "Spawn agent to add one line"
= Overhead > benefit

✓ Just do it directly
```

## Agent Types by Task

### Explore Agents (Research)
```
Task tool with subagent_type=Explore
- Fast file/code search
- Codebase questions
- Pattern finding
```

### Worker Agents (Execution)
```
Task tool with subagent_type=general-purpose
- Multi-step implementation
- Complex changes
- Autonomous work
```

### Specialist Agents
```
code-reviewer: Style, bugs, patterns
debugger: Error investigation
security-reviewer: Vulnerability scan
performance-reviewer: Bottleneck analysis
```

## Parallel Spawn Pattern

### Maximum Parallelism
```
Single message, multiple Task calls:

Task 1: "Search auth module for bugs"
Task 2: "Search payment module for bugs"
Task 3: "Search user module for bugs"
Task 4: "Search api module for bugs"
Task 5: "Search data module for bugs"

All run simultaneously.
```

### Background Agents
```
run_in_background: true

Start long-running work →
Continue other tasks →
Check results later with TaskOutput
```

## Token Efficiency with Agents

### Narrow Context = Fewer Tokens
```
Main conversation: Full codebase context
Agent: Only sees what it needs

"Search auth/"
Agent loads only auth/, not entire codebase.
```

### Agent Summary Pattern
```
Agent does extensive search →
Returns: "Found issue in auth.swift:142"

You get 1-line summary, not full exploration.
Tokens saved: 90%+
```

### Handoff Pattern
```
1. Explore agent finds the problem
2. Main conversation receives summary
3. You fix directly with focused context

No need to spawn another agent.
```

## Anti-Patterns

### Over-Spawning
```
❌ "Spawn agent for each file"
= 50 agents for 50 files = chaos

✓ "Spawn agent per module" (5-10 agents)
```

### Agent for Simple Reads
```
❌ "Spawn agent to read config.json"
= 10 seconds + overhead

✓ Read tool directly = instant
```

### Waiting on Every Agent
```
❌ Spawn → Wait → Spawn → Wait

✓ Spawn all → Work on other things → Collect results
```

## Practical Spawn Counts

| Task | Agents | Why |
|------|--------|-----|
| Bug search | 5-10 | One per major module |
| PR review | 3-4 | Security, perf, style, tests |
| Refactor | 2-3 | Analyzer, transformer, validator |
| Feature build | 4 | UI, logic, tests, docs |
| Codebase exploration | 1 | Single thorough search |

## Agent Resumption

### Continue Previous Work
```
Task tool with resume: "agent-id"

Agent continues with full prior context.
No need to re-explain.
```

### When to Resume vs New
```
Resume: Same task, more work needed
New: Different task, fresh context
```

## Model Selection for Agents

```yaml
# In skill frontmatter or Task call
model: haiku   # Simple searches, formatting
model: sonnet  # Code review, implementation
model: opus    # Architecture, complex reasoning
```

**Default to cheapest model that works.**

Use when: Parallel work, specialized tasks, large codebase operations
