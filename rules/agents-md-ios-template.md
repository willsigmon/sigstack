# iOS/SwiftUI AGENTS.md Template

> Copy this template to your project root and customize.

---

```markdown
# [App Name]

## Overview
[One sentence: what the app does]

## Tech Stack
- **Platform:** iOS 18+ / Swift 6
- **UI:** SwiftUI (native, no UIKit wrappers)
- **Architecture:** [MVVM / TCA / Native @Observable]
- **Dependencies:** [SPM packages]
- **Build:** XcodeGen → `xcodegen generate`

## Commands

| Action | Command |
|--------|---------|
| Generate Xcode project | `xcodegen generate` |
| Build | `xcodebuild -scheme [Scheme] -destination 'platform=iOS Simulator,name=iPhone 16'` |
| Test | `xcodebuild test -scheme [Scheme]Tests -destination 'platform=iOS Simulator,name=iPhone 16'` |
| Lint | `swiftlint` |
| Format | `swiftformat .` |

## File Structure

```
[AppName]/
├── App/
│   └── [AppName]App.swift
├── Features/
│   └── [Feature]/
│       ├── Views/
│       ├── ViewModels/
│       └── Models/
├── Core/
│   ├── Services/
│   ├── Extensions/
│   └── Utilities/
├── Resources/
│   └── Assets.xcassets
└── Tests/
```

## Code Style

### Naming
- Views: `[Feature]View.swift`
- ViewModels: `[Feature]ViewModel.swift`
- Services: `[Name]Service.swift`

### SwiftUI Patterns
```swift
// Preferred: @Observable (iOS 17+)
@Observable
final class FeatureViewModel {
    var items: [Item] = []
}

// In View
@State private var viewModel = FeatureViewModel()
```

### Concurrency
- Use `async/await` over Combine
- Mark UI-bound classes `@MainActor`
- Use actors for shared mutable state

## Testing
- Unit tests for ViewModels and Services
- Snapshot tests for complex Views
- Test file naming: `[ClassName]Tests.swift`

## Boundaries

### Always Do
- Run `swiftformat` on changed files
- Use `@MainActor` for UI-bound types
- Verify Apple APIs with documentation
- Add unit tests for public methods

### Ask First
- Adding new SPM dependencies
- Changing public API signatures
- Modifying Info.plist
- Updating minimum iOS version

### Never Do
- Use force unwrapping (`!`) without justification
- Commit API keys or secrets
- Skip `@MainActor` on ViewModels
- Use UIKit when SwiftUI suffices
```

---

## Usage

1. Copy template to project root:
   ```bash
   cp ~/dotfiles-hub/claude/rules/agents-md-ios-template.md ./AGENTS.md
   ```

2. Create Claude Code bridge:
   ```bash
   echo "@AGENTS.md" > CLAUDE.md
   ```

3. Customize for your project's specifics.

4. Commit both files:
   ```bash
   git add AGENTS.md CLAUDE.md
   git commit -m "docs: Add AI agent context files"
   ```
