---
name: MCP Efficiency
description: Use MCP servers to reduce tokens and avoid manual data transfer
allowed-tools: Read, Bash, ToolSearch
model: sonnet
---

# MCP Efficiency

Let MCP fetch data instead of pasting it.

## Why MCP Saves Tokens

```
Without MCP:
1. You query database manually
2. Copy 5000 tokens of JSON
3. Paste into Claude
4. Claude processes
Total: 5000+ tokens

With MCP:
1. Claude queries database directly
2. Processes only relevant data
Total: 500 tokens
```

## Your Available MCPs

```
supabase     - Database queries
github       - Repos, issues, PRs
memory       - Persistent knowledge graph
fetch        - Web content
playwright   - Browser automation
filesystem   - File operations
```

## Token-Saving Patterns

### Database Queries
```
# BAD: Export → paste
"Here's our user data: [5000 lines JSON]"

# GOOD: MCP query
"Using Supabase, get users created this week"
Claude fetches only what's needed.
```

### GitHub Data
```
# BAD: Copy PR description
"Here's the PR: [paste entire diff]"

# GOOD: MCP access
"Review PR #123 in my-repo"
Claude fetches directly.
```

### Web Content
```
# BAD: Copy webpage text
"Here's the documentation: [paste 10 pages]"

# GOOD: WebFetch
"Fetch and summarize the SwiftUI docs for NavigationStack"
```

### Memory/Context
```
# BAD: Re-explain project every session
"As I mentioned before, this project uses..."

# GOOD: Memory MCP
Context persists across sessions.
No re-explanation needed.
```

## MCP Selection Guide

| Need | MCP | Example |
|------|-----|---------|
| Query DB | supabase | Get user counts |
| Read repo | github | Check PR status |
| Remember context | memory | Project preferences |
| Fetch URL | fetch | API docs |
| Browser testing | playwright | Screenshot UI |
| Read files | filesystem | Check configs |

## Efficient MCP Usage

### Query Specific, Not Everything
```
# BAD
"Get all users from the database"

# GOOD
"Get count of users created today"
```

### Use MCP for Verification
```
Instead of asking:
"Does the user table have an email column?"

MCP queries:
"Describe the users table schema"
```

### Chain MCP Calls
```
1. Query Supabase for user IDs
2. Query GitHub for their PRs
3. Analyze patterns

Each step uses only needed data.
```

## Anti-Patterns

### Fetching Everything
```
❌ "Get all records from all tables"
= Huge token cost, slow

✓ "Get record count by table"
= Summary data only
```

### Ignoring MCP for Manual
```
❌ Copy-paste from pgAdmin
❌ Screenshot and describe

✓ Let MCP query directly
```

### Not Using Memory
```
❌ Re-explain project structure every session
❌ Repeat coding preferences

✓ Store in memory MCP once
✓ Auto-recalled in future sessions
```

## Token Comparison

| Task | Without MCP | With MCP |
|------|-------------|----------|
| Check PR | ~2000 tokens | ~200 tokens |
| Query DB | ~5000 tokens | ~500 tokens |
| Fetch docs | ~3000 tokens | ~400 tokens |
| Project context | ~1000 tokens/session | ~0 tokens |

**Average savings: 80-90%**

## Quick MCP Check

Before pasting data, ask:
```
"Is there an MCP that can fetch this?"

If yes → use MCP
If no → paste (but compress first)
```

Use when: Any external data access, database work, API integration
