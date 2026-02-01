---
name: Sigstack Quickstart
description: Get started with sigstack in 5 minutes
allowed-tools: Read, Bash
model: haiku
---

# Sigstack Quickstart

**From zero to productive in 5 minutes.**

## What is Sigstack?

The vibe coder's operating system for Claude.

```
You describe → Claude builds → Screenshots verify → Repeat
```

No traditional coding knowledge needed.
5000+ hours of Claude experience? You're ready.

## The 3 Things to Remember

### 1. Screenshot Everything
```
After any change:
1. Screenshot it
2. "What's wrong?"
3. Fix what Claude finds
4. Repeat

This is THE workflow.
```

### 2. Let MCP Fetch Data
```
Don't copy-paste from:
- Databases (use Supabase MCP)
- GitHub (use GitHub MCP)
- Docs (use WebFetch)

Claude fetches directly. Fewer tokens.
```

### 3. Spawn Agents for Parallel Work
```
Big search? Spawn 5-10 agents.
PR review? Spawn specialists.
Feature build? Spawn workers.

One message, multiple Task calls.
```

## Your First Session

### 1. Start Clean
```
"What's the state of [project]?"

Claude checks git, files, context.
```

### 2. Set Focus
```
"Today: [specific thing]"

Narrow context = better results.
```

### 3. Work the Loop
```
"Build [thing]"
[screenshot]
"What's wrong?"
[fix]
[screenshot]
"Better?"
```

### 4. End Clean
```
"Checkpoint"

Saves state for next session.
```

## Essential Commands

| Command | What It Does |
|---------|--------------|
| `Status` | Check current state |
| `Checkpoint` | Save session |
| `Resume` | Continue from checkpoint |
| `Focus: [area]` | Narrow context |
| `Remember: [thing]` | Store in memory |
| `Recall [topic]` | Retrieve from memory |

## Model Selection

```
Simple task → Haiku (fast, cheap)
Code work → Sonnet (default)
Architecture → Opus (deep thinking)
```

Skills specify this in frontmatter.
You don't need to choose manually.

## Your MCP Servers

Check what's available:
```
Supabase → Database
GitHub → Repos, PRs
Memory → Persistent knowledge
Playwright → Browser automation
```

Use them. Don't copy-paste data.

## Your Voice Stack

```
Typeless → Daily dictation
Sled → Mobile voice to Claude Code
```

Speak your ideas. Code appears.

## Skill Invocation

```
/vibe-coder-qa       → Default QA workflow
/token-optimizer     → Reduce costs
/agent-patterns      → When to spawn
/session-handoff     → End sessions properly
```

Skills are reusable prompts.
Create your own when patterns repeat.

## Common Mistakes

### ❌ Don't
```
- Explain everything every session
- Copy-paste large data
- Work sequentially when parallel works
- Skip the screenshot step
- Close without checkpointing
```

### ✓ Do
```
- Use CLAUDE.md for project rules
- Use MCP for external data
- Spawn agents for parallel work
- Screenshot after every change
- Checkpoint before closing
```

## Quick Wins

### Save 90% Tokens
```
Before: "Here's my 5000-line database export..."
After: "Query Supabase for users created today"
```

### 5x Faster Search
```
Before: Search one module at a time
After: Spawn 5 agents, one per module
```

### Never Re-Explain
```
Before: "As I mentioned, we use SwiftUI..."
After: [It's in CLAUDE.md, auto-loaded]
```

## Next Steps

1. Read `/Users/wsig/Developer/sigstack/SIGSTACK.md`
2. Try the Vision QA workflow on your next change
3. Use "Checkpoint" before closing
4. Create a skill when you repeat something 3+ times

## The Sigstack Promise

```
Describe the outcome.
Claude handles implementation.
Screenshots verify results.
Agents parallelize work.
Memory preserves knowledge.
Voice captures ideas.

Build faster. Ship more. Learn always.
```

Use when: Getting started, onboarding others, refreshing workflow
