---
name: Knowledge Capture
description: Capture learnings, decisions, and insights for future reference
allowed-tools: Read, Edit, ToolSearch
model: haiku
---

# Knowledge Capture

Never learn the same thing twice.

## Capture Triggers

### When to Capture
```
"Learned something new" → Capture
"Made a decision" → Capture
"Found a tricky solution" → Capture
"Debugged a weird bug" → Capture
"Discovered a pattern" → Capture
```

### Quick Capture
```
"Remember: [insight]"

→ Memory MCP stores it
→ Retrieved when relevant
→ Zero effort later
```

## Capture Patterns

### Solution Capture
```
"Remember this fix:
Problem: [what was wrong]
Solution: [what fixed it]
Why: [root cause]"

Example:
"Remember this fix:
Problem: SwiftData crash on save
Solution: Wrap in Task { @MainActor }
Why: Context threading issue"
```

### Decision Capture
```
"Remember decision:
Chose: [what you picked]
Over: [alternatives]
Because: [reasoning]"

Example:
"Remember decision:
Chose: Supabase
Over: Firebase, custom
Because: PostgreSQL + cheaper"
```

### Pattern Capture
```
"Remember pattern:
When: [situation]
Do: [approach]
Avoid: [anti-pattern]"

Example:
"Remember pattern:
When: New SwiftUI view
Do: Extract to component if >50 lines
Avoid: Massive single-file views"
```

## Retrieval

### Automatic
```
Claude asks Memory MCP before:
- Making decisions you've made before
- Solving problems you've solved
- Implementing patterns you've established
```

### Manual
```
"What did we learn about [topic]?"
"How did we solve [problem] before?"
"What's our pattern for [situation]?"
```

## Storage Hierarchy

### Memory MCP (Facts)
```
Quick facts, preferences, decisions
- "Prefers async/await over completion handlers"
- "SwiftData requires MainActor for saves"
- "Uses Supabase, not Firebase"
```

### CLAUDE.md (Rules)
```
Project-wide conventions
- Architecture patterns
- Coding standards
- File organization
```

### Skills (Procedures)
```
Repeatable workflows
- How to deploy
- How to review
- How to debug
```

### External Docs (Reference)
```
Detailed documentation
- API references
- Architecture docs
- Onboarding guides
```

## Capture Workflow

### During Work
```
Find solution →
"Remember: [quick note]" →
Continue working

Don't break flow.
Capture is 5 seconds.
```

### End of Session
```
"What did I learn today?"

Claude reviews conversation.
Suggests items to capture.
You approve or skip.
```

### Weekly Review
```
"What patterns emerged this week?"

Claude analyzes:
- Repeated solutions
- Common decisions
- Potential skills to create
```

## From Capture to Skill

### Threshold
```
Used same knowledge 3+ times?
→ Create a skill

"This pattern keeps coming up.
Create a skill for it."
```

### Skill Creation
```
Claude extracts:
- Core procedure
- Examples
- Anti-patterns

Creates SKILL.md.
No more re-explaining.
```

## Anti-Patterns

### Don't
```
❌ Trust you'll remember
❌ Capture everything (noise)
❌ Write essays (too long)
❌ Skip the "why"
```

### Do
```
✓ Capture when it feels valuable
✓ Keep it short (1-3 sentences)
✓ Include the reasoning
✓ Let Claude help organize
```

## Quick Commands

```
"Remember: [thing]" → Capture to memory
"Recall [topic]" → Retrieve from memory
"What patterns for [area]?" → List patterns
"Turn this into a skill" → Create reusable skill
```

Use when: Learning something new, making decisions, finding solutions
