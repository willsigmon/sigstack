---
name: SwiftUI Codegen Expert
description: AI-powered SwiftUI generation - screenshot to code, design to SwiftUI
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# SwiftUI Codegen Expert

Generate SwiftUI code from designs, screenshots, and descriptions.

## The Vibe Coder Workflow

### Screenshot → SwiftUI
1. Take screenshot of any UI
2. Send to Claude with context
3. Get production SwiftUI code

### Example Prompt
```
Here's a screenshot of a login screen I like.
Create SwiftUI code that matches this design.
Use my existing ColorPalette and Typography styles.
Make it work with my AuthViewModel.
```

## Claude Vision for SwiftUI

### Analyze Existing UI
```
Look at this screenshot of my app.
What SwiftUI components would best recreate this?
Consider:
- Layout hierarchy
- Spacing patterns
- Color usage
- Typography
```

### Design System Extraction
```
Analyze this screenshot and extract:
1. Color palette (as SwiftUI Color extensions)
2. Typography styles (as ViewModifiers)
3. Spacing values (as constants)
4. Component patterns
```

## Code Generation Patterns

### From Figma Description
```swift
// Prompt: "Card with image on left, title + subtitle on right,
//          rounded corners, subtle shadow"

struct ContentCard: View {
    let image: Image
    let title: String
    let subtitle: String

    var body: some View {
        HStack(spacing: 16) {
            image
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 80, height: 80)
                .clipShape(RoundedRectangle(cornerRadius: 12))

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                Text(subtitle)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer()
        }
        .padding()
        .background(.background)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.1), radius: 8, y: 4)
    }
}
```

### Responsive Layouts
```swift
// Prompt: "Grid that's 2 columns on iPhone, 3 on iPad"

struct AdaptiveGrid<Content: View>: View {
    @Environment(\.horizontalSizeClass) var sizeClass
    let content: () -> Content

    var columns: [GridItem] {
        let count = sizeClass == .compact ? 2 : 3
        return Array(repeating: GridItem(.flexible(), spacing: 16), count: count)
    }

    var body: some View {
        LazyVGrid(columns: columns, spacing: 16) {
            content()
        }
    }
}
```

## Integration with Stitch MCP

### Generate from Stitch Design
```
Using the Stitch design at project/screen/123:
Generate SwiftUI code following my codebase patterns.
Use existing:
- Theme.swift for colors
- Typography.swift for fonts
- Components/ for reusable views
```

## Best Practices

### 1. Provide Context
```
My codebase uses:
- @Observable for state
- NavigationStack (not NavigationView)
- ViewModifiers for reusable styling
- Preview macros

Generate code that fits these patterns.
```

### 2. Component Extraction
```
This generated view is too large.
Extract reusable components:
1. HeaderView
2. ContentSection
3. ActionButton

Keep them in the same file as private views.
```

### 3. Accessibility
```
Add accessibility to this generated code:
- VoiceOver labels
- Dynamic Type support
- Reduce Motion support
- Semantic grouping
```

## Iteration Workflow

```
1. Generate initial code from screenshot
2. Preview in Xcode
3. Screenshot the preview
4. Send back: "This doesn't match. The spacing is off."
5. Get refined code
6. Repeat until perfect
```

## Tools That Help

### Sosumi MCP
```
Before generating, check Apple docs for:
- Latest SwiftUI APIs for this component type
- Platform availability
- Preferred patterns
```

### Xcode Previews
```swift
#Preview {
    ContentCard(
        image: Image("sample"),
        title: "Sample Title",
        subtitle: "Sample subtitle text"
    )
    .padding()
}
```

Use when: Converting designs to code, iterating on UI, learning SwiftUI patterns
