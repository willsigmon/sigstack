---
description: Load Apple's internal iOS 26 AI docs for specific topics
allowed-tools:
  - Read
  - Grep
---

# iOS Intelligence Docs Loader

Load the extracted Xcode AI documentation for iOS 26 development.

## Usage

`/ios-intel <topic>` or just ask about iOS 26 features

## Topics

| Topic | Files to Load |
|-------|---------------|
| `liquid-glass`, `glass`, `ui` | SwiftUI-Implementing-Liquid-Glass-Design.md |
| `foundation-models`, `llm`, `ai` | FoundationModels-Using-on-device-LLM-in-your-app.md |
| `app-intents`, `intents`, `siri` | AppIntents-Updates.md |
| `concurrency`, `swift6`, `async` | Swift-Concurrency-Updates.md |
| `text`, `texteditor`, `rich-text` | SwiftUI-Styled-Text-Editing.md |
| `charts`, `3d` | Swift-Charts-3D-Visualization.md |
| `swiftdata`, `data` | SwiftData-Class-Inheritance.md |
| `visual`, `intelligence` | Implementing-Visual-Intelligence-in-iOS.md |
| `toolbar` | SwiftUI-New-Toolbar-Features.md |
| `webkit`, `webview` | SwiftUI-WebKit-Integration.md |
| `storekit`, `iap` | StoreKit-Updates.md |
| `alarmkit` | SwiftUI-AlarmKit-Integration.md |
| `mapkit` | MapKit-GeoToolbox-PlaceDescriptors.md |
| `accessibility` | Implementing-Assistive-Access-in-iOS.md |
| `attributedstring` | Foundation-AttributedString-Updates.md |
| `widgets` | WidgetKit-Implementing-Liquid-Glass-Design.md |
| `all` | Load all 20 files |

## Base Path

`~/.claude/rules/xcode-intelligence-docs/` or `rules/xcode-intelligence-docs/` in wsigstack

## Instructions

When user asks about iOS 26 features or uses `/ios-intel`:

1. Identify the topic from the table above
2. Read the corresponding file(s)
3. Apply the patterns to their code
4. Reference the official Apple docs links at the bottom of each file

## Example

User: "How do I add Liquid Glass to my buttons?"

1. Read `SwiftUI-Implementing-Liquid-Glass-Design.md`
2. Show `.buttonStyle(.glass)` and `.glassEffect()` patterns
3. Provide complete working example
