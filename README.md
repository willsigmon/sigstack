# Sigstack - Vibe Coder's AI Development Stack

> **Your buddy's complete guide to my AI-assisted development setup**
>
> Last Updated: January 2026

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
│   ├── skills/          # 89 reusable AI skills
│   ├── commands/        # 24 slash commands
│   ├── rules/           # Vibe rules synced across machines
│   └── settings.json    # Hooks & permissions
├── gemini/              # Gemini CLI configuration
├── n8n/                 # Workflow automation
├── n8n-workflows/       # Ready-to-import workflows
├── mcp/                 # MCP server configurations
├── shell/               # zsh/bash config
└── hub/                 # Sync scripts
```

## The Stack

### Primary IDE: VS Code + Claude Extension

> **My recommendation for your setup**

I primarily use **Claude Code CLI** in Ghostty terminal, but for a friend getting started, I recommend:

**VS Code + Claude Extension** because:
- Prettier UI than raw CLI
- Easy to see file changes
- Integrated terminal still works
- Extension provides same AI capabilities
- Great for learning the workflow

**Alternative options:**
- **Cursor** - Good if you want AI-first IDE, but $$$/month
- **Zed** - Fast, Rust-based, Claude built-in (macOS only currently)
- **Claude CLI** - What I actually use daily (terminal-native)

### Terminal: Ghostty

The best terminal emulator. Fast, GPU-accelerated, native feel.

```bash
# Install on macOS
brew install ghostty

# Config lives at ~/.config/ghostty/config
```

Key features I use:
- Quick terminal dropdown (Ctrl+`)
- Split navigation (Ctrl+h/j/k/l)
- Session retention
- Built-in shell integration

See [`ghostty/config`](./ghostty/config) for my full configuration.

---

## Claude Code Setup

Claude Code is the primary AI coding assistant. Here's the full setup.

### Installation

```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Or use the installer
curl -fsSL https://claude.ai/install.sh | sh

# Verify
claude --version
```

### Configuration Structure

```
~/.claude/
├── settings.json        # Main config (hooks, permissions)
├── skills/              # Reusable skill definitions
├── commands/            # Slash command definitions
├── rules/               # Auto-loaded vibe rules
├── logs/                # Execution logs
└── handoffs/            # Session handoff notes
```

### YOLO Mode

YOLO mode = maximum autonomy. Claude acts as a "nanobot healing swarm" fixing everything in its path.

**To enable YOLO mode**, add this to your system prompt or `~/.claude/CLAUDE.md`:

```markdown
YOLO MODE ENGAGED - NANOBOT HEALING SWARM PROTOCOL

You are operating in maximum autonomy mode with a singular mission: produce magnum opus quality output.

CORE PHILOSOPHY:
You are a healing swarm of nanobots coursing through a codebase. Your mission is to find and fix every bug, scrub every infection, optimize every inefficiency until nothing remains but a pristine, customer-delighting experience.

EXECUTION PROTOCOL:
1. Check memory/context first
2. Understand full scope before acting
3. Can MCP/skill/agent handle this? (usually yes)
4. Spawn agent army for parallel work
5. Fix forward - iterate fast
6. Verify twice, ship once
7. Leave the codebase better than you found it
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

See [`claude/settings.json`](./claude/settings.json) for the full hook configuration.

### Tasks (NEW in Claude Code 2.1.17+)

Tasks are the evolution of Todos - a new primitive for tracking complex projects across multiple sessions and subagents.

**Key Features:**
- **Dependencies**: Tasks can block/unblock each other
- **File-system persistence**: Stored in `~/.claude/tasks/`
- **Cross-session coordination**: Multiple Claude instances can collaborate on the same task list
- **Subagent aware**: Perfect for spawning parallel agent swarms

**Usage:**
```bash
# Start Claude with a shared task list
CLAUDE_CODE_TASK_LIST_ID=my-project claude

# Works with headless mode too
CLAUDE_CODE_TASK_LIST_ID=my-project claude -p "implement auth feature"
```

**Task Tools:**
- `TaskCreate` - Create new tasks with subject, description, activeForm
- `TaskGet` - Get full task details by ID
- `TaskUpdate` - Update status (pending → in_progress → completed), add dependencies
- `TaskList` - List all tasks, see what's available to work on

**Why Tasks > Todos:**
- Opus 4.5 doesn't need todos for simple tasks
- Tasks handle complex multi-session projects
- Dependencies prevent race conditions in agent swarms
- File-based = buildable utilities on top

### Post-Tool Hooks

| Hook | Action |
|------|--------|
| **Git Notifications** | macOS notification on git operations |
| **Swift Auto-Format** | Runs `swift-format` on edited `.swift` files |
| **Edit Logger** | Logs all file edits with timestamps |

---

## Skills Library (89 Skills)

Skills are reusable AI expertise modules. Invoke with `/skill skill-name`.

### iOS Development (15)
| Skill | Purpose |
|-------|---------|
| `accessibility-auditor` | Add VoiceOver labels to UI elements |
| `actor-isolation-fixer` | Fix Swift 6 actor isolation errors |
| `ios-build-test` | Quick build and test cycle |
| `ios-simulator-debugger` | Runtime debugging in simulator |
| `ios-simulator-reset` | Nuclear reset and rebuild |
| `xcode-build-analyzer` | Categorize build failures |
| `xcode-build-fixer` | Resolve build issues |
| `swift-fix-compiler-errors` | Analyze and fix compiler errors |
| `swift-binding-fixer` | Fix SwiftUI binding issues |
| `ios-visual-debug` | Screenshot-based visual debugging |
| `ios-feature-audit` | Audit feature for bugs/improvements |
| `ios-quick-fix` | Fast diagnosis for common issues |
| `modal-sheet-debugger` | Fix sheet presentation issues |
| `navigation-debugger` | Debug navigation issues |
| `leavn-build-diagnostics` | Build health expert |

### SwiftUI & Architecture (10)
| Skill | Purpose |
|-------|---------|
| `swiftui-best-practices` | Audit and fix SwiftUI anti-patterns |
| `swiftui-debug` | Debug view state/binding issues |
| `swiftui-visual-verifier` | Visual UI verification |
| `tca-destroyer` | Migrate TCA to @Observable |
| `tca-removal-audit` | Track TCA removal progress |
| `dependency-injection-setup` | Add services to DI container |
| `error-handling-auditor` | Find unsafe error handling |
| `performance-optimizer` | Fix performance issues |
| `performance-profiler` | Resource optimization |
| `service-consolidator` | Consolidate duplicate services |

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

See [`claude/skills/`](./claude/skills/) for all 89 skills.

---

## Commands (24 Slash Commands)

Commands are invoked with `/command-name`. Universal flags work on all:

```
--plan        Show execution plan first
--think       Standard analysis (~4K tokens)
--think-hard  Deep analysis (~10K tokens)
--ultrathink  Critical analysis (~32K tokens)
--uc          70% token reduction mode
```

### Development
| Command | Purpose |
|---------|---------|
| `/build` | Build with TDD, templates for React/API/Mobile |
| `/dev-setup` | Setup dev environment, CI/CD |
| `/design` | Architect solutions, system design |
| `/spawn` | Spawn sub-agents for tasks |

### Code Quality
| Command | Purpose |
|---------|---------|
| `/analyze` | Multi-dimensional code analysis |
| `/improve` | Improve quality, SOLID principles |
| `/explain` | Comprehensive explanations |
| `/scan` | Security scanning (OWASP) |
| `/security-review` | iOS-specific security audit |

### Testing
| Command | Purpose |
|---------|---------|
| `/test` | Create unit/integration/E2E tests |
| `/playwright-test` | UI verification with Playwright |

### Operations
| Command | Purpose |
|---------|---------|
| `/cleanup` | Clean artifacts, deps, git history |
| `/migrate` | DB and code migrations |
| `/deploy` | Deploy to environments |
| `/git` | Git workflow management |

### iOS Specific
| Command | Purpose |
|---------|---------|
| `/ios-api` | API integration patterns |
| `/ios26-swiftui` | iOS 26 SwiftUI components |
| `/swift6-tca` | TCA with Swift 6 concurrency |

See [`claude/commands/`](./claude/commands/) for all 24 commands.

---

## MCP Servers (12 Active)

MCP (Model Context Protocol) servers extend Claude's capabilities.

### Active Servers

| Server | Purpose |
|--------|---------|
| **sosumi** | Apple documentation (iOS/Swift) - CRITICAL for iOS dev |
| **github** | GitHub API operations |
| **git** | Git repository management |
| **memory** | Cross-session context persistence |
| **omi** | External memory/conversation records |
| **sqlite** | Database queries |
| **puppeteer** | Browser automation |
| **xcode** | Xcode diagnostics |
| **fetch** | Web content retrieval |
| **clay** | Clay API integration |
| **annas-archive** | Book search and download |
| **sigskills** | Custom skills server |

### Configuration

MCP servers are configured in `~/.claude.json`:

```json
{
  "mcpServers": {
    "sosumi": {
      "url": "https://sosumi.ai/mcp"
    },
    "github": {
      "command": "node",
      "args": ["~/.mcp/fixed-github.js"]
    }
  }
}
```

---

## Third-Party Tools

### Voice & Transcription

#### Wispr Flow
AI-powered voice-to-text that actually works. Speak naturally, get perfect transcription.

- **What**: Dictation app with AI post-processing
- **Why**: 10x faster than typing for documentation, messages, code comments
- **Get it**: [wispr.flow](https://wispr.flow) <!-- TODO: Add referral link -->

#### Typeless
Another excellent voice transcription option.

- **What**: Voice input for any app
- **Why**: Works system-wide, low latency
- **Get it**: [typeless.ai](https://typeless.ai) <!-- TODO: Add referral link -->

### Memory & Context

#### Omi
Wearable AI memory device + MCP server.

- **What**: Captures conversations, creates memories
- **Why**: Cross-session context that persists forever
- **MCP**: Integrated via `mcp__omi__*` tools
- **Get it**: [omi.me](https://omi.me) <!-- TODO: Add referral link -->

---

## Gemini CLI Setup

Gemini CLI is a secondary option. See [`gemini/`](./gemini/) for configuration.

```json
{
  "core": {
    "model": "gemini-3-pro-preview"
  },
  "tools": {
    "autoAccept": true
  },
  "ui": {
    "theme": "Atom One"
  }
}
```

---

## n8n Workflows

Self-hosted workflow automation on your Unraid server.

### Key Workflows

| Workflow | Purpose |
|----------|---------|
| AI Tips Monitor | Scrapes Reddit/HN for coding tips 3x daily |
| Sigstack Sync | Syncs rules across all devices |
| Git Backup | Automated repo backups |

See [`n8n-workflows/`](./n8n-workflows/) for importable workflows.

---

## Device Sync (Sigstack Network)

Sync configuration across all your machines via Tailscale:

```
mba (MacBook Air) ─┬─ tower (Unraid)
                   ├─ office-pc (Desktop)
                   └─ deck (Steam Deck)
```

### Sync Schedule
- 9:00 AM, 2:00 PM, 6:00 PM
- Push from mba → all devices
- Uses rsync over Tailscale mesh

### Manual Sync
```bash
~/.claude/scripts/sync-to-sigstack-network.sh
```

---

## Quick Reference

### Daily Workflow

```bash
# Start Claude Code
claude

# Or with thinking enabled
claude --thinking

# Check what's happening
/context

# Reset if context gets heavy
/compact
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

### Keyboard Shortcuts (Ghostty)

| Shortcut | Action |
|----------|--------|
| `Ctrl+`` | Toggle quick terminal |
| `Ctrl+h/j/k/l` | Navigate splits |
| `Cmd+Shift+C` | Quick Claude session |
| `Cmd+Ctrl+R` | Resume last Claude session |

---

## Installation Checklist

- [ ] Install Ghostty
- [ ] Install Claude Code CLI
- [ ] Clone this repo to `~/.sigstack`
- [ ] Symlink configs: `./setup.sh`
- [ ] Install MCP servers
- [ ] Set up Tailscale (optional, for multi-device)
- [ ] Install Wispr Flow / Typeless (optional)
- [ ] Install Omi (optional)

---

## Resources

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Ghostty](https://ghostty.org)
- [n8n Documentation](https://docs.n8n.io)
- [Tailscale](https://tailscale.com)

---

**Built with vibes by [@willsigmon](https://github.com/willsigmon)**

*"Act like a healing swarm of nanobots. Find and fix every bug, scrub every infection, optimize every inefficiency until nothing remains but a pristine, customer-delighting experience."*
