---
name: Context Reuse
description: Avoid re-explaining context - skills, memory, checkpoints, CLAUDE.md
allowed-tools: Read, Edit, Bash
model: haiku
---

# Context Reuse

Stop repeating yourself.

## Context Sources

| Source | Persists | Auto-loaded | Best For |
|--------|----------|-------------|----------|
| CLAUDE.md | Forever | Yes | Project rules |
| Skills | Forever | On invoke | Task patterns |
| Memory MCP | Forever | On query | Facts, prefs |
| Checkpoints | Manual | Manual | Session state |
| Conversation | Session | Yes | Current work |

## CLAUDE.md (Zero-Token Context)

### What Goes Here
```markdown
# Project: MyApp

## Architecture
- SwiftUI + SwiftData
- MVVM pattern
- Feature-based folders

## Conventions
- Use async/await
- Error handling with Result
- No force unwraps

## Key Files
- App.swift: Entry point
- Theme.swift: Colors, fonts
- Services/: API clients
```

### Why It's Efficient
```
Every session:
- Auto-loaded
- No tokens spent explaining
- Consistent behavior
```

## Skills (Reusable Prompts)

### Instead of Repeating
```
Every time:
"Review this code, check for bugs,
look at security, consider performance,
follow our Swift style guide..."
```

### Create a Skill Once
```markdown
# code-review skill
Review for:
- Bugs and edge cases
- Security vulnerabilities
- Performance issues
- Style guide compliance
```

### Invoke Efficiently
```
/code-review

50 tokens instead of 500.
```

## Memory MCP (Persistent Facts)

### Store Once
```
memory.add:
- "Prefers dark mode in UI"
- "Uses Supabase for backend"
- "Deploys to TestFlight weekly"
```

### Auto-Recalled
```
"Set up the database"
Memory: "User uses Supabase"
→ Claude uses Supabase without asking
```

## Checkpoints (Session State)

### Create Checkpoint
```
End of work session:
"Checkpoint:
- Completed: Auth flow, user model
- In progress: Payment integration
- Next: Webhook handling
- Blocked: Waiting on Stripe keys"
```

### Resume Next Session
```
Paste checkpoint →
Claude knows exactly where you left off.
No re-exploration needed.
```

## Conversation Techniques

### Summarize Periodically
```
Every 10-15 messages:
"Summarize our progress in 3 bullets."

Keeps context tight.
Prevents context bloat.
```

### Scope Narrowing
```
"We've explored the whole codebase.
Now focus only on src/auth/.
Forget the rest."
```

### Reference by Name
```
✓ "the UserService we built"
✓ "the validation bug"
✓ "that pattern from earlier"

Claude maintains references.
No need to re-describe.
```

## Anti-Patterns

### Session Amnesia
```
❌ Explaining project structure every session
✓ Put in CLAUDE.md once
```

### Prompt Repetition
```
❌ Same review criteria every time
✓ Create a skill
```

### Copy-Paste Context
```
❌ "As I mentioned, we use..."
✓ Memory MCP stores it
```

### Over-Explaining
```
❌ "Remember that file we edited?"
✓ Claude remembers within session
```

## Token Math

### Without Context Reuse
```
Session 1: 500 tokens explaining
Session 2: 500 tokens explaining
Session 3: 500 tokens explaining
...
10 sessions = 5000 tokens explaining same things
```

### With Context Reuse
```
CLAUDE.md: 0 tokens (auto-loaded)
Skills: 50 tokens (invoke)
Memory: 0 tokens (auto-recalled)
Checkpoint: 100 tokens (once)

10 sessions = 150 tokens
```

**97% savings on repeated context.**

## Quick Setup

```bash
# 1. Create CLAUDE.md in project root
# 2. Add project-specific skills
# 3. Configure memory MCP
# 4. Use checkpoints at session end

One-time setup, forever benefits.
```

Use when: Every project, every session, always
