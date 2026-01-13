<div align="center">

# wsigstack

**My personal Claude Code stack for shipping software with AI**

[![Skills](https://img.shields.io/badge/skills-89-blue?style=for-the-badge)](./skills)
[![Commands](https://img.shields.io/badge/commands-24-green?style=for-the-badge)](./commands)
[![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](./LICENSE)

*89 skills • 24 commands • iOS bundle + Apple's hidden docs • Ready to clone*

[Quick Start](#-quick-install) • [The Stack](#-the-stack) • [Skills](#-skill-categories) • [Philosophy](#-philosophy-nanobot-healing-swarm) • [Support](#-support-the-stack)

---

</div>

## The Story

I've been using AI every single day since **November 30, 2022**—the day ChatGPT launched.

In **March 2025**, I discovered vibe coding, and everything changed. I had an idea I felt convicted to build, and that sent me down a rabbit hole of figuring out how to actually ship software with AI as my copilot.

After **~5,000 hours** across Codex, Claude, Lovable, Replit, Cursor, and more, this repo is the distillation of everything that actually stuck.

Now I want to share it with friends and anyone else who's curious about this way of building.

---

## What's Inside

```
wsigstack/
├── 🧠 skills/           89 specialized skills for Claude Code
│   └── ios-bundle/      iOS auto-invoked skills (Sosumi + Ralph Wiggum)
├── ⚡ commands/         24 slash commands (/test, /deploy, /build, etc.)
├── 📏 rules/            LSP mastery, context engineering, iOS patterns
│   └── xcode-intelligence-docs/   20 Apple internal AI docs (extracted)
├── 🔮 brain/            CLAUDE.md + BRAIN network multi-device sync
└── 📚 examples/         Starter templates (skill, MCP config, CLAUDE.md)
```

---

## ⚡ Quick Install

```bash
# Clone and install in 30 seconds
git clone https://github.com/willsigmon/wsigstack.git && cd wsigstack && \
cp -r skills/* ~/.claude/skills/ && \
cp -r commands/* ~/.claude/commands/ && \
mkdir -p ~/.claude/rules && cp -r rules/* ~/.claude/rules/
```

<details>
<summary><strong>📖 Step-by-step version</strong></summary>

```bash
# Clone the repo
git clone https://github.com/willsigmon/wsigstack.git
cd wsigstack

# Copy skills to Claude Code
cp -r skills/* ~/.claude/skills/

# Copy commands
cp -r commands/* ~/.claude/commands/

# Copy rules (auto-loaded by Claude Code)
mkdir -p ~/.claude/rules
cp -r rules/* ~/.claude/rules/

# Optional: Use my CLAUDE.md as a starting point
cp brain/CLAUDE.md ~/.claude/CLAUDE.md
```

</details>

---

## 🍎 iOS Bundle (New!)

**Auto-invoked skills + Apple's hidden AI docs** for iOS/Swift/SwiftUI development.

### What's Included

| Component | Description |
|:----------|:------------|
| `skills/ios-bundle/` | 5 auto-invoked skills (Sosumi + Ralph Wiggum protocol) |
| `rules/xcode-intelligence-docs/` | 20 internal Apple AI docs extracted from Xcode |

### Key Features

- **Auto-activates** on any `.swift` file
- **Combines** Sosumi MCP + local Apple docs for zero-hallucination iOS dev
- **Ralph Wiggum loop**: Iterate until success (max 5 loops per error)

### Quick Commands

```bash
/ios-intel liquid-glass      # Load Liquid Glass patterns
/ios-intel foundation-models # On-device LLM (Apple Intelligence)
/ios-intel app-intents       # AppIntents + Siri
/ios-intel all               # All 20 Apple docs
```

### Extract Apple's Docs (Required for iOS)

```bash
# Run this after installing wsigstack to get Apple's internal AI docs
cp "/Applications/Xcode.app/Contents/PlugIns/IDEIntelligenceChat.framework/Versions/A/Resources/AdditionalDocumentation/"*.md ~/.claude/rules/xcode-intelligence-docs/
```

### iOS 26 Patterns Included

| Topic | APIs |
|:------|:-----|
| Liquid Glass | `.glassEffect()`, `GlassEffectContainer`, `.buttonStyle(.glass)` |
| On-Device LLM | `SystemLanguageModel`, `LanguageModelSession`, `@Generable` |
| App Intents | Visual intelligence, intent modes, `@ComputedProperty` |
| Swift 6.2 | `@concurrent`, actor isolation updates |

---

## 🛠 The Stack

### 🧠 The Brain

| Tool | What It Does | |
|:-----|:-------------|:-:|
| **Claude Code + Opus 4.5** | The brain. CLI-first AI coding. This is where the magic happens. | [↗](https://claude.ai/code) |
| **Omi** | AI wearable + MCP server. Captures context, syncs memories across sessions. | [↗](https://www.omi.me/?ref=WILLSIGMON) |

### 🎤 Voice Input

> *Pick your favorite—I use both and love them equally.*

| Tool | What It Does | |
|:-----|:-------------|:-:|
| **Typeless** | Dictation that actually works. I talk, it types. | [↗](https://www.typeless.com/?via=wsig) |
| **Wispr Flow** | Voice-to-code. Speak your intentions, get code. | [↗](https://wisprflow.ai/r?WILL48) |

### 💻 Terminal

| Tool | What It Does | |
|:-----|:-------------|:-:|
| **Ghostty** | Fast, minimal, GPU-accelerated. Replaced Terminal.app for me entirely. | [↗](https://ghostty.org) |

### 🖥 IDE *(Optional—I rarely need one)*

> *Claude Code in terminal handles 95% of my work. IDEs are for when I need to see things visually.*

| Tool | What It Does | |
|:-----|:-------------|:-:|
| **Cursor Max** | AI-native IDE. $200/mo for unlimited. Great for visual work. | [↗](https://cursor.com) |
| **VS Code Insiders** | Free. Claude extension available. Solid fallback. | [↗](https://code.visualstudio.com/insiders/) |

### ☁️ Infrastructure

| Tool | What It Does | |
|:-----|:-------------|:-:|
| **GitHub** | Code lives here. PRs, issues, Actions. | [↗](https://github.com) |
| **Vercel** | Deploy frontend, serverless functions. Pro plan. | [↗](https://vercel.com) |
| **Supabase** | Postgres + Auth + Realtime + Storage. Pro plan. | [↗](https://supabase.com) |

### 🔌 MCP Servers

| Server | Purpose |
|:-------|:--------|
| **Omi** | Memory persistence across sessions |
| **Sosumi** | Apple documentation (essential for iOS dev) |
| **GitHub** | PR reviews, issues, repo management |
| **SQLite** | Local database queries |
| **Puppeteer** | Browser automation |

---

## 📦 Skill Categories

<div align="center">

| Category | Count | Examples |
|:---------|:-----:|:---------|
| 🍎 **iOS/Swift** | 18 | `ios-build-test`, `swift-fix-compiler-errors`, `swiftui-debug` |
| 🎵 **Audio/ML** | 6 | `audio-fingerprint-expert`, `audio-ml-validator` |
| 🔧 **Debug/Fix** | 12 | `find-bug-root-cause`, `xcode-build-fixer`, `actor-isolation-fixer` |
| 📊 **Knack** | 12 | `knack-reader`, `knack-dashboard-ai`, `knack-realtime` |
| ⚙️ **n8n Workflows** | 5 | `n8n-workflow-builder`, `n8n-ai-features` |
| 🏗 **Architecture** | 8 | `dependency-injection-setup`, `service-consolidator`, `tca-destroyer` |
| 🚀 **DevOps** | 6 | `leavn-final-build-push`, `supabase-project-creator` |
| 🎯 **Specialized** | 17 | `localization-helper`, `widget-extension-builder`, `rss-feed-parser-expert` |

</div>

<details>
<summary><strong>📋 Full skill list (84 skills)</strong></summary>

```
accessibility-auditor      ios-simulator-reset       podcast-sync-architect
actor-isolation-fixer      ios-visual-debug          preferences-store-expert
ai-integration-expert      knack-auth                queue-manager-architect
api-integration-builder    knack-cache-optimizer     reading-plan-expert
audio-feature-validator    knack-dashboard-ai        rss-feed-parser-expert
audio-features-expert      knack-data-cleaner        search-features-expert
audio-fingerprint-expert   knack-devops              season-ui-architect
audio-ml-validator         knack-exporter            sermon-features-expert
bible-feature-expert       knack-filter-sort         service-consolidator
cloudkit-sync-checker      knack-goal-tracker        supabase-project-creator
cloudkit-sync-expert       knack-pagination          swift-binding-fixer
codebase-health-reporter   knack-reader              swift-fix-compiler-errors
community-features-expert  knack-realtime            swiftdata-migration-writer
create-mega-skills-batch   knack-reporting-sync      swiftlint-autofix
dead-code-eliminator       leavn-build-diagnostics   swiftui-best-practices
dependency-injection-setup leavn-commit-machine      swiftui-debug
error-handling-auditor     leavn-final-build-push    swiftui-visual-verifier
feature-dependency-mapper  leavn-language-ux-verify  tca-destroyer
find-bug-root-cause        leavn-ops-aso             tca-removal-audit
guided-mode-expert         leavn-ops-content         test-coverage-analyzer
hti_expert                 leavn-ops-release         userdefaults-migrator
ios-build-test             leavn-ops-research        widget-extension-builder
ios-feature-audit          localization-helper       xcode-build-analyzer
ios-quick-fix              manus-ai-agent            xcode-build-fixer
ios-simulator-debugger     modal-sheet-debugger
navigation-debugger        multi-agent-coordinator
performance-optimizer      n8n-ai-features
performance-profiler       n8n-api-integration
                           n8n-code-expressions
                           n8n-hosting-config
                           n8n-workflow-builder
```

</details>

---

## ⚡ Example Commands

These are the slash commands you get. Type them in Claude Code:

```bash
/test          # Run tests with smart failure analysis
/build         # Build project, fix errors automatically
/deploy        # Deploy to Vercel/production
/analyze       # Deep codebase analysis
/cleanup       # Remove dead code, fix linting
/git           # Smart git operations
/explain       # Explain complex code
/improve       # Suggest improvements
/troubleshoot  # Debug issues systematically
/security-review  # Security audit
```

<details>
<summary><strong>📋 All 24 commands</strong></summary>

| Command | What It Does |
|:--------|:-------------|
| `/test` | Run tests with smart failure analysis |
| `/build` | Build project, fix errors automatically |
| `/deploy` | Deploy to production |
| `/analyze` | Deep codebase analysis |
| `/cleanup` | Remove dead code, fix linting |
| `/design` | UI/UX design assistance |
| `/dev-setup` | Set up development environment |
| `/document` | Generate documentation |
| `/estimate` | Effort estimation |
| `/explain` | Explain complex code |
| `/feedback-triage` | Triage user feedback |
| `/git` | Smart git operations |
| `/improve` | Suggest improvements |
| `/index` | Index codebase |
| `/ios-api` | iOS API integration |
| `/ios26-swiftui` | iOS 26 SwiftUI patterns |
| `/load` | Load context/project |
| `/migrate` | Migration assistance |
| `/playwright-test` | E2E testing |
| `/scan` | Security/code scan |
| `/security-review` | Full security audit |
| `/spawn` | Spawn parallel agents |
| `/swift6-tca` | Swift 6 + TCA patterns |
| `/troubleshoot` | Debug systematically |

</details>

---

## 💡 Pro Tips

<table>
<tr>
<td width="50%">

### 🚀 Speed Tips

- **Use `/spawn`** to run 20+ agents in parallel for complex tasks
- **Check memories first** — `mcp__omi__get_memories` at session start
- **Context at 60%?** — Run `/compact` before it degrades

</td>
<td width="50%">

### 🧠 Workflow Tips

- **Skills > Code** — Check if a skill exists before writing
- **Voice + Terminal** — Dictate intent, let Claude write
- **MCP everything** — If you do it twice, make it an MCP tool

</td>
</tr>
</table>

---

## 🔮 The BRAIN Network

My setup syncs Claude context across multiple machines via Tailscale.

<details>
<summary><strong>📁 Key Files</strong></summary>

| File | Purpose |
|:-----|:--------|
| `CLAUDE.md` | Master instructions that load on every session |
| `BRAIN-NETWORK-SYNC.md` | How the multi-device sync works |
| `yolo-yolox-config.md` | My "nanobot healing swarm" autonomous mode |

</details>

---

## 📚 Starter Templates

The `examples/` folder has templates to get you started:

| Template | Purpose |
|:---------|:--------|
| `skill-template.md` | Blueprint for creating new skills |
| `mcp-config-example.json` | Sample MCP server configuration |
| `CLAUDE-starter.md` | Starter CLAUDE.md for your setup |

---

## 🧠 Adding Your Own Skills

Skills are just markdown files:

```markdown
# Skill Name

## Purpose
What this skill does

## When to Use
- Scenario 1
- Scenario 2

## Instructions
Step by step what Claude should do
```

Save to `~/.claude/skills/` — available immediately, no restart needed.

---

## 🔗 Integrating Omi

Omi is the secret weapon—it captures conversations and creates memories that persist across Claude sessions.

<details>
<summary><strong>📦 Setup Instructions</strong></summary>

```bash
# Clone the Omi MCP server
git clone https://github.com/BasedHardware/omi
cd omi/plugins/mcp
pnpm install && pnpm build
```

Add to your Claude Code MCP config:

```json
{
  "mcpServers": {
    "omi": {
      "command": "node",
      "args": ["/path/to/omi/plugins/mcp/dist/index.js"],
      "env": {
        "OMI_API_KEY": "your-api-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>🛠 Available Tools</strong></summary>

| Tool | What It Does |
|:-----|:-------------|
| `mcp__omi__get_memories` | Retrieve facts Claude knows about you |
| `mcp__omi__create_memory` | Save important context for later |
| `mcp__omi__get_conversations` | Access past conversation transcripts |
| `mcp__omi__get_conversation_by_id` | Deep dive into specific conversations |

</details>

I start every session checking memories. Claude picks up exactly where we left off.

---

## 🔌 Adding More MCP Servers

<details>
<summary><strong>How to add MCP servers</strong></summary>

### 1. Find or Build a Server

Check the [MCP Server Registry](https://github.com/modelcontextprotocol/servers) or build your own.

### 2. Add to Config

```json
{
  "mcpServers": {
    "your-server": {
      "command": "node",
      "args": ["/path/to/server/index.js"],
      "env": {
        "API_KEY": "xxx"
      }
    }
  }
}
```

### 3. Restart Claude Code

New tools appear automatically.

</details>

---

## 🤖 Philosophy: Nanobot Healing Swarm

My `CLAUDE.md` instructs Claude to act as a "healing swarm of nanobots"—find every bug, scrub every infection, optimize every inefficiency.

| Principle | What It Means |
|:----------|:--------------|
| **Tools first** | Check if MCP/skill can handle it before writing code |
| **Parallel agents** | Spawn 20+ agents for complex tasks |
| **Context is attention** | Manage the 60% threshold, use `/compact` |
| **Memory graph** | Use Omi to maintain continuity across sessions |

---

## 📱 What I'm Building

<div align="center">

| | Project | Description |
|:-:|:--------|:------------|
| 🌿 | **[Leavn](https://testflight.apple.com/join/Vz6KSEVf)** | iOS app for faith journeys. SwiftUI, iOS 18+, Swift 6. [Join the TestFlight →](https://testflight.apple.com/join/Vz6KSEVf) |

</div>

---

## 💖 Support the Stack

If this setup helps you ship faster, consider using my affiliate links:

<div align="center">

| | Tool | Link |
|:-:|:-----|:-----|
| 🧠 | **Omi** | [omi.me/?ref=WILLSIGMON](https://www.omi.me/?ref=WILLSIGMON) |
| 🎤 | **Typeless** | [typeless.com/?via=wsig](https://www.typeless.com/?via=wsig) |
| 🗣 | **Wispr Flow** | [wisprflow.ai/r?WILL48](https://wisprflow.ai/r?WILL48) |

</div>

---

## 🌟 Star History

If you find this useful, a star helps others discover it!

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=willsigmon/wsigstack&type=Date)](https://star-history.com/#willsigmon/wsigstack&Date)

</div>

---

## 📬 Connect

<div align="center">

| | |
|:-:|:-:|
| 🌐 | **[willsigmon.media](https://willsigmon.media)** |
| 𝕏 | **[@willsigmon](https://x.com/willsigmon)** |
| 💼 | **[LinkedIn](https://linkedin.com/in/willsigmon)** |
| 🐙 | **[GitHub](https://github.com/willsigmon)** |
| 📧 | **[wjsigmon@me.com](mailto:wjsigmon@me.com)** |

</div>

---

<div align="center">

**MIT License** — Use it, modify it, make it yours.

---

*Built with Claude Code Opus 4.5 and ~5,000 hours of figuring out what actually works.*

</div>
