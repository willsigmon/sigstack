---
description: Auto-invoked iOS development orchestrator - combines Sosumi + Xcode Intelligence docs
trigger:
  - file_pattern: "*.swift"
  - file_pattern: "project.yml"
  - file_pattern: "*.xcodeproj"
  - file_pattern: "Package.swift"
allowed-tools:
  - mcp__sosumi__searchAppleDocumentation
  - mcp__sosumi__fetchAppleDocumentation
  - Read
  - Grep
  - Glob
  - Bash
---

# iOS Auto - Master Orchestrator

When working on ANY iOS/Swift/SwiftUI code, this skill auto-activates.

## Tool Priority (Ralph Wiggum Style)

```
Loop 1: Check Xcode Intelligence docs (local, instant)
        → ~/dotfiles-hub/claude/rules/xcode-intelligence-docs/
        → OR ~/.claude/rules/xcode-intelligence-docs/

Loop 2: Sosumi search (Apple docs via MCP)
        → mcp__sosumi__searchAppleDocumentation

Loop 3: Sosumi fetch (specific doc page)
        → mcp__sosumi__fetchAppleDocumentation

Loop 4: Web search (fallback for edge cases)
        → WebSearch "site:developer.apple.com"

Loop 5: Build & iterate
        → Attempt → Observe → Learn → Adjust → Repeat
```

## Xcode Intelligence Docs (20 files - Extracted from Apple)

**Base path:** `rules/xcode-intelligence-docs/`

| Topic | File |
|-------|------|
| Liquid Glass | `SwiftUI-Implementing-Liquid-Glass-Design.md` |
| On-Device LLM | `FoundationModels-Using-on-device-LLM-in-your-app.md` |
| App Intents | `AppIntents-Updates.md` |
| Rich Text | `SwiftUI-Styled-Text-Editing.md` |
| WebView | `SwiftUI-WebKit-Integration.md` |
| Toolbars | `SwiftUI-New-Toolbar-Features.md` |
| 3D Charts | `Swift-Charts-3D-Visualization.md` |
| Concurrency | `Swift-Concurrency-Updates.md` |
| SwiftData | `SwiftData-Class-Inheritance.md` |
| Visual Intel | `Implementing-Visual-Intelligence-in-iOS.md` |
| StoreKit | `StoreKit-Updates.md` |
| AlarmKit | `SwiftUI-AlarmKit-Integration.md` |
| MapKit | `MapKit-GeoToolbox-PlaceDescriptors.md` |
| Accessibility | `Implementing-Assistive-Access-in-iOS.md` |
| AttributedString | `Foundation-AttributedString-Updates.md` |
| InlineArray | `Swift-InlineArray-Span.md` |
| WidgetKit Glass | `WidgetKit-Implementing-Liquid-Glass-Design.md` |
| UIKit Glass | `UIKit-Implementing-Liquid-Glass-Design.md` |
| AppKit Glass | `AppKit-Implementing-Liquid-Glass-Design.md` |
| visionOS Widgets | `Widgets-for-visionOS.md` |

## Auto-Actions

### On Any Apple API Question
1. First: Read relevant Xcode Intelligence doc
2. Then: `mcp__sosumi__searchAppleDocumentation` for latest
3. Cross-reference both sources
4. Never guess - verify before implementing

### On Build Error
1. Read error message carefully
2. Check if it's a known iOS 26 pattern change
3. Reference Xcode Intelligence docs for new APIs
4. Use Sosumi for migration guides

## Key iOS 26 Patterns (Quick Reference)

### Liquid Glass
```swift
.glassEffect()
.glassEffect(.regular.tint(.blue).interactive())
.buttonStyle(.glass)
GlassEffectContainer(spacing: 20) { ... }
```

### On-Device LLM
```swift
let model = SystemLanguageModel.default
let session = LanguageModelSession(instructions: "...")
let response = try await session.respond(to: prompt)

@Generable struct Output { var field: String }
try await session.respond(to: prompt, generating: Output.self)
```

### App Intents (iOS 26)
```swift
static let supportedModes: IntentModes = [.background, .foreground(.dynamic)]
@ComputedProperty var value: Type { ... }
@DeferredProperty var expensiveValue: Type { get async throws { ... } }
```
