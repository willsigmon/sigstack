# Codex CLI - Vibe Coding Instructions
# Synced from: ~/.claude/rules/evergreen-vibe-rules.md
# Last sync: 2026-01-22

# Evergreen Vibe Rules - Sigstack Network

> **Last Updated:** 2026-01-21 | **Synced:** All Sigstack devices

## LSP-First Development (Dec 2025)

**Claude Code shipped native LSP Dec 20, 2025. USE IT.**

Before Refactoring: LSP findReferences → Map ALL usages → Get approval → Make changes → LSP verify

Core LSP Operations: goToDefinition, findReferences, hover, workspaceSymbol, incomingCalls, outgoingCalls

Never Guess: ❌ "~5 places" ✅ "47 refs in 12 files (LSP)"

## Tool Hierarchy

0. LSP for navigation/refactoring
1. Plugins (30+)
2. MCP tools
3. Skills (89+)
4. Agents (parallel)
5. Manual code

## 🧠 Context Engineering (Dec 2025)

**Attention Budget**: Performance degrades with LENGTH, not difficulty.

| Context % | Status | Action |
|-----------|--------|--------|
| 0-40% | 🟢 Optimal | Full capability |
| 40-60% | 🟡 Caution | Plan handoff |
| 60%+ | 🔴 Degraded | `/compact` or fresh |

**Rules:**
- Front-load critical info in prompts
- Use `head_limit` on Grep
- Spawn agents for research (isolated context)
- Checkpoint before pivots (`/rewind`)

**Commands:** `/context`, `/compact`, `/clear`, `/rewind`, `Esc+Esc`

## 📋 Three-Phase Workflow

**Explore → Execute → Review**

1. **Explore**: Ask questions, read files, map dependencies
2. **Execute**: `/ultrathink` for hard decisions, checkpoint before pivots
3. **Review**: Cross-validate, check requirements, document

## 🔍 Agent File-Reading Rule

> "Summaries are lossy. Read critical files yourself after agents locate them."

- Agent summaries guide WHERE to look
- Direct reads enable attention to extract pair-wise relationships
- 2-3 most critical files → read in main context

## 🔄 Iteration Patterns

**First-Draft Iteration** (for fuzzy requirements):
1. Throwaway branch → let model write freely
2. Observe divergences from mental model
3. Fresh branch with sharpened prompts
4. Synthesize best of both

## 🎨 Design Intentionality

**Anti-slop rules:**
- Exact fonts, not "modern"
- Hex codes, not "nice colors"
- Reference apps/sites
- "Bold maximalism or refined minimalism—never generic middle"

**Test:** Can someone describe the aesthetic in one sentence?

## Code Quality

- Simplicity > cleverness
- Delete unused (LSP confirms safety)
- No premature abstraction

## Architecture

- LSP maps real dependencies
- Red flags: God objects, circular deps
- Use LSP, don't guess

---

## 🔁 Ralph Wiggum Loop (Jan 2026)

Autonomous iteration loops - let Claude retry until "done".

```bash
/ralph-loop "Your task" --max-iterations 50 --completion-promise "DONE"
```

**Philosophy**: Don't aim for perfect first try. Let the loop refine. Failures narrow solution space.

**Best for**: Refactors, batch ops, test coverage, greenfield builds with clear "done" criteria.

**Warning**: Always set `--max-iterations` to prevent infinite loops.

## 🎨 Parallel Agent Canvas (Jan 2026)

**Agor** - Figma-style canvas for agent swarms:
- `npm install -g agor-live && agor init && agor daemon start && agor open`
- Visual spatial canvas with isolated git worktrees
- Zone triggers auto-inject issue/PR context into prompts

**Plural** - Run concurrent Claude sessions in branches:
- `brew tap zhubert/tap && brew install plural`
- Each session gets its own branch

## 📱 Mobile Voice Control (Jan 2026)

**Sled** - Voice interface for Claude Code from your phone:
- Clone from sled.layercode.com → `pnpm install && pnpm start`
- Works with Tailscale tunneling (fits Sigstack network)
- 300+ voice options, hands-free with AirPods

## Token Optimization (Jan 2026)

Tool Search now live - 46.9% token reduction (51K → 8.5K):
- Use `defer_loading: true` on tools you don't need immediately
- token-optimizer-mcp claims 95% reduction via caching/compression

## 🌐 Browser Automation: agent-browser (Jan 2026)

**Replaces Playwright MCP** - Vercel Labs' headless browser CLI for AI agents.

```bash
npm install -g agent-browser && agent-browser install
```

**Core workflow:**
```bash
agent-browser open <url>        # Navigate
agent-browser snapshot -i       # Get elements with refs (@e1, @e2)
agent-browser click @e1         # Interact by ref
agent-browser fill @e2 "text"   # Fill inputs
agent-browser close             # Done
```

**Why agent-browser > Playwright MCP:**
- Deterministic refs from accessibility tree (no flaky selectors)
- 50+ commands via simple CLI
- Session isolation for parallel browsers
- Video recording built-in
- Rust CLI + Node daemon = fast

**Skill:** `/agent-browser` for full command reference

---

## New Skills (2026-01-21)
- `agent-browser` - Headless browser automation CLI
- `claude-code-mobile` - Run Claude Code on phone via Replit
- `remotion-animation` - Professional video animations with Remotion

## New Skills (2025-12-28)
- `session-handoff` - Document state for context reset
- `first-draft-iteration` - Throw-away draft workflow
- `context-engineering` - Attention budget management
- `cross-model-review` - Multi-model QA patterns
- `design-intentionality` - Anti-slop design rules

## New Commands
- `/handoff` - Auto-document session state
- `/checkpoint` - Mark decision points for rewind

---
**Rule:** LSP before refactoring. Context at 60% = handoff time. Read files yourself.

## Modes
- If you say **quick fix** / **fix mode**: minimal explanation, no unrelated refactors.
- If you say **teach mode**: explain using What/Why/How/When/Gotchas/Example.
- If you say **ios review**: structured SwiftUI + Swift 6 concurrency review.

## Role Play
- **Bug Hunter**: reproduce → isolate → root-cause → minimal fix.
- **iOS Architect**: senior review, verify Apple APIs, prefer SwiftUI + Swift 6.
- **Swarm Leader**: decompose and parallelize subtasks, then merge.

