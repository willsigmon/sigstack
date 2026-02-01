---
name: Visual Regression Expert
description: AI visual testing - Applitools, Percy, screenshot comparison, visual QA like human analysts
allowed-tools: Read, Edit, Bash, WebFetch, mcp__plugin_playwright_playwright__browser_take_screenshot
model: sonnet
---

# Visual Regression & AI Visual QA Expert

Test visuals like a human QA analyst using AI-powered tools.

## Philosophy for Vibe Coders
You don't need to manually check every pixel. Let AI tools "see" your app and catch visual bugs automatically - same way you'd have a QA person review screenshots.

## Top Tools

### Applitools (AI-Powered)
- **Visual AI** understands layouts, not just pixels
- Ignores irrelevant differences
- Cross-browser/device testing
- $Free tier available$

### Percy (BrowserStack)
- Simple snapshot comparison
- GitHub integration
- Review workflow built-in
- $Starting ~$99/mo$

### Chromatic (Storybook)
- Component visual testing
- Storybook integration
- UI review workflow
- $Free for open source$

## Applitools Setup

### Web (Playwright)
```typescript
import { test } from '@playwright/test';
import { Eyes, Target } from '@applitools/eyes-playwright';

const eyes = new Eyes();

test('homepage visual check', async ({ page }) => {
  await eyes.open(page, 'My App', 'Homepage');
  await page.goto('/');

  // AI checks entire page
  await eyes.check('Full Page', Target.window().fully());

  // Check specific component
  await eyes.check('Header', Target.region('#header'));

  await eyes.close();
});
```

### iOS (XCUITest)
```swift
import EyesXCUI

func testAppVisuals() {
    let eyes = Eyes()
    eyes.open(withApplicationName: "MyApp", testName: "Main Screen")

    // Screenshot entire screen
    eyes.check(withTag: "Home Screen", andSettings: Target.window())

    eyes.close()
}
```

### React Native
```javascript
import { Eyes, Target } from '@applitools/eyes-react-native';

const eyes = new Eyes();

test('home screen', async () => {
  await eyes.open(driver, 'MyApp', 'Home');
  await eyes.check('Home Screen', Target.window());
  await eyes.close();
});
```

## Screenshot Analysis Pattern

### Capture → Compare → Learn
```
1. Take screenshot (baseline)
2. Make changes
3. Take new screenshot
4. AI compares, ignoring irrelevant diffs
5. Human reviews actual issues
6. System learns what matters
```

## Claude Vision for QA

### Screenshot Analysis
```typescript
// Take screenshot via MCP
const screenshot = await playwright.screenshot({ fullPage: true });

// Send to Claude for analysis
const analysis = await claude.messages.create({
  model: "claude-3-5-sonnet-20241022",
  messages: [{
    role: "user",
    content: [
      { type: "image", source: { type: "base64", data: screenshot } },
      { type: "text", text: "Analyze this UI for: accessibility issues, alignment problems, missing elements, broken layouts. Be specific about locations." }
    ]
  }]
});
```

### Comparison Analysis
```typescript
// Compare two screenshots
const analysis = await claude.messages.create({
  messages: [{
    role: "user",
    content: [
      { type: "image", source: { type: "base64", data: beforeScreenshot } },
      { type: "image", source: { type: "base64", data: afterScreenshot } },
      { type: "text", text: "Compare these two screenshots. What changed? Are any changes bugs or regressions?" }
    ]
  }]
});
```

## Simulator Screenshots

### iOS Simulator
```bash
# Capture simulator screen
xcrun simctl io booted screenshot screenshot.png
```

### Android Emulator
```bash
adb exec-out screencap -p > screenshot.png
```

## Vibe Coder Workflow

1. **Build feature** → Claude writes code
2. **Screenshot** → Playwright/Simulator captures
3. **AI Review** → Send to Claude Vision or Applitools
4. **Fix issues** → Claude fixes what AI found
5. **Repeat** → Until AI says it looks good

Use when: Visual bug detection, cross-browser testing, design system compliance, UI regression
