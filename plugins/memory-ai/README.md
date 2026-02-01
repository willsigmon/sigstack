# Memory AI Plugin

**Persistent memory for your AI workflows.** Vector databases, knowledge graphs, cross-session context.

## Skills

| Skill | Description | Pricing |
|-------|-------------|---------|
| `letta-expert` | Stateful AI agents with MemGPT | Free + $20/mo |
| `vector-db-expert` | Pinecone, Weaviate, Chroma for RAG | $25-150/mo |
| `mcp-memory-expert` | MCP memory servers for Claude | Free |
| `knowledge-graph-expert` | Entity-relation storage | Free (local) |
| `mem0-expert` | OpenMemory MCP, cross-client memory | Free |
| `context-window-expert` | Context management strategies | - |

## Key Value

**For Vibe Coders:**
- Claude remembers your project between sessions
- No more re-explaining your codebase
- AI learns your preferences over time
- Cross-tool memory (Claude ↔ Cursor ↔ Windsurf)

## Quick Start

### MCP Memory (Free)
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

### Chroma (Free Local)
```python
import chromadb
client = chromadb.Client()
collection = client.create_collection("project-context")
```

## Memory Architecture

```
CLAUDE.md (High-confidence, always loaded)
    ↓
MCP Memory (Searchable, unlimited)
    ↓
Vector DB (Semantic search, RAG)
```
