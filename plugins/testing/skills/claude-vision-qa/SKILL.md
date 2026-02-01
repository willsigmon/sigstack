---
name: Claude Vision QA
description: Use Claude's vision to QA apps like a human analyst - screenshots, design review, bug detection
allowed-tools: Read, Edit, Bash, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__xcode__build
model: sonnet
---

# Claude Vision QA Expert

Use Claude's vision capabilities to QA your app like a human analyst would.

## Perfect for Vibe Coders
No coding needed to do QA - just take screenshots and ask Claude to analyze them. Claude can see:
- Layout issues
- Alignment problems
- Missing elements
- Accessibility concerns
- Design system violations
- Visual bugs

## Quick QA Workflow

### 1. Capture Screenshot
```bash
# iOS Simulator
xcrun simctl io booted screenshot ~/Desktop/ios-screen.png

# Android Emulator
adb exec-out screencap -p > ~/Desktop/android-screen.png

# Web (Playwright MCP)
# Use browser_take_screenshot tool

# macOS Screenshot
screencapture -x ~/Desktop/mac-screen.png
```

### 2. Ask Claude to Review
Just drag the screenshot into Claude and ask:

**For Bug Detection:**
> "Look at this screenshot of my app. Find any visual bugs, misalignments, or things that look broken."

**For Design Review:**
> "Review this UI design. Is anything off? Are the colors, spacing, and alignment consistent?"

**For Accessibility:**
> "Check this screen for accessibility issues. Are there contrast problems? Missing labels? Touch targets too small?"

**For Comparison:**
> "Here are before/after screenshots. What changed? Did any regressions appear?"

## Automated QA Script

### Capture & Analyze Loop
```bash
#!/bin/bash
# qa-screenshot.sh

# Capture iOS simulator
xcrun simctl io booted screenshot /tmp/qa-screen.png

# Open in Claude Code (drag and drop works)
echo "Screenshot saved to /tmp/qa-screen.png"
echo "Drag into Claude and ask for visual review"
```

### Playwright + Vision
```typescript
import { chromium } from 'playwright';
import Anthropic from '@anthropic-ai/sdk';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000');

// Capture screenshot
const screenshot = await page.screenshot({ fullPage: true });
const base64 = screenshot.toString('base64');

// Send to Claude Vision
const claude = new Anthropic();
const response = await claude.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: [
      { type: "image", source: { type: "base64", media_type: "image/png", data: base64 } },
      { type: "text", text: "You are a QA analyst. Review this webpage screenshot and list any visual issues you find. Be specific about locations." }
    ]
  }]
});

console.log(response.content[0].text);
```

## QA Prompts by Category

### Layout Check
> "Check this screenshot for layout issues: overlapping elements, cut-off text, improper spacing, elements going off screen."

### Responsive Design
> "I took this on iPhone 15 Pro. Does everything look properly sized? Any horizontal scrolling? Text readable?"

### Dark Mode
> "This is dark mode. Check for: hard to read text, missing dark backgrounds, icons not visible, inconsistent colors."

### Form Validation
> "Look at this form. Are error messages visible? Are required fields marked? Is the submit button accessible?"

### Loading States
> "This is during loading. Is there a loading indicator? Is the layout stable? Any flash of unstyled content?"

## Learning Over Time

### Document Patterns
After Claude finds issues, save them:
```markdown
## Known Issue Patterns
- [ ] Button text gets cut off at < 375px width
- [ ] Dark mode: secondary buttons hard to see
- [ ] Long usernames overflow profile card
```

### Create Test Checklist
```markdown
## Visual QA Checklist for Each Screen
1. Light mode screenshot - review
2. Dark mode screenshot - review
3. Small device (iPhone SE) - review
4. Large device (iPad) - review
5. With long text content - review
6. Empty state - review
7. Error state - review
```

## Integration with MCP

### Playwright MCP
Use `mcp__plugin_playwright_playwright__browser_take_screenshot` to capture web pages directly in Claude.

### Xcode MCP
Use `mcp__xcode__build` to build, then capture simulator screenshots.

Use when: Visual bug hunting, design review, accessibility checks, regression testing without code
