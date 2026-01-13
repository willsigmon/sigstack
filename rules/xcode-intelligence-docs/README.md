# Xcode Intelligence Docs - Extracted from Apple

> **Extracted:** 2026-01-13 from Xcode.app
> **Location:** `/Applications/Xcode.app/Contents/PlugIns/IDEIntelligenceChat.framework/Versions/A/Resources/AdditionalDocumentation/`

## What This Is

These are Apple's **internal AI context files** that power Xcode's Coding Intelligence. They contain the latest iOS 26/SwiftUI patterns that Apple uses to train their AI assistant.

**We extracted them to use with Claude Code.**

## Files (20 total)

### SwiftUI & UI Design
| File | Description | Relevance |
|------|-------------|-----------|
| `SwiftUI-Implementing-Liquid-Glass-Design.md` | Liquid Glass UI patterns | ⭐⭐⭐ HIGH |
| `SwiftUI-New-Toolbar-Features.md` | New toolbar APIs | ⭐⭐ |
| `SwiftUI-Styled-Text-Editing.md` | Rich text in TextEditor | ⭐⭐⭐ |
| `SwiftUI-WebKit-Integration.md` | Native WebView in SwiftUI | ⭐⭐ |
| `SwiftUI-AlarmKit-Integration.md` | AlarmKit integration | ⭐ |
| `UIKit-Implementing-Liquid-Glass-Design.md` | UIKit Liquid Glass | ⭐ |
| `AppKit-Implementing-Liquid-Glass-Design.md` | macOS Liquid Glass | ⭐ |
| `WidgetKit-Implementing-Liquid-Glass-Design.md` | Widget Liquid Glass | ⭐⭐ |

### AI & Foundation Models
| File | Description | Relevance |
|------|-------------|-----------|
| `FoundationModels-Using-on-device-LLM-in-your-app.md` | On-device LLM APIs | ⭐⭐⭐ CRITICAL |
| `Implementing-Visual-Intelligence-in-iOS.md` | Visual intelligence | ⭐⭐⭐ |

### App Intents & System Integration
| File | Description | Relevance |
|------|-------------|-----------|
| `AppIntents-Updates.md` | Latest AppIntents patterns | ⭐⭐⭐ HIGH |

### Swift & Data
| File | Description | Relevance |
|------|-------------|-----------|
| `Swift-Concurrency-Updates.md` | Swift 6.2 concurrency | ⭐⭐⭐ |
| `Swift-InlineArray-Span.md` | New Swift types | ⭐ |
| `SwiftData-Class-Inheritance.md` | SwiftData patterns | ⭐⭐ |
| `Foundation-AttributedString-Updates.md` | AttributedString updates | ⭐⭐ |

### Charts & Visualization
| File | Description | Relevance |
|------|-------------|-----------|
| `Swift-Charts-3D-Visualization.md` | 3D charts | ⭐⭐ |

### Other Frameworks
| File | Description | Relevance |
|------|-------------|-----------|
| `StoreKit-Updates.md` | In-app purchases | ⭐⭐ |
| `MapKit-GeoToolbox-PlaceDescriptors.md` | MapKit updates | ⭐ |
| `Implementing-Assistive-Access-in-iOS.md` | Accessibility | ⭐⭐ |
| `Widgets-for-visionOS.md` | visionOS widgets | ⭐ |

## How to Use with Claude Code

### Option 1: Reference in CLAUDE.md (Recommended)

```markdown
# Project CLAUDE.md

## iOS 26 Context
@~/dotfiles-hub/claude/rules/xcode-intelligence-docs/SwiftUI-Implementing-Liquid-Glass-Design.md
@~/dotfiles-hub/claude/rules/xcode-intelligence-docs/FoundationModels-Using-on-device-LLM-in-your-app.md
@~/dotfiles-hub/claude/rules/xcode-intelligence-docs/AppIntents-Updates.md
```

### Option 2: Use the Skill

```bash
# In Claude Code session
/ios-intel <topic>

# Examples
/ios-intel liquid-glass
/ios-intel foundation-models
/ios-intel app-intents
```

### Option 3: Direct Read

```
Read ~/dotfiles-hub/claude/rules/xcode-intelligence-docs/SwiftUI-Implementing-Liquid-Glass-Design.md
```

## Refresh Script

When Xcode updates, re-extract:

```bash
cp "/Applications/Xcode.app/Contents/PlugIns/IDEIntelligenceChat.framework/Versions/A/Resources/AdditionalDocumentation/"*.md ~/dotfiles-hub/claude/rules/xcode-intelligence-docs/
```

## Key Patterns for Leavn

### Liquid Glass
```swift
.glassEffect()
.glassEffect(.regular.tint(.blue).interactive())
GlassEffectContainer(spacing: 20) { ... }
.buttonStyle(.glass)
```

### On-Device AI
```swift
let model = SystemLanguageModel.default
let session = LanguageModelSession(instructions: "...")
let response = try await session.respond(to: prompt)

// Guided generation
@Generable struct MyOutput { ... }
try await session.respond(to: prompt, generating: MyOutput.self)
```

### AppIntents
```swift
struct MyIntent: AppIntent {
    static let supportedModes: IntentModes = [.background, .foreground(.dynamic)]
    func perform() async throws -> some IntentResult { ... }
}
```

---

**Source:** [Reverse-Engineering Xcode's Coding Intelligence](https://peterfriese.dev/blog/2025/reveng-xcode-coding-intelligence/)
