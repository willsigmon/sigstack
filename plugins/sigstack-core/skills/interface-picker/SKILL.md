---
name: Interface Picker
description: When to use Claude Code vs API vs CLI vs MCP vs Desktop
allowed-tools: Read, Bash
model: haiku
---

# Interface Picker

Right tool for the job.

## Interface Comparison

| Interface | Best For | Token Cost | Setup |
|-----------|----------|------------|-------|
| Claude Code | Codebase work | Pro plan | Installed |
| Claude Desktop | Chat, docs, images | Pro plan | Installed |
| API | Automation, batch | Pay-per-use | API key |
| CLI (claude) | Quick queries | Pro plan | Installed |
| MCP | Tool access | Varies | Config |

## Claude Code

**Use when:**
- Working in a codebase
- Need file read/write/edit
- Multi-file changes
- Running tests/builds
- Agent swarms for parallel work

**Strengths:**
- Full codebase context
- Tool access (Bash, Edit, etc.)
- Agent spawning
- Skill/plugin system

**Example:**
```
"Refactor the auth module to use async/await"
→ Claude reads, plans, edits, tests
```

## Claude Desktop

**Use when:**
- Document analysis (PDFs, images)
- Long-form writing
- Research and summarization
- Conversational exploration
- Projects (persistent context)

**Strengths:**
- Native image/PDF handling
- Projects for organization
- Clean UI for long docs
- MCP server access

**Example:**
```
Upload design PDF → "Extract the color palette"
```

## API (Direct)

**Use when:**
- Batch processing
- Automation pipelines
- Custom applications
- Embedding in products
- High-volume, predictable costs

**Strengths:**
- Full control
- Batch API for async (50% off)
- Streaming support
- Function calling

**Example:**
```python
# Process 1000 documents overnight
for doc in documents:
    result = client.messages.create(
        model="claude-sonnet-4-20250514",
        messages=[{"role": "user", "content": doc}]
    )
```

## CLI (claude command)

**Use when:**
- Quick one-off queries
- Scripting/automation
- Pipeline integration
- No need for conversation

**Strengths:**
- Fast startup
- Pipe input/output
- Shell integration
- Non-interactive use

**Example:**
```bash
# Quick question
echo "What's the Swift syntax for async?" | claude

# Process file
cat code.swift | claude "review this code"

# Generate and save
claude "write a gitignore for iOS" > .gitignore
```

## MCP Servers

**Use when:**
- Need external data (Supabase, GitHub, etc.)
- Tool access beyond file system
- Real-time information
- Database operations

**Strengths:**
- Direct tool access
- No manual copy/paste
- Structured data handling
- Composable tools

**Example:**
```
"Query our Supabase for users created today"
→ MCP fetches, no tokens wasted on raw data
```

## Decision Flowchart

```
Need to work with code files?
  YES → Claude Code
  NO ↓

Need to process images/PDFs?
  YES → Claude Desktop
  NO ↓

Batch processing 100+ items?
  YES → API (Batch)
  NO ↓

Quick one-liner question?
  YES → CLI
  NO ↓

Need external data/tools?
  YES → MCP-enabled interface
  NO ↓

Default → Claude Code (most capable)
```

## Hybrid Patterns

### Claude Code + MCP
```
Claude Code with Supabase MCP:
- Code changes + database queries
- Best of both worlds
```

### API + Claude Code
```
API for batch generation →
Claude Code for review/integration
```

### Desktop + Code Handoff
```
Research in Desktop (images, docs) →
Copy findings to Claude Code for implementation
```

## Cost Optimization

```
Pro Plan ($20/mo):
- Unlimited Claude Code
- Unlimited Desktop
- Unlimited CLI
- Best for: Daily heavy use

API Pay-per-use:
- $3/M input, $15/M output (Sonnet)
- Best for: Automation, batch jobs
- Batch API: 50% off for async

Hybrid:
- Pro for interactive work
- API for automation
- Best overall efficiency
```

Use when: Choosing interfaces, optimizing workflow, reducing friction
