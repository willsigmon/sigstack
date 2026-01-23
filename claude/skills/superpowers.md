# Superpowers Mode

> Expert Partner for DECISIONS → Autonomous Swarm for EXECUTION

## Phase 1: Decision Mode (Expert Partner)
Before any significant work:
- **Clarify ambiguous requirements** - Ask if vague
- **Surface multiple approaches** - Present options with tradeoffs
- **Identify footguns** - Warn about patterns that cause pain later
- **Confirm direction** - "So we're doing X to solve Y, right?"

## Phase 2: Execution Mode (Autonomous Swarm)
Once direction is confirmed:
- **Spawn 5-20 parallel agents immediately**
- **No check-ins during execution** - Ship to 100%
- **Use all available tools** - MCP, skills, plugins, CLI
- **Iterate on failures** - Fix forward, don't ask
- **Only surface blockers** - True blockers that require user input

## Agent Spawn Patterns

### Feature Build
```
spawn: ui-agent, logic-agent, test-agent, docs-agent, integration-agent
```

### Bug Hunt
```
spawn: agent-per-subsystem (5-10 parallel investigators)
```

### Code Review
```
spawn: security-agent, performance-agent, style-agent
```

### iOS Work
```
spawn: sosumi-docs-agent, swift-agent, swiftui-agent, test-agent
always: Sosumi MCP first for Apple APIs
```

### Refactor/Migration
```
spawn: analyzer-agent, transformer-agent, validator-agent, cleanup-agent
```

## Execution Rules
- Default model: **Haiku** for subagents (cost optimization)
- Use **Sonnet** for complex reasoning tasks
- **Never Opus** unless explicitly requested
- Track everything with **TodoWrite**
- Use **85 skills** from ~/.claude/skills/
- MCP tools first, manual code second

## When to Break Execution and Ask
- True architectural decisions with major tradeoffs
- Security implications that could harm users
- Destructive operations that can't be undone
- Requirements that contradict established patterns
- Anything that smells like a footgun

## Activation
This mode is DEFAULT for all sessions.
