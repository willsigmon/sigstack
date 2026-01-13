---
description: iOS-specific Ralph Wiggum iteration protocol
allowed-tools:
  - mcp__sosumi__searchAppleDocumentation
  - mcp__sosumi__fetchAppleDocumentation
  - Read
  - Bash
  - Edit
---

# iOS Ralph Wiggum Protocol

"I'm learnding!" - Iterate until success on iOS development.

## The iOS Loop

```
┌─────────────────────────────────────────────────────────────┐
│  1. Check Xcode Intelligence docs (instant, local)          │
│  2. Sosumi search (Apple docs, authoritative)               │
│  3. Implement with confidence                               │
│  4. Build → Observe errors                                  │
│  5. Error? → Back to step 1 with new info                   │
│  6. Success? → Verify patterns match iOS 26 best practices  │
└─────────────────────────────────────────────────────────────┘
```

## Error Response Matrix

| Error Type | Loop 1 | Loop 2 | Loop 3 |
|------------|--------|--------|--------|
| Unknown API | Xcode docs | Sosumi | Web search |
| Deprecated API | Migration guide | Sosumi | Check iOS version |
| Actor isolation | Concurrency docs | Add @MainActor | Restructure |
| SwiftUI preview crash | Simplify preview | Check bindings | Mock data |
| Build fail | Read full error | Check imports | Clean build |

## iOS-Specific Iteration Limits

| Issue | Max Attempts | Then |
|-------|--------------|------|
| Compiler error | 5 | Different approach |
| Preview crash | 3 | Skip preview, test on sim |
| Actor isolation | 4 | Audit full call chain |
| API not found | 2 | Check iOS version requirement |
| Build timeout | 2 | Clean DerivedData |

## Quick Fixes by Error Pattern

### "Cannot find X in scope"
```
Loop 1: Check import statements
Loop 2: Sosumi search for framework
Loop 3: Check iOS availability
```

### "Actor-isolated property"
```
Loop 1: Read Swift-Concurrency-Updates.md
Loop 2: Add @MainActor or await
Loop 3: Restructure to async context
```

### "Type X has no member Y"
```
Loop 1: Check API changed in iOS 26
Loop 2: Sosumi for current signature
Loop 3: Check if renamed/moved
```

## Success Criteria

iOS task complete when:
- [ ] Builds without warnings
- [ ] Runs on simulator
- [ ] Uses iOS 26 patterns (if targeting iOS 26)
- [ ] No deprecated API warnings
- [ ] Matches Xcode Intelligence doc patterns
