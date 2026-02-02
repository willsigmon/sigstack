# Sigserve Hub

Central services for the Sigstack network, running on **sigserve** (Mac Studio).

## Services

### Memory API (`/memory-api`)

Unified memory hub that aggregates all data sources:

- **Local SQLite** — Fast cache with FTS5 full-text search
- **Letta** — Cross-session agent memories
- **Omi** — Pendant conversations and memories
- **Knowledge Graph** — Entity relationships

**Access:**
- Local: `http://localhost:8100`
- Public: `https://sigserve.tail7b9e1.ts.net`

**Endpoints:**
```
GET  /              → API info
GET  /health        → Source status
POST /search        → Unified search across all sources
POST /ingest        → Store new memory
GET  /omi/memories  → Omi memories
GET  /letta/memories → Letta agent blocks
```

### LLM Proxy (Future)

OpenAI-compatible endpoint that routes to multiple providers:
- `claude-*` → Anthropic
- `gemini-*` → Google
- `sonar-*` → Perplexity
- `local-*` → Ollama

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SIGSERVE (Mac Studio)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Memory API (8100)     LLM Proxy (3030)    Webhooks (future) │
│       │                      │                    │         │
│       └──────────────────────┼────────────────────┘         │
│                              │                              │
│                     Tailscale Funnel                        │
│                              │                              │
└──────────────────────────────┼──────────────────────────────┘
                               │
                    https://sigserve.tail7b9e1.ts.net
```

## Setup

```bash
cd memory-api
./install.sh
./run.sh
```

LaunchAgent auto-starts on boot: `com.sigserve.memory-api`
