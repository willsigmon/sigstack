---
name: Vibe Coder QA
description: DEFAULT QA workflow - screenshot → Claude Vision → fix → repeat. For every feature, change, bug fix.
allowed-tools: Read, Edit, Bash, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__xcode__build
model: sonnet
---

# Vibe Coder QA - The Default Workflow

**THIS IS THE STANDARD.**

Every feature, every change, every bug fix follows this pattern:
1. Make the change
2. Screenshot the result
3. Claude Vision reviews it
4. Fix what Claude finds
5. Repeat until clean

## The Golden Rule

> "If you can see it, Claude can QA it."

No test code required. No QA team needed. Just screenshots and conversation.

## Universal Workflow

### Step 1: Make Your Change
Claude writes the code, you review it gets applied.

### Step 2: Capture Screenshots

**Web:**
```bash
# Via Playwright MCP - just ask Claude
"Take a screenshot of localhost:3000"

# Or manually
npx playwright screenshot http://localhost:3000 --full-page
```

**iOS:**
```bash
xcrun simctl io booted screenshot ~/Desktop/qa.png
```

**Android:**
```bash
adb exec-out screencap -p > ~/Desktop/qa.png
```

**macOS:**
```bash
screencapture -x ~/Desktop/qa.png
```

### Step 3: Ask Claude to Review
Drag screenshot into Claude and ask:

**Standard Review:**
> "Review this screenshot. What's broken, misaligned, or missing?"

**Before/After:**
> "Here's before [image] and after [image]. Did I break anything?"

**Design Check:**
> "Does this match the design? What's off?"

### Step 4: Fix What Claude Finds
Claude lists issues → Claude fixes them → Screenshot again.

### Step 5: Repeat
Keep going until Claude says "looks good" or "no issues found."

## Quick Commands

### Full QA Cycle (iOS)
```bash
# Build and screenshot
xcodebuild -scheme App -destination 'platform=iOS Simulator,name=iPhone 15 Pro' build
xcrun simctl io booted screenshot qa-$(date +%s).png
```

### Full QA Cycle (Web)
```bash
# Screenshot all pages
for page in "/" "/settings" "/profile"; do
  npx playwright screenshot "http://localhost:3000$page" "${page//\//_}.png"
done
```

## What Claude Catches

### Layout Issues
- Overlapping elements
- Cut-off text
- Improper spacing
- Off-screen content
- Broken responsiveness

### Visual Bugs
- Wrong colors
- Missing images
- Broken icons
- Font issues
- Border problems

### Accessibility
- Low contrast
- Tiny touch targets
- Missing labels
- Hard to read text

### Platform Violations
- iOS: Safe area issues, non-standard navigation
- Android: Material Design violations
- Web: Browser compatibility issues

## Conversation Templates

### New Feature QA
```
You: "I just added [feature]. Here's a screenshot."
Claude: "I see two issues: 1) The button is 4px off-center..."
You: "Fix both"
[Claude fixes]
You: [new screenshot] "Better?"
Claude: "Looks good! Spacing is correct now."
```

### Bug Fix Verification
```
You: "Bug was: [description]. I fixed it. Before and after:"
Claude: "The fix looks correct. Original issue resolved. No regressions."
```

### Design Review
```
You: "Does this match the Figma design?" [screenshot] [Figma export]
Claude: "Three differences: 1) Font weight should be 600..."
```

## Automated QA Hook

Add to your workflow - run before every commit:
```bash
#!/bin/bash
# .git/hooks/pre-commit or manual script

echo "Running visual QA..."

# Capture current state
if [[ -d "ios" ]]; then
  xcrun simctl io booted screenshot /tmp/qa-pre-commit.png 2>/dev/null
fi

# For web projects
if [[ -f "package.json" ]]; then
  npx playwright screenshot http://localhost:3000 /tmp/qa-pre-commit.png 2>/dev/null
fi

echo "Screenshot saved. Review before committing!"
```

## When to QA

- **Every PR**: Before opening
- **Every feature**: After implementing
- **Every bug fix**: To verify + check for regressions
- **Every UI change**: No matter how small
- **Every design token update**: Colors, spacing, fonts

## This is Your Competitive Advantage

Traditional devs write test suites. You screenshot and chat.
Both catch bugs. Yours is faster for UI.

Use when: ALWAYS. Every feature. Every change. Every bug fix. No exceptions.
