# iOS Skills Bundle

> **Auto-invoked** when working on iOS/Swift/SwiftUI projects
> **Requires:** Sosumi MCP server for Apple docs

## What's Inside

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `ios-auto.md` | Any .swift file | Master orchestrator - combines all iOS tools |
| `ios-intel.md` | `/ios-intel <topic>` | Load Apple's extracted internal docs |
| `ios-sosumi.md` | Apple API questions | MCP wrapper for Apple documentation |
| `ios-ralph-wiggum.md` | Build errors | Iterate-until-success protocol |

## Prerequisites

1. **Sosumi MCP Server** - For Apple documentation access
   ```json
   // In .mcp.json or settings
   {
     "sosumi": {
       "command": "npx",
       "args": ["-y", "@anthropic/sosumi-mcp"]
     }
   }
   ```

2. **Xcode Intelligence Docs** - Extract from your Xcode:
   ```bash
   mkdir -p ~/.claude/rules/xcode-intelligence-docs
   cp "/Applications/Xcode.app/Contents/PlugIns/IDEIntelligenceChat.framework/Versions/A/Resources/AdditionalDocumentation/"*.md ~/.claude/rules/xcode-intelligence-docs/
   ```

## Usage

### Automatic (Recommended)
Just work on any iOS project - the bundle auto-activates on `.swift` files.

### Manual Commands
```bash
/ios-intel liquid-glass      # Load Liquid Glass patterns
/ios-intel foundation-models # Load on-device LLM docs
/ios-intel app-intents       # Load AppIntents updates
/ios-intel concurrency       # Load Swift 6.2 patterns
/ios-intel all               # Load all 20 Apple docs
```

## The iOS Ralph Wiggum Loop

```
1. Check Xcode Intelligence docs (local, instant)
2. Sosumi MCP search (Apple docs, authoritative)
3. Implement with verified patterns
4. Build → Observe → Learn → Adjust
5. Repeat max 5x, then document and move on
```

## Key iOS 26 Patterns

### Liquid Glass
```swift
.glassEffect()
.buttonStyle(.glass)
GlassEffectContainer(spacing: 20) { ... }
```

### On-Device LLM
```swift
let session = LanguageModelSession(instructions: "...")
let response = try await session.respond(to: prompt)
```

### App Intents
```swift
static let supportedModes: IntentModes = [.background, .foreground(.dynamic)]
```

## Refreshing After Xcode Updates

```bash
cp "/Applications/Xcode.app/Contents/PlugIns/IDEIntelligenceChat.framework/Versions/A/Resources/AdditionalDocumentation/"*.md ~/.claude/rules/xcode-intelligence-docs/
```
