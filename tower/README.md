# Tower Central Hub

Tower (Unraid NAS) is the central data store and service host for the Sigstack network.

## Architecture

```
Tower (/mnt/user/data/claude/)
├── memory/          # MCP memory graph
├── configs/         # IDE/Claude configs
├── mcp-servers/     # Self-hosted MCP servers
├── context/         # Project summaries
└── ide-prototype/   # Future IDE development

     ↕ rsync every 5 min

Local (~/.claude/tower-sync/)
     ↕ symlinks

MCP Memory Server → reads/writes memory.json
```

## Access
- SSH: `ssh root@tower.local` or `unraid` alias
- Path: `/mnt/user/data/claude/`
- Tailscale: `100.119.19.61`
- Force Tailscale: `ut` alias

## Services

| Service | Port | Purpose |
|---------|------|---------|
| n8n | — | Workflow automation (n8n.wsig.me) |
| Home Assistant | 8123 | Smart home, desk automation, CI status lights |
| Hub (LLM proxy) | 3030 | OpenAI-compatible router |
| Ollama | 11434 | Local LLM inference |
| BRAIN/wsiglog | — | SQLite memory database layer |
| Omi | — | Conversation ingestion from wearable |

## Connected Devices

| Device | Syncs With Tower | How |
|--------|-----------------|-----|
| Wills-MBA (MacBook Air) | Every 5 min + manual | rsync via Tailscale |
| wills-studio (Mac Studio) | Push from MBA | rsync via Tailscale |
| office-pc / vt-pc / deck | Pending setup | — |

## Sync Commands
```bash
~/.claude/sync-tower.sh pull   # Get latest from Tower
~/.claude/sync-tower.sh push   # Push to Tower
~/.claude/sync-tower.sh both   # Bi-directional (default)
```

## LaunchAgent
Auto-syncs every 5 minutes via `com.wsig.tower-sync`
