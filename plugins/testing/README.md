# Testing Plugin

**AI-powered testing for vibe coders.** Screenshot → Claude Vision → Fix → Repeat.

## THE DEFAULT WORKFLOW

Every feature, change, and bug fix follows this:
1. Make the change
2. Screenshot the result
3. Claude Vision reviews it
4. Fix what Claude finds
5. Repeat until clean

## Skills

### Vision-Based QA (Start Here)

| Skill | Description | For |
|-------|-------------|-----|
| `vibe-coder-qa` | **THE DEFAULT** - Screenshot + Claude Vision | Everything |
| `claude-vision-qa` | Detailed Claude Vision analysis patterns | All platforms |
| `visual-regression-expert` | Applitools, Percy, automated comparison | Web, Mobile |
| `ios-simulator-qa` | Simulator automation, multi-device | iOS |
| `android-emulator-qa` | Emulator automation, ADB commands | Android |

### Traditional Testing

| Skill | Description | Pricing |
|-------|-------------|---------|
| `playwright-expert` | Cross-browser E2E testing | Free |
| `ai-test-gen-expert` | AI-generated test coverage | Varies |
| `security-scanning-expert` | SAST, DAST, SCA scanning | Free (Trivy) |
| `code-coverage-expert` | Coverage gaps, Qodo Cover | Free |
| `mabl-expert` | AI-driven test automation | ~$500/mo |
| `qodo-cover-expert` | AI test generation | Free |

## Quick Start

### iOS QA
```bash
xcrun simctl io booted screenshot ~/Desktop/qa.png
# Drag into Claude: "Review this for issues"
```

### Web QA
```bash
# Via Playwright MCP or ask Claude directly
"Take a screenshot of localhost:3000 and review for bugs"
```

### Android QA
```bash
adb exec-out screencap -p > ~/Desktop/qa.png
# Drag into Claude: "Check this Android screen"
```

## Why Vision QA Works

- You have 5000+ hours of Claude Code experience
- No need to learn test frameworks
- Claude sees what humans see
- Faster iteration than unit tests for UI
- Still catches real bugs
