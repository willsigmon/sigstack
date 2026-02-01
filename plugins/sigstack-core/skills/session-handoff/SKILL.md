---
name: Session Handoff
description: End sessions cleanly so future sessions start fast
allowed-tools: Read, Edit, ToolSearch
model: haiku
---

# Session Handoff

End well, start fast.

## Why Handoff Matters

```
Without handoff:
→ 10 min re-explaining next session
→ Forget important context
→ Repeat mistakes

With handoff:
→ 30 sec to resume
→ Full context preserved
→ Continuous progress
```

## End of Session Protocol

### Quick Checkpoint (30 seconds)
```
"Checkpoint:
- Done: [what completed]
- WIP: [what's in progress]
- Next: [what's next]
- Blocked: [any blockers]"
```

### Full Handoff (2 minutes)
```
"Handoff summary:
1. What we accomplished
2. Current state of code
3. Pending decisions
4. Next steps in order
5. Gotchas to remember"
```

## Checkpoint Formats

### Minimal
```
"Done: Login UI
WIP: API integration
Next: Error handling"
```

### Standard
```
"Session end:
✓ Created LoginView with form
✓ Added validation logic
◐ AuthService (API calls WIP)
○ Error states
○ Tests

Next: Finish API integration
Note: Token refresh needs work"
```

### Detailed
```
"Session handoff:

## Completed
- LoginView.swift: Full UI implemented
- ValidationService.swift: Email/password rules

## In Progress
- AuthService.swift: Login call works, refresh broken
- Line 47: Need to handle 401 response

## Decisions Made
- Using Keychain for token storage
- Refresh handled client-side

## Next Session
1. Fix token refresh (see line 47)
2. Add loading states
3. Error toast component
4. Write tests

## Watch Out
- Simulator keychain quirky
- API rate limits on login endpoint"
```

## Storage Options

### Memory MCP
```
"Remember session state:
[checkpoint content]"

Auto-recalled next session.
```

### File in Project
```
# .session-state.md

Last updated: 2026-02-01

## State
[checkpoint content]

Committed or gitignored.
```

### CLAUDE.md Section
```
## Current Work
[checkpoint content]

Always loaded.
Update each session.
```

## Resume Patterns

### Quick Resume
```
Next session:
"Continue where we left off"

Claude checks:
1. Memory MCP
2. .session-state.md
3. Recent git commits
4. Last conversation
```

### Context Switch Resume
```
"Resume [project name]"

Claude loads that project's:
1. CLAUDE.md
2. Session state
3. Relevant memory
```

### Fresh Start
```
"New focus: [different area]"

Claude:
1. Parks current state
2. Loads new context
3. Clears irrelevant memory
```

## Handoff Quality Check

### Good Handoff
```
- Can resume in <1 minute
- No re-explanation needed
- Knows exactly what's next
- Remembers gotchas
```

### Bad Handoff
```
- "Where were we?"
- Re-reading old code
- Forgetting decisions
- Repeating mistakes
```

## Automatic Handoffs

### Git Commit Messages
```
Commits capture state naturally:

"WIP: Auth service, refresh TODO"

Even without explicit handoff,
commits tell the story.
```

### Memory MCP Auto-Capture
```
Configure Memory MCP to:
- Note key decisions
- Track current focus
- Remember blockers

Happens in background.
```

## Team Handoff

### Async Collaboration
```
End your session:
"Handoff for [teammate]:
[checkpoint content]"

They resume your work.
```

### PR Description
```
## Changes
[what changed]

## Testing Done
[how tested]

## Next Steps
[what remains]
```

## Anti-Patterns

### Don't
```
❌ Close without saving state
❌ Rely on memory
❌ Leave cryptic notes
❌ Skip when tired
```

### Do
```
✓ Always checkpoint
✓ Store in durable place
✓ Include the "why"
✓ Note the gotchas
```

## Quick Commands

```
"Checkpoint" → Quick state capture
"Handoff" → Full summary
"Status" → Current state
"Resume" → Continue from handoff
```

Use when: Ending any work session, switching contexts, before breaks
