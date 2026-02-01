---
name: Daily Driver
description: Start each day efficiently - standup, priorities, context loading
allowed-tools: Read, Bash, ToolSearch
model: haiku
---

# Daily Driver

Start fast, stay focused.

## Morning Startup (2 minutes)

### Quick Context Load
```
"What's the state of [project]?"

Claude checks:
- Git status
- Recent commits
- Open TODOs
- Last session notes
```

### Priority Setting
```
"Top 3 things for today?"

Based on:
- Yesterday's progress
- Blockers cleared
- Deadlines
```

## Daily Standup Pattern

### Solo Dev Standup
```
"Standup:
- Yesterday: [what you did]
- Today: [what you'll do]
- Blockers: [anything stopping you]"

Claude records, suggests priorities.
```

### End of Day
```
"EOD:
- Done: [completed tasks]
- WIP: [in progress]
- Tomorrow: [next priorities]"

Creates handoff for next session.
```

## Quick Starts

### Resume Work
```
"Continue where we left off"

Claude checks:
- Last conversation summary
- Memory MCP for context
- Git for recent changes
```

### Fresh Start
```
"New day, new focus: [area]"

Clears old context.
Loads relevant files.
```

### Quick Fix Mode
```
"Quick bug: [description]"

Fast path:
- Find issue
- Fix it
- Commit
- Move on
```

## Context Switching

### Between Projects
```
"Switch to [other project]"

Claude:
- Saves current context
- Loads new project CLAUDE.md
- Checks that project's state
```

### Between Tasks
```
"Park this, work on [other thing]"

Claude notes:
- Current state
- What's pending
- Resume point
```

## Energy Management

### High Energy Tasks
```
Morning:
- Architecture decisions
- Complex debugging
- New feature design

→ Use Opus when needed
```

### Low Energy Tasks
```
Afternoon:
- Code cleanup
- Documentation
- Simple fixes

→ Use Haiku
```

## Quick Commands

### Status Check
```
"Status" → Git status + recent work
"What's broken?" → Check tests/errors
"What's next?" → Priority list
```

### Time Boxing
```
"30 min on [task]"

Claude focuses only on that.
Reminds when time's up.
```

### Quick Notes
```
"Note: [thought]"

Stored in memory MCP.
Retrieved when relevant.
```

## Daily Patterns

### Monday
```
"Week planning: what's the focus?"

Review:
- Last week's progress
- This week's goals
- Blockers to clear
```

### Friday
```
"Week wrap: what shipped?"

Summary:
- Completed items
- Learnings
- Next week prep
```

## Anti-Patterns

### Don't
```
❌ Start without context
❌ Work on many things at once
❌ Skip end-of-day capture
❌ Forget yesterday's blockers
```

### Do
```
✓ 2-minute standup start
✓ Single focus per session
✓ Capture progress before closing
✓ Review blockers first
```

Use when: Starting each day, context switching, maintaining momentum
