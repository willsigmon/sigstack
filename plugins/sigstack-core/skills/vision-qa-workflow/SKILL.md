---
name: Vision QA Workflow
description: THE default workflow - screenshot, analyze, fix, repeat
allowed-tools: Read, Edit, Bash, Task
model: sonnet
---

# Vision QA Workflow

**The Sigstack Default. Use for everything.**

## The Golden Rule

> "If you can see it, Claude can QA it."

No test frameworks. No selectors. No flaky tests.
Just screenshots and Claude's vision.

## The Loop

```
┌─────────────────────────────────────────┐
│  1. Make your change                    │
│             ↓                           │
│  2. Screenshot the result               │
│             ↓                           │
│  3. Ask Claude "What's wrong?"          │
│             ↓                           │
│  4. Claude fixes issues found           │
│             ↓                           │
│  5. Repeat until clean                  │
└─────────────────────────────────────────┘
```

## Screenshot Commands

### iOS Simulator
```bash
xcrun simctl io booted screenshot ~/Desktop/screen.png
```

### Android Emulator
```bash
adb exec-out screencap -p > ~/Desktop/screen.png
```

### Web (Playwright)
```typescript
await page.screenshot({ path: 'screen.png', fullPage: true });
```

### macOS App
```bash
screencapture -w ~/Desktop/screen.png
```

## QA Prompts

### General Review
```
"What's wrong with this screen?"
```

### Layout Check
```
"Check alignment, spacing, and hierarchy"
```

### Accessibility
```
"Is this accessible? Check contrast, touch targets, labels"
```

### Dark Mode
```
"Compare light and dark mode screenshots for issues"
```

### Device Matrix
```
"Compare iPhone SE vs iPhone 15 Pro Max screenshots"
```

### Before/After
```
"Here's before and after. Did my change fix the issue?"
```

## Workflow Examples

### New Feature
```
1. Build the feature
2. Screenshot each state (empty, loading, success, error)
3. "Review these states for UX issues"
4. Fix issues found
5. Screenshot again
6. "Verify fixes"
```

### Bug Fix
```
1. Screenshot the bug
2. "What's causing this visual bug?"
3. Fix the code
4. Screenshot again
5. "Is it fixed?"
```

### Design Review
```
1. Screenshot your implementation
2. Also screenshot the design spec
3. "Compare. What doesn't match?"
4. Fix differences
5. Repeat until pixel-perfect
```

## Multi-Device QA

### iOS Device Matrix
```bash
# Boot different simulators
xcrun simctl boot "iPhone SE (3rd generation)"
xcrun simctl boot "iPhone 15 Pro Max"

# Screenshot each
xcrun simctl io "iPhone SE (3rd generation)" screenshot se.png
xcrun simctl io "iPhone 15 Pro Max" screenshot promax.png
```

### Android Sizes
```bash
# Different emulators
emulator -avd Pixel_4 &
emulator -avd Pixel_Fold &

# Screenshot each
adb -s emulator-5554 exec-out screencap -p > pixel4.png
adb -s emulator-5556 exec-out screencap -p > fold.png
```

## Automation

### Pre-Commit QA
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Screenshot current state
xcrun simctl io booted screenshot /tmp/precommit.png

# Ask Claude to review
echo "Review this for obvious issues" | claude -f /tmp/precommit.png
```

### CI Pipeline
```yaml
- name: Visual QA
  run: |
    xcrun simctl io booted screenshot screen.png
    claude "Any visual bugs?" -f screen.png
```

## Why This Works

### Traditional Testing
```
❌ Write test code
❌ Maintain selectors
❌ Fix flaky tests
❌ Miss visual issues
❌ Slow feedback
```

### Vision QA
```
✓ Just screenshot
✓ No code to maintain
✓ Catches visual bugs
✓ Instant feedback
✓ Works on any platform
```

## Pro Tips

### Batch Screenshots
```
Take multiple screenshots in one go:
- Happy path
- Edge cases
- Error states
- Different sizes

Send all to Claude in one message.
```

### Comparison
```
Always keep "before" screenshots.
Compare side-by-side.
Claude spots regressions instantly.
```

### Annotate
```
If something specific is wrong:
"Look at the red button in the top right"

Helps Claude focus.
```

## This Is Your Default

Every feature: Vision QA
Every bug fix: Vision QA
Every refactor: Vision QA
Every PR: Vision QA

No exceptions.

Use when: Always. This is THE workflow.
