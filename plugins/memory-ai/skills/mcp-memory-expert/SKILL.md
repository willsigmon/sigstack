---
name: MCP Memory Expert
description: MCP memory servers - OpenMemory, knowledge graphs, persistent context for Claude
allowed-tools: Read, Edit, Bash
model: sonnet
---

# MCP Memory Expert

Add persistent memory to Claude using MCP memory servers.

## Top MCP Memory Solutions

### 1. OpenMemory MCP (Mem0)
- Cross-client memory (Claude ↔ Cursor ↔ Windsurf)
- Local storage, no cloud
- Full data ownership

### 2. Official Anthropic Memory Server
- Knowledge graph storage
- Entities and relations
- Semantic search
- Persistent across sessions

### 3. mcp-memory-service
- Automatic context memory
- Works with 13+ AI tools
- Stop re-explaining projects

### 4. mcp-knowledge-graph
- Local knowledge graph
- Entity-relation storage
- Query capabilities

## Setup

### OpenMemory MCP
```json
{
  "mcpServers": {
    "openmemory": {
      "command": "npx",
      "args": ["-y", "@mem0/openmemory-mcp"],
      "env": {
        "STORAGE_PATH": "~/.openmemory"
      }
    }
  }
}
```

### Anthropic Memory Server
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

## Usage Patterns

### Store Context
```
User: Remember that I'm building an iOS app called Leavn using SwiftUI
Claude: [Calls memory MCP to store this fact]
       Got it! I'll remember you're building Leavn with SwiftUI.
```

### Retrieve Context
```
User: What framework am I using?
Claude: [Queries memory MCP]
       You're using SwiftUI for your Leavn iOS app.
```

### Knowledge Graph Pattern
```
Entities:
- User (developer, iOS focus)
- Project (Leavn, Bible study app)
- Technology (SwiftUI, SwiftData, CloudKit)

Relations:
- User → develops → Project
- Project → uses → Technology
```

## CLAUDE.md Integration

The two-tier memory pattern:
1. **CLAUDE.md** (~150 lines): High-confidence, frequently accessed
2. **MCP Memory**: Everything else, searchable

```markdown
# CLAUDE.md - Project Briefing
- Project: Leavn iOS app
- Stack: SwiftUI, SwiftData, CloudKit
- User: Vibecoder, novice with nomenclature
```

Use when: Cross-session memory, project context, learning user preferences
