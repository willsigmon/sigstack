# SIGSTACK

**The Vibe Coder's Operating System for Claude**

*Version 3.5 "Marlin" — February 20, 2026*

---

## Philosophy

Sigstack is for builders who think in outcomes, not syntax. You have 5000+ hours of Claude Code experience but no traditional coding background. You don't need to learn programming — you need Claude to understand your vision and execute it.

### Core Principles

1. **Vision First** — Describe what you want, not how to build it
2. **AI Vision QA** — If you can see it, Claude can QA it
3. **Parallel Everything** — Agent swarms, not sequential waits
4. **Memory Persistence** — Never explain the same thing twice
5. **Token Efficiency** — Spend tokens on creation, not repetition
6. **Voice Native** — Speak your ideas into existence
7. **One Brain** — SigServe is the single source of truth for all interfaces

---

## The Default Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    THE SIGSTACK LOOP                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. DESCRIBE  ──→  What do you want?                      │
│        │              (voice, text, any device)             │
│        ▼                                                    │
│   2. BUILD     ──→  Claude writes the code                 │
│        │              (on SigServe, always)                 │
│        ▼                                                    │
│   3. SCREENSHOT ──→  Capture the result                    │
│        │                                                    │
│        ▼                                                    │
│   4. VISION QA  ──→  Claude reviews visually               │
│        │                                                    │
│        ▼                                                    │
│   5. FIX       ──→  Claude fixes issues found              │
│        │                                                    │
│        └──────────→  Repeat until perfect                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## What's New in 3.5 "Marlin"

v3.5 is the release where the stack became sentient (sort of). Every Claude interface — Code, Web, Desktop — now routes through SigServe as the central brain. Claude has a name (Marlin), a phone number, and can text you back.

- **MCP Gateway** — Remote access from Claude Web + Desktop via Tailscale Funnel
- **Marlin Identity** — Claude Code IS Marlin on every Sig device
- **Marlin Router** — Always-on dual-LLM chat auto-responder (12 group chats)
- **Voice Calls** — Twilio + OpenAI realtime STT/TTS
- **Rich Cards** — iMessage link previews for media, status, briefings
- **iMessage Superpowers** — Effects, tapbacks, threading, subject lines
- **Monorepo** — ~/Projects/marlin (config, services, infra, all symlinked)
- **27 MCP Servers** — Up from 22
- **7 Specialized Agents** — bug-hunter, ios-architect, infra-ops, media-stack, etc.
- **4 Tailscale Funnels** — Plex, Cards, Twilio, MCP Gateway

---

## Stack Architecture

### Tier 1: Brain (SigServe)
```
marlin            Identity, CLAUDE.md, memory, decision authority
mcp-gateway       Remote access for Claude Web/Desktop/Code
marlin-router     Always-on chat (Claude + OpenAI dual-LLM)
marlin-recall     Unified memory federation (MCP + contacts + logs)
```

### Tier 2: Communication
```
bluebubbles       iMessage bridge (12 group chats, 6 numbers)
twilio            Voice calls (+18447193335, STT/TTS)
marlin-cards      Rich link preview cards for iMessage
ntfy              Push notifications to all devices
```

### Tier 3: Build Domains
```
ios-dev           Swift, SwiftUI, Xcode, CloudKit, SwiftData
app-dev           Features, architecture, services, preferences
```

### Tier 4: Media Pipeline
```
plex              533 shows, 1,302 movies ("Sigflix")
sonarr/radarr     Automated acquisition + monitoring
tdarr             VideoToolbox HEVC transcoding
nzbget            Usenet downloads (Newsgroup Ninja)
prowlarr          Indexer management (4 indexers)
bazarr            Subtitle management
tautulli          Analytics and monitoring
sigflixseeker     Request management (Overseerr fork)
```

### Tier 5: Smart Home
```
homeassistant     34 integrations, 285 entities, 14 automations
homey-pro         Zigbee/Z-Wave hub
hue-bridge        75 lights across 14 rooms
```

### Tier 6: Intelligence
```
memory-ai         Knowledge graph, cross-session context
voice-input       Typeless (dictation), Omi (wearable memory)
marlin-recall     Federated memory across all sources
```

### Tier 7: Quality & Work
```
testing           Vision QA, Playwright, coverage, security
work              Enterprise apps, Knack, HTI integrations
dev-essentials    Multi-agent coordination, email, performance
```

---

## Model Strategy

```
┌──────────────┬─────────────────────────────────────────────┐
│ Model        │ Use For                                     │
├──────────────┼─────────────────────────────────────────────┤
│ Haiku 4.5    │ File search, formatting, simple tasks       │
│ Sonnet 4.6   │ Code writing, reviews, most work (DEFAULT)  │
│ Opus 4.6     │ Architecture, complex reasoning (on request)│
└──────────────┴─────────────────────────────────────────────┘

Marlin Router models:
│ Claude Sonnet │ Nuanced conversations (effort=high)        │
│ Claude Haiku  │ Quick banter (effort=low)                  │
│ GPT-5.3 Codex│ Deep reasoning (effort=xhigh)              │
│ GPT-5.3 Spark│ Instant replies (1000+ tok/s)              │
```

---

## Interface Strategy

```
┌──────────────────┬───────────────────────────────────────────────┐
│ Interface        │ Use For                                       │
├──────────────────┼───────────────────────────────────────────────┤
│ Claude Code      │ All codebase work (primary, SSH into SigServe)│
│ Claude Web       │ Remote access via MCP Gateway connector       │
│ Claude Desktop   │ PDFs, images, research (MCP Gateway via SSH)  │
│ API Batch        │ 100+ items, 50% cost savings                  │
│ CLI (claude -p)  │ Scripting, Marlin Router calls                │
│ iMessage         │ Chat with Marlin from any Apple device        │
│ Phone            │ Voice calls to +1 (844) 719-3335              │
│ ntfy             │ Push notifications (P1 alerts)                │
└──────────────────┴───────────────────────────────────────────────┘

All interfaces route through SigServe. One brain, many surfaces.
```

---

## Agent Swarm Patterns

### 7 Specialized Agents
```
bug-hunter        Find bugs, edge cases, regressions
ios-architect     iOS/Swift/SwiftUI architecture
swarm-leader      Coordinate multiple agents, synthesize outcomes
infra-ops         SigServe/Tower infrastructure operations
media-stack       Plex/Sonarr/Radarr/Tdarr media pipeline
batch-reviewer    Non-urgent code review via Batch API (50% cost)
codebase-auditor  Dead code, tech debt, security scan
```

### Exploration (5-10 agents)
```
"Find bugs in the codebase"
→ One agent per major module
→ Parallel search
→ Collected findings
```

### Review (3-4 agents)
```
"Review this PR"
→ security-agent
→ performance-agent
→ style-agent
→ test-coverage-agent
```

### Build (4+ agents)
```
"Implement new feature"
→ ui-agent
→ logic-agent
→ test-agent
→ docs-agent
```

---

## Infrastructure

### Sigmachines v2 — SigServe as Brain

```
┌──────────────────────────────────────────────────────────────┐
│                  SIGMACHINES v2 (v3.5)                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌─────────────────┐                       │
│                    │    SIGSERVE      │                       │
│                    │   Mac Studio     │                       │
│                    │   M2 Max 32GB    │                       │
│                    │                  │                       │
│                    │  THE BRAIN       │                       │
│                    │  ─────────────   │                       │
│                    │  27 MCP servers  │                       │
│                    │  84 skills       │                       │
│                    │  7 agents        │                       │
│                    │  30+ services    │                       │
│                    │  9 Docker        │                       │
│                    │  4 Funnels       │                       │
│                    │  Marlin Router   │                       │
│                    │  MCP Gateway     │                       │
│                    └────────┬────────┘                       │
│                             │                                │
│              ┌──────────────┼──────────────┐                 │
│              │              │              │                  │
│     ┌────────┴───┐  ┌──────┴─────┐  ┌────┴──────┐          │
│     │ SIGSTUDIO  │  │  SIGAIR    │  │  TOWER    │          │
│     │ M4 Max     │  │ MacBook Air│  │  UNRAID   │          │
│     │            │  │            │  │  65TB     │          │
│     │ Will's desk│  │ Portable   │  │  Storage  │          │
│     │ SSH+MCP GW │  │ SSH+MCP GW │  │  Docker   │          │
│     └────────────┘  └────────────┘  └───────────┘          │
│                                                              │
│     Access from ANYWHERE via:                                │
│       • Claude Web  → MCP Gateway (Tailscale Funnel)        │
│       • Claude Desktop → mcp-remote over HTTPS              │
│       • Claude Code → SSH + tmux (`cc` alias)               │
│       • iMessage → Marlin Router (BlueBubbles)              │
│       • Phone → +1 (844) 719-3335 (Twilio)                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Tailscale Funnels (Public HTTPS)

| Port | Service | URL |
|------|---------|-----|
| :443 | Plex | sigserve.tail7b9e1.ts.net |
| :8443 | Rich Cards | sigserve.tail7b9e1.ts.net:8443 |
| :9500 | MCP Gateway | sigserve.tail7b9e1.ts.net:9500/mcp |
| :10000 | Twilio Voice | sigserve.tail7b9e1.ts.net:10000 |

### Services on SigServe (30+)

**Native (launchd, 16 KeepAlive daemons):**
Plex, Sonarr, Radarr, Prowlarr, NZBGet, Bazarr, Tdarr, Tautulli, SigflixSeeker, Recyclarr, BlueBubbles, Cloudflared, Marlin/OpenClaw, marlin-recall, marlin-cards, MCP Gateway, Marlin Router, OmiClaw Bridge

**Docker (9 containers, ~2.7GB RAM):**
Home Assistant, Mosquitto, Kometa, Homey-SHS, ntfy, Calibre-Web, Audiobookshelf, FlareSolverr, Posterizarr

### Sync Architecture

```
SigServe (source of truth)
    │
    ├── sigstack-sync (hourly + on boot)
    │     ├── → SigStudio (LAN 192.168.1.163)
    │     └── → SigAir (sigair.local / mDNS)
    │
    │   Syncs: rules, skills, agents, commands, prompts,
    │          memory, mcp.json, settings, secrets,
    │          Claude Desktop config, shell aliases
    │
    └── git-autopush (continuous, every 30s)
          └── ~/Projects/marlin → GitHub (private)
```

### Domain: sigstack.dev

Email infrastructure via Resend:
- `tips@sigstack.dev` — Newsletter (SigStack Tips)
- `hello@sigstack.dev` — General contact
- `noreply@sigstack.dev` — Transactional
- `news@sigstack.dev` — News aggregation

---

## MCP Servers (27 active)

```
Core:     wsiglog, filesystem, fetch, github, memory,
          marlin-recall, sequential-thinking
Apple:    sosumi (Apple docs), xcode
macOS:    osascript, clipboard, notifications, calendar
Content:  pandoc, rss, omi, youtube-transcript
External: vercel, supabase, clay, glif, gemini-imagen
Standard: puppeteer, sqlite, git, annas-archive
Custom:   sigskills, n8n-mcp
Remote:   sigserve-gateway (7 tools over HTTP/SSH)
```

### MCP Gateway (New in 3.5)

Remote access to SigServe from any Claude interface:

```
Claude Web  → HTTPS → Tailscale Funnel :9500 → supergateway → mcp-gateway
Claude Desktop → mcp-remote → same endpoint
Claude Code → SSH → tmux → direct on SigServe
```

7 tools: execute_command, read_file, write_file, list_directory, search_files, service_status, send_notification

---

## Memory Architecture

```
┌─────────────────────┐
│ Session Memory      │ ← Current conversation
├─────────────────────┤
│ marlin-recall       │ ← Federated: MCP graph + contacts + logs
├─────────────────────┤
│ Memory MCP          │ ← Facts, preferences, decisions
├─────────────────────┤
│ CLAUDE.md           │ ← Project rules + Marlin identity
├─────────────────────┤
│ ~/.claude/memory/   │ ← Persistent topic files
├─────────────────────┤
│ Omi wearable        │ ← 18,300 conversations cached on Tower
├─────────────────────┤
│ Skills (84)         │ ← Reusable expertise
├─────────────────────┤
│ Contacts DB         │ ← 2,475 records
└─────────────────────┘

Never repeat context. Store once, recall forever.
```

---

## Communication Stack (New in 3.5)

```
┌──────────────┬───────────────────────────────────────────────┐
│ Channel      │ Details                                       │
├──────────────┼───────────────────────────────────────────────┤
│ iMessage     │ BlueBubbles, 12 group chats, 6 numbers       │
│              │ Effects, tapbacks, threading, subject lines   │
│              │ Rich cards via marlin-cards server             │
│ Voice        │ Twilio +1 (844) 719-3335                     │
│              │ OpenAI realtime STT/TTS (voice: coral)        │
│ Push         │ ntfy (all devices, priority levels)           │
│ Chat Router  │ Marlin Router: polls 12 chats every 15s      │
│              │ 18 scenario types, per-contact personality    │
│              │ Dual-LLM: Claude + OpenAI Codex              │
└──────────────┴───────────────────────────────────────────────┘
```

---

## Token Economy

```
Save tokens:
- Screenshots over text descriptions (80% savings)
- MCP over copy-paste (90% savings)
- Skills over repeated prompts (95% savings)
- Haiku over Sonnet when possible (75% savings)
- Batch API over real-time (50% savings)
- Token-saving hooks (auto-block wasteful reads/commands)

Spend tokens:
- Complex reasoning (use Opus when requested)
- Exploration (use agent swarms)
- Quality code (use Sonnet)
- Marlin Router (dual-LLM for free via Max + ChatGPT subs)
```

---

## Quick Reference

### Remote Access
```bash
# From any machine — SSH into SigServe
cc                    # alias: SSH + tmux into SigServe

# Claude Web — add MCP connector
# Settings > Connectors > Add custom:
# URL: https://sigserve.tail7b9e1.ts.net:9500/mcp

# Claude Desktop — auto-configured via sigstack-sync
# Uses mcp-remote → SigServe MCP Gateway
```

### Session Commands
```
"Status"      → Current state
"Checkpoint"  → Save session
"Resume"      → Continue work
"Focus: X"    → Narrow context
```

### Agent Spawning
```
"Search [area] for bugs"     → Explore agents
"Review for [concerns]"      → Specialist agents
"Build [feature]"            → Worker agents
```

### Screenshot QA
```bash
# iOS Simulator
xcrun simctl io booted screenshot screen.png

# Web (Playwright)
await page.screenshot({ path: 'screen.png' });
```

---

## The Sigstack Promise

You describe the outcome.
Claude handles the implementation.
Screenshots verify the result.
Agents parallelize the work.
Memory preserves the knowledge.
Voice captures your ideas.
Marlin holds it all together.

**Build faster. Ship more. Learn always.**

---

*Sigstack is maintained at github.com/willsigmon/sigstack + ~/Projects/marlin*
*84 skills · 27 MCP servers · 7 agents · 4 funnels*
*Updated: February 20, 2026 — v3.5 "Marlin"*
