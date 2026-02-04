# SigStack 3.0 Project Context

## Business Data Edits

When editing service pricing files, always show the before/after values and ask for confirmation before saving changes.

## Repository Management

For repository operations (clone, move, reorganize), always verify the target directory exists and has appropriate permissions before starting.

## Smart Home / IoT

When working with smart home devices (Homey), if a device is offline or unresponsive after 2 attempts, pause and ask the user to check physical device connectivity before continuing.

## User Preferences

### Workflow Style
- Delegation-oriented: Give clear objectives, let Claude execute autonomously
- High trust: Substantial commit-worthy work, not just exploratory coding
- Parallel execution: Prefer spawning multiple agents over serial work
- TodoWrite for state: Use task tracking to survive context resets

### Tool Preferences
- Browser automation heavy: Chrome-in-chrome operations are central to workflow
- Repository management: Clone → organize → targeted config edits
- MCP-first: Check MCP tools before writing code manually
- Haiku/Sonnet only: No Opus (cost optimization)

### Communication Style
- Direct, no fluff - get to the point
- Explain the "why" before executing
- Surface concerns early, push back when needed
- Ask clarifying questions on vague requirements

### Code Standards
- Immutability over mutation
- Many small files > few large files
- 80%+ test coverage target
- Confirm before editing business-critical data (pricing, etc.)
