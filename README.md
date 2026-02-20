# Sigstack — Vibe Coder's AI Development Stack

> **Your buddy's complete guide to my AI-assisted development setup**
>
> Last Updated: February 2026 — v3.5 "Marlin"

Welcome to **Sigstack** — my complete Claude Code configuration for shipping software with AI. This repo contains everything you need to replicate my vibe coding setup across macOS, Linux, and Windows.

## Quick Start

```bash
# Clone this repo
git clone https://github.com/willsigmon/sigstack.git ~/.sigstack

# Run the setup script
cd ~/.sigstack && ./setup.sh
```

## What's Inside

```
sigstack/
├── claude/              # Claude Code configuration (primary tool)
│   ├── skills/          # 84 reusable AI skills
│   ├── commands/        # 24 slash commands
│   ├── rules/           # Vibe rules synced across machines
│   └── settings.json    # Hooks & permissions
├── plugins/             # 36 domain plugins (Cowork-compatible)
├── gemini/              # Gemini CLI configuration
├── n8n/                 # Workflow automation
├── n8n-workflows/       # Ready-to-import workflows
├── mcp/                 # MCP server configurations
├── shell/               # zsh/bash config
├── docs/                # SIGSTACK.md, changelog
└── src/                 # sigstack.dev website (Next.js 16)
```

## The Stack

### Primary Interface: Claude Code CLI

All development happens through **Claude Code** in iTerm2/Ghostty. On the Sigmachines network, every Claude Code session runs on **SigServe** (Mac Studio M2 Max) as the central brain.

**Remote access (new in v3.5):**
- **Claude Web** → MCP Gateway connector (Tailscale Funnel)
- **Claude Desktop** → mcp-remote over HTTPS (auto-configured)
- **Claude Code** → SSH + tmux (`cc` alias from any machine)
- **iMessage** → Marlin Router (always-on dual-LLM chat)
- **Phone** → +1 (844) 719-3335 (Twilio voice)

**Alternative editors:**
- **VS Code + Claude Extension** — Great for beginners
- **Cursor** — AI-first IDE
- **Zed** — Fast, Rust-based, Claude built-in

### Terminal: iTerm2 / Ghostty

```bash
# Install Ghostty on macOS
brew install ghostty
```

---

## Claude Code Setup

### Installation

```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Verify
claude --version
```

### Configuration Structure

```
~/.claude/
├── CLAUDE.md            # Main config (→ symlink to ~/Projects/marlin/claude/CLAUDE.md)
├── settings.json        # Hooks & permissions
├── skills/              # 84 reusable skill definitions
├── commands/            # 24 slash commands
├── rules/               # Auto-loaded vibe rules
├── agents/              # 7 specialized agents
├── memory/              # Persistent memory files
└── data/                # Contacts DB, family tree
```

### Token-Saving Hooks

These hooks automatically prevent wasteful operations:

| Hook | Blocks/Warns |
|------|-------------|
| **Read Validator** | Files >100KB, lockfiles, minified, `.xcodeproj` |
| **Bash Validator** | Commands touching `node_modules`, `.git`, `DerivedData` |
| **Model Enforcer** | Blocks Opus model (cost optimization) |
| **Write Validator** | Warns on files >50KB |
| **Glob Validator** | Warns on `**/*` patterns |
| **Grep Limiter** | Suggests head_limit when not specified |
| **Repeated Read Detector** | Suggests caching on repeated file reads |

### Tasks

Tasks are the built-in primitive for tracking complex projects across sessions and subagents.

```bash
# Start Claude with a shared task list
CLAUDE_CODE_TASK_LIST_ID=my-project claude
```

Tools: `TaskCreate`, `TaskGet`, `TaskUpdate`, `TaskList`

---

## Skills Library (84 Skills)

Skills are reusable AI expertise modules. Invoke with `/skill skill-name`.

### iOS Development (15)
| Skill | Purpose |
|-------|---------|
| `accessibility-auditor` | Add VoiceOver labels to UI elements |
| `actor-isolation-fixer` | Fix Swift 6 actor isolation errors |
| `ios-build-test` | Quick build and test cycle |
| `ios-simulator-debugger` | Runtime debugging in simulator |
| `xcode-build-analyzer` | Categorize build failures |
| `xcode-build-fixer` | Resolve build issues |
| `swift-fix-compiler-errors` | Fix compiler errors |
| `swift-binding-fixer` | Fix SwiftUI binding issues |
| `ios-visual-debug` | Screenshot-based visual debugging |
| `ios-feature-audit` | Audit feature for bugs/improvements |
| `ios-quick-fix` | Fast diagnosis for common issues |
| `modal-sheet-debugger` | Fix sheet presentation issues |
| `navigation-debugger` | Debug navigation issues |
| `leavn-build-diagnostics` | Build health expert |
| `ios-simulator-reset` | Nuclear reset and rebuild |

### SwiftUI & Architecture (10)
| Skill | Purpose |
|-------|---------|
| `swiftui-best-practices` | Audit and fix SwiftUI anti-patterns |
| `swiftui-debug` | Debug view state/binding issues |
| `swiftui-visual-verifier` | Visual UI verification |
| `performance-optimizer` | Fix performance issues |
| `performance-profiler` | Resource optimization |
| `service-consolidator` | Consolidate duplicate services |
| `dependency-injection-setup` | Add services to DI container |
| `error-handling-auditor` | Find unsafe error handling |
| `tca-destroyer` | Migrate TCA to @Observable |
| `tca-removal-audit` | Track TCA removal progress |

### n8n Automation (5)
| Skill | Purpose |
|-------|---------|
| `n8n-workflow-builder` | Design and build workflows |
| `n8n-ai-features` | AI capabilities in n8n |
| `n8n-api-integration` | Programmatic n8n control |
| `n8n-code-expressions` | Write code in n8n nodes |
| `n8n-hosting-config` | Self-host n8n |

### Meta/Utility
| Skill | Purpose |
|-------|---------|
| `create-mega-skills-batch` | Create 10-20 skills in one session |
| `multi-agent-coordinator` | Spawn 10-20 parallel agents |

See `claude/skills/` for all 84 skills.

---

## Agents (7 Specialized)

| Agent | Purpose |
|-------|---------|
| `bug-hunter` | Find bugs, edge cases, regressions |
| `ios-architect` | iOS/Swift/SwiftUI architecture |
| `swarm-leader` | Coordinate multiple agents, synthesize outcomes |
| `infra-ops` | SigServe/Tower infrastructure operations |
| `media-stack` | Plex/Sonarr/Radarr/Tdarr media pipeline |
| `batch-reviewer` | Non-urgent code review via Batch API (50% cost) |
| `codebase-auditor` | Dead code, tech debt, security scan |

---

## Commands (24 Slash Commands)

Universal flags: `--plan`, `--think`, `--think-hard`, `--ultrathink`, `--uc`

### Development
| Command | Purpose |
|---------|---------|
| `/build` | Build with TDD |
| `/dev-setup` | Setup dev environment |
| `/design` | Architect solutions |
| `/spawn` | Spawn sub-agents |

### Code Quality
| Command | Purpose |
|---------|---------|
| `/analyze` | Multi-dimensional analysis |
| `/improve` | Improve quality |
| `/explain` | Comprehensive explanations |
| `/scan` | Security scanning |

### Operations
| Command | Purpose |
|---------|---------|
| `/cleanup` | Clean artifacts |
| `/migrate` | DB and code migrations |
| `/deploy` | Deploy to environments |
| `/git` | Git workflow management |
| `/test` | Create tests |

---

## MCP Servers (27 Active)

| Server | Purpose |
|--------|---------|
| **sosumi** | Apple documentation (CRITICAL for iOS dev) |
| **github** | PRs, issues, code search |
| **memory** | Cross-session knowledge graph |
| **marlin-recall** | Federated memory (contacts + logs + MCP) |
| **wsiglog** | Life logging and context |
| **supabase** | Database, auth, edge functions |
| **vercel** | Deploy management |
| **xcode** | iOS builds and diagnostics |
| **osascript** | macOS automation |
| **calendar** | Events |
| **clipboard** | System clipboard |
| **notifications** | macOS alerts |
| **sqlite** | Database queries |
| **puppeteer** | Browser automation |
| **playwright** | Web automation and testing |
| **fetch** | HTTP requests |
| **filesystem** | File access |
| **pandoc** | Document conversion |
| **rss** | Feed reading |
| **youtube-transcript** | Video transcripts |
| **omi** | Wearable memory (18,300 conversations) |
| **clay** | Clay API |
| **glif** | AI workflows |
| **gemini-imagen** | Image generation |
| **git** | Repository management |
| **annas-archive** | Book search |
| **sigserve-gateway** | Remote access (7 tools over HTTP) |

---

## Device Sync (Sigmachines Network)

All devices connected via Tailscale private mesh network. SigServe is the brain.

### Devices

| Hostname | Device | Role | Status |
|----------|--------|------|--------|
| **sigserve** | Mac Studio M2 Max | BRAIN — all services, all data | Active |
| **sigstudio** | Mac Studio M4 Max | Will's desktop | Active |
| **sigair** | MacBook Air | Portable laptop | Active |
| **sigtower** | Unraid NAS (65TB) | Storage, Docker containers | Active |
| **sigpc** | Windows Desktop | Office workstation | Active |
| **ally-x** | ROG Ally X | Portable gaming (Bazzite) | Intermittent |

### Network Topology

```
                    ┌─────────────┐
                    │  SIGSERVE   │ ← BRAIN
                    │  M2 Max     │
                    │  27 MCP     │
                    │  30+ svcs   │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
    ┌───────┴──────┐ ┌────┴─────┐ ┌─────┴──────┐
    │  sigstudio   │ │  sigair  │ │  sigtower  │
    │  M4 Max      │ │ MacBook  │ │  UNRAID    │
    │  Will's desk │ │ Portable │ │  65TB      │
    └──────────────┘ └──────────┘ └────────────┘
```

### Sync

```bash
# Automatic: sigstack-sync runs hourly + on boot
# Syncs: rules, skills, agents, commands, prompts, memory,
#        mcp.json, settings, secrets, Claude Desktop config

# Manual: from SigServe
~/Projects/marlin/bin/sigstack-sync
```

### Domain: sigstack.dev

| Address | Purpose |
|---------|---------|
| `tips@sigstack.dev` | Newsletter (SigStack Tips) |
| `hello@sigstack.dev` | General contact |
| `noreply@sigstack.dev` | Transactional |
| `news@sigstack.dev` | News aggregation |

---

## Third-Party Tools

### Voice & Transcription
- **Typeless** — AI voice-to-text ([typeless.ai](https://typeless.ai))
- **Omi** — Wearable AI memory device + MCP server ([omi.me](https://omi.me))

### Memory & Context
- **Marlin Recall** — Federated memory across all sources (custom MCP)
- **Memory MCP** — Cross-session knowledge graph

---

## Quick Reference

### Daily Workflow

```bash
# Start Claude Code (on SigServe)
claude

# From another machine — SSH in
cc  # alias for SSH + tmux into SigServe

# Check health
sighealth
```

### Common Tasks

```bash
# Spawn agents for complex task
/spawn "Refactor authentication module" --agents 10

# iOS build and test
/build --ios --test

# Security scan
/scan --deep

# Deploy
/deploy --staging
```

---

## Installation Checklist

- [ ] Install Claude Code CLI
- [ ] Clone this repo to `~/.sigstack`
- [ ] Symlink configs: `./setup.sh`
- [ ] Install MCP servers
- [ ] Set up Tailscale (for multi-device sync)
- [ ] Install Typeless (optional, for voice input)
- [ ] Install Omi (optional, for wearable memory)
- [ ] Add Claude Web MCP connector (optional, for remote access)

---

## Resources

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Sigstack Philosophy (SIGSTACK.md)](./docs/SIGSTACK.md)
- [Changelog](./docs/SIGSTACK_CHANGELOG.md)
- [Tailscale](https://tailscale.com)

---

**Built with vibes by [@willsigmon](https://github.com/willsigmon)**

*"Build faster. Ship more. Learn always."*
