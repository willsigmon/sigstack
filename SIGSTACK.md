# SIGSTACK

**The Vibe Coder's Operating System for Claude**

*Version 2.0 — February 1, 2026*

---

## Philosophy

Sigstack is for builders who think in outcomes, not syntax. You have 5000+ hours of Claude Code experience but no traditional coding background. You don't need to learn programming—you need Claude to understand your vision and execute it.

### Core Principles

1. **Vision First** — Describe what you want, not how to build it
2. **AI Vision QA** — If you can see it, Claude can QA it
3. **Parallel Everything** — Agent swarms, not sequential waits
4. **Memory Persistence** — Never explain the same thing twice
5. **Token Efficiency** — Spend tokens on creation, not repetition
6. **Voice Native** — Speak your ideas into existence

---

## The Default Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    THE SIGSTACK LOOP                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. DESCRIBE  ──→  What do you want?                      │
│        │                                                    │
│        ▼                                                    │
│   2. BUILD     ──→  Claude writes the code                 │
│        │                                                    │
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

This is **THE** workflow. Every feature. Every bug fix. Every change.

---

## Stack Architecture

### Tier 1: Core Operations
```
sigstack-core     Meta-skills for efficiency and productivity
```

### Tier 2: Build Domains
```
ios-dev           Swift, SwiftUI, Xcode, CloudKit, SwiftData
app-dev           Features, architecture, services, preferences
```

### Tier 3: Create
```
design-tools      AI image, video, audio, UI generation
media             Podcasts, transcription, streaming, analytics
```

### Tier 4: Quality
```
testing           AI Vision QA, Playwright, coverage, security
```

### Tier 5: Intelligence
```
memory-ai         Vector DBs, knowledge graphs, context management
voice-input       Speech-to-code, Sled, transcription APIs
```

### Tier 6: Automation
```
automation        CI/CD, webhooks, Home Assistant, workflows
```

### Tier 7: Work
```
work              Enterprise apps, Knack, HTI integrations
dev-essentials    Multi-agent coordination, email, performance
```

---

## Model Strategy

```
┌──────────────┬─────────────────────────────────────────────┐
│ Model        │ Use For                                     │
├──────────────┼─────────────────────────────────────────────┤
│ Haiku 3.5    │ File search, formatting, simple tasks       │
│ Sonnet 4     │ Code writing, reviews, most work            │
│ Opus 4.5     │ Architecture, complex reasoning, debugging  │
└──────────────┴─────────────────────────────────────────────┘

Default: Sonnet for quality-speed balance
Skills specify model in frontmatter
```

---

## Interface Strategy

```
┌──────────────┬─────────────────────────────────────────────┐
│ Interface    │ Use For                                     │
├──────────────┼─────────────────────────────────────────────┤
│ Claude Code  │ All codebase work (primary)                 │
│ Claude Desktop│ PDFs, images, research                     │
│ API Batch    │ 100+ items, 50% cost savings               │
│ CLI          │ Quick queries, scripting                    │
│ MCP          │ External data (Supabase, GitHub, etc.)     │
└──────────────┴─────────────────────────────────────────────┘

Default: Claude Code with MCP servers enabled
```

---

## Agent Swarm Patterns

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

### Build (4 agents)
```
"Implement new feature"
→ ui-agent
→ logic-agent
→ test-agent
→ docs-agent
```

---

## MCP Priority

```
1. Supabase    → Database queries, no copy-paste
2. GitHub      → PRs, issues, repos directly
3. Memory      → Persistent knowledge graph
4. Playwright  → Browser automation, screenshots
5. Context7    → Library documentation
6. Sosumi      → Apple developer docs
```

---

## Voice Stack

```
Input:   Typeless (daily dictation)
Bridge:  Sled (mobile → Claude Code over Tailscale)
Output:  Code changes, commits, deploys
```

---

## Infrastructure

### Device Mesh (Tailscale)

```
┌──────────────────────────────────────────────────────────────┐
│                    SIGSTACK NETWORK                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Wills-MBA (MacBook Air)          wills-studio (Mac Studio)  │
│    └─ Portable daily driver         └─ Primary build machine │
│    └─ Claude Code sessions          └─ Xcode builds          │
│    └─ Voice input (Typeless)        └─ Leavn development     │
│              │                              │                │
│              └──────────┬───────────────────┘                │
│                         │                                    │
│                    tower (Unraid)                             │
│                      └─ Central data hub                     │
│                      └─ n8n workflows                        │
│                      └─ Home Assistant                       │
│                      └─ BRAIN (wsiglog + Omi)                │
│                      └─ Ollama (local LLM)                   │
│                      └─ Tailscale: 100.119.19.61             │
│                         │                                    │
│              ┌──────────┼───────────────────┐                │
│              │          │                   │                │
│          office-pc    vt-pc              deck                │
│          (pending)   (pending)     (Steam Deck, pending)     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Services on Tower

| Service | Port | Purpose |
|---------|------|---------|
| n8n | — | Workflow automation (n8n.wsig.me) |
| Home Assistant | 8123 | Smart home, desk automation |
| Hub (LLM proxy) | 3030 | OpenAI-compatible router |
| Ollama | 11434 | Local LLM inference |
| BRAIN/wsiglog | — | Memory database layer |
| Omi | — | Conversation ingestion |

### Sync Architecture

```
MBA ──rsync──→ Tower (/mnt/user/data/claude/)
       ↕              ↕ symlinks
  ~/.claude/      MCP Memory Server
  tower-sync/

Schedule: Auto every 5 min + manual push at 9 AM, 2 PM, 6 PM
```

### Domain: sigstack.dev

Email infrastructure via Resend:
- `tips@sigstack.dev` — Newsletter (SigStack Tips)
- `hello@sigstack.dev` — General contact
- `noreply@sigstack.dev` — Transactional
- `news@sigstack.dev` — News aggregation

---

## Memory Architecture

```
┌─────────────────┐
│ Session Memory  │ ← Current conversation
├─────────────────┤
│ Memory MCP      │ ← Facts, preferences, decisions
├─────────────────┤
│ CLAUDE.md       │ ← Project rules (auto-loaded)
├─────────────────┤
│ Skills          │ ← Reusable prompts
├─────────────────┤
│ Checkpoints     │ ← Session handoffs
└─────────────────┘

Never repeat context. Store once, recall forever.
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

Spend tokens:
- Complex reasoning (use Opus)
- Exploration (use agents)
- Quality code (use Sonnet)
```

---

## Daily Rhythm

### Morning (2 min)
```
"Status" → Load context
"Today's focus: [area]" → Set priority
```

### During Work
```
Build → Screenshot → Vision QA → Fix → Repeat
```

### Evening (1 min)
```
"Checkpoint" → Save state for tomorrow
```

---

## Future-Proofing (2026+)

### Emerging Patterns
- **10M token context windows** — Llama 4 and beyond
- **Native multimodal** — Video, audio, 3D in prompts
- **Agentic workflows** — More autonomous, less supervision
- **MCP ecosystem growth** — 1200+ servers and counting

### Sigstack Adapts
- Skills updated as APIs change
- New plugins for emerging tools
- Model selection stays current
- Patterns evolve with capabilities

---

## Quick Reference

### Screenshot QA
```bash
# iOS Simulator
xcrun simctl io booted screenshot screen.png

# Android
adb exec-out screencap -p > screen.png

# Web (Playwright)
await page.screenshot({ path: 'screen.png' });
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

---

## The Sigstack Promise

You describe the outcome.
Claude handles the implementation.
Screenshots verify the result.
Agents parallelize the work.
Memory preserves the knowledge.
Voice captures your ideas.

**Build faster. Ship more. Learn always.**

---

*Sigstack is maintained at /Users/wsig/Developer/sigstack*
*127 skills across 12 plugins*
*Updated: February 1, 2026*
