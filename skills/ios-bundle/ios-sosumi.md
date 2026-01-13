---
description: Apple documentation lookup via Sosumi MCP
allowed-tools:
  - mcp__sosumi__searchAppleDocumentation
  - mcp__sosumi__fetchAppleDocumentation
---

# iOS Sosumi - Apple Docs Oracle

**Never guess Apple APIs. Always verify.**

## Usage

Automatic - triggers on any Apple API question.

## MCP Tools

### Search
```
mcp__sosumi__searchAppleDocumentation("SwiftUI glassEffect")
mcp__sosumi__searchAppleDocumentation("LanguageModelSession")
mcp__sosumi__searchAppleDocumentation("AppIntent visual intelligence")
```

### Fetch
```
mcp__sosumi__fetchAppleDocumentation(<url-from-search>)
```

## Workflow

1. **Question about Apple API?**
   - First check Xcode Intelligence docs (local)
   - Then Sosumi search for official docs
   - Cross-reference both

2. **Implementing new feature?**
   - Sosumi search for framework overview
   - Fetch specific API docs
   - Check for iOS version requirements

3. **Build error with Apple API?**
   - Sosumi search for migration guide
   - Check for deprecated APIs
   - Find replacement patterns

## Common Searches

| Need | Search Term |
|------|-------------|
| SwiftUI view modifier | "SwiftUI [modifier name]" |
| Concurrency pattern | "Swift async [pattern]" |
| Framework overview | "[Framework] getting started" |
| Migration guide | "[Framework] migration iOS 26" |
| API availability | "[API name] availability" |
