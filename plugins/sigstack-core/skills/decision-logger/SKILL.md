---
name: Decision Logger
description: Track decisions with context so you never question past choices
allowed-tools: Read, Edit, ToolSearch
model: haiku
---

# Decision Logger

Remember why, not just what.

## Why Log Decisions

```
6 months later:
"Why did we use this library?"
"Why is this structured this way?"
"Why didn't we do X?"

Logged decision → Instant answer
No decision log → Guessing + regret
```

## Decision Format

### Quick Log
```
"Decision: [what you chose]
Why: [reasoning]
Context: [what made this relevant now]"
```

### Full ADR (Architecture Decision Record)
```
# ADR: [Title]

## Status
Accepted

## Context
[What situation led to this decision]

## Decision
[What we chose to do]

## Consequences
[What this means going forward]
```

## Log Triggers

### Always Log
```
- Library/framework choices
- Architecture patterns
- Breaking from convention
- Trade-offs made
- "We could do X but chose Y"
```

### Skip
```
- Obvious choices
- Reversible easily
- Standard patterns
- No alternatives considered
```

## Quick Logging

### In Conversation
```
"Log decision:
Using SwiftData over Core Data
because simpler API and we're iOS 17+"
```

### As You Work
```
"Chose Sonnet over Haiku here
because complexity needs better reasoning"
```

### End of Session
```
"Any decisions worth logging today?"

Claude identifies:
- Architecture choices
- Library selections
- Pattern decisions
```

## Decision Categories

### Technical
```
- Database choice
- API design
- State management
- Testing strategy
```

### Product
```
- Feature scope
- UX approach
- Platform priority
- Launch criteria
```

### Process
```
- Workflow tools
- Deployment strategy
- Review process
- Documentation approach
```

## Storage Options

### Memory MCP (Quick)
```
"Remember decision: Chose X because Y"

Good for:
- Fast capture
- Auto-retrieval
- Personal decisions
```

### CLAUDE.md (Project)
```
## Key Decisions
- SwiftData over Core Data (iOS 17+, simpler)
- Supabase over Firebase (PostgreSQL, cost)

Good for:
- Team visibility
- Project context
- Auto-loaded every session
```

### ADR Files (Formal)
```
docs/adr/
├── 001-use-swiftdata.md
├── 002-supabase-backend.md
└── 003-feature-architecture.md

Good for:
- Team projects
- Complex decisions
- Historical reference
```

## Retrieval Patterns

### Before Making Decision
```
"What did we decide about [topic]?"
"Why do we use [thing]?"
"Was there a reason we didn't [alternative]?"
```

### When Questioning Past
```
"Seems like X was a bad choice?"

Check decision log:
- What was the context?
- What were the constraints?
- Is the context now different?
```

### Onboarding
```
New to codebase:
"Why is this project structured this way?"

Decision log answers instantly.
```

## Decision Quality

### Good Decision Log
```
"Chose SwiftData because:
1. iOS 17+ only target
2. SwiftUI integration cleaner
3. Core Data migration possible later
Trade-off: Newer, less battle-tested"
```

### Bad Decision Log
```
"Using SwiftData"
(No why, no context, useless)
```

## Review Pattern

### Monthly
```
"Review last month's decisions.
Any we should revisit?"

Check:
- Context changed?
- Better alternatives now?
- Pain points emerged?
```

### Before Major Changes
```
"Before refactoring auth, what decisions
were made about it originally?"

Understand history before changing.
```

## Anti-Patterns

### Don't
```
❌ Log without the "why"
❌ Log every tiny choice
❌ Use decisions to avoid blame
❌ Treat as unchangeable
```

### Do
```
✓ Include reasoning
✓ Log meaningful choices
✓ Revisit when context changes
✓ Update when learning more
```

Use when: Making architectural choices, selecting tools, trade-off decisions
