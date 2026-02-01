---
name: MCP Automation Expert
description: Model Context Protocol automation - MCP servers, agentic workflows, tool orchestration
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# MCP Automation Expert

Leverage Model Context Protocol for AI-powered automation.

## What MCP Enables
- AI agents connecting to external tools
- Standardized tool interfaces
- Cross-platform automation
- 40-60% faster agent deployment

## Top MCP Servers for Automation

### Workflow Platforms
- **n8n MCP**: Trigger workflows, orchestrate logic
- **Zapier MCP**: 5000+ app integrations
- **Make MCP**: Visual automation

### Data & Storage
- **Supabase MCP**: Database operations
- **Notion MCP**: Knowledge base access
- **Pinecone MCP**: Vector search

### Development
- **GitHub MCP**: Repo operations
- **Playwright MCP**: Browser automation
- **Filesystem MCP**: Local file access

## Configuration

### Claude Desktop
```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["-y", "@n8n/mcp-server"],
      "env": {
        "N8N_API_KEY": "your-api-key"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"]
    }
  }
}
```

### Claude Code
```json
// ~/.claude.json mcpServers section
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": { "GITHUB_TOKEN": "..." }
  }
}
```

## Agentic Workflow Pattern

```
User Request
    ↓
Claude analyzes intent
    ↓
Calls MCP tools:
  1. GitHub MCP: Create branch
  2. Filesystem MCP: Write code
  3. GitHub MCP: Push & PR
    ↓
Returns result
```

## Building Custom MCP Servers

### TypeScript Template
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({
  name: 'my-automation',
  version: '1.0.0',
});

server.tool('run_workflow', {
  description: 'Execute automation workflow',
  inputSchema: {
    type: 'object',
    properties: {
      workflow_id: { type: 'string' }
    }
  }
}, async ({ workflow_id }) => {
  // Execute workflow logic
  return { success: true };
});
```

## 2026 Trends
- MCP becoming industry standard
- Gartner: 40% enterprise apps will have AI agents by end of 2026
- Tens of thousands of MCP servers available
- OAuth, resources, prompts, elicitation support

Use when: Building AI agent workflows, connecting Claude to external tools, automation orchestration
