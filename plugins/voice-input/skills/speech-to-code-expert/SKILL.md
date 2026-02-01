---
name: Speech-to-Code Expert
description: Voice coding - speech to code, voice commands for development, hands-free programming
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Speech-to-Code Expert

Code with your voice. Perfect for vibe coders.

## The Voice Coding Stack

```
Voice → Transcription → Claude → Code
```

1. **Sled**: Your voice interface to Claude
2. **Whisper/Deepgram**: Transcription
3. **Claude Code**: Understands intent, writes code

## Sled Setup

Your local voice → Claude pipeline.

```bash
cd ~/Developer/sled
./sled start

# Now speak naturally:
# "Create a SwiftUI view for user profile with avatar and name"
```

## Voice Patterns for Coding

### Feature Requests
```
"Add a button to the login screen that says 'Forgot Password'
and navigates to a password reset view"
```

### Bug Fixes
```
"The app crashes when I tap the save button.
Look at the SaveHandler and find the bug"
```

### Refactoring
```
"This function is too long. Break it into smaller functions
that each do one thing"
```

### Questions
```
"Explain how the authentication flow works in this codebase"
```

## Custom Voice Commands

### Sled Commands
```bash
# .sled/commands.yaml
commands:
  build:
    trigger: "build the app"
    action: "xcodebuild -scheme App"

  test:
    trigger: "run tests"
    action: "swift test"

  commit:
    trigger: "commit changes"
    action: "git add -A && git commit -m"
```

## Tips for Voice Coding

### 1. Be Specific About Location
```
❌ "Add a button"
✅ "Add a button below the email field in LoginView.swift"
```

### 2. Describe Visual Outcome
```
❌ "Make it look better"
✅ "Add 16 points of padding, round the corners to 12 pixels,
    and add a subtle shadow"
```

### 3. Name Things Clearly
```
❌ "Create a thing for users"
✅ "Create a UserProfile struct with name, email, and avatar URL"
```

### 4. Reference Existing Code
```
"Make this button look like the primary button in
the design system we already have"
```

## Voice + Claude Vision Workflow

```
1. Voice: "Take a screenshot of the simulator"
2. Voice: "What's wrong with this UI?"
3. [Claude analyzes screenshot]
4. Voice: "Fix the spacing issues Claude found"
5. [Claude makes changes]
6. Voice: "Take another screenshot to verify"
```

## Dictation Tools

### macOS Built-in
```
System Settings → Keyboard → Dictation → On
Press Fn Fn to activate
```

### Whisper.cpp (Local)
```bash
# Fast local transcription
brew install whisper-cpp
whisper-cpp -m models/ggml-base.en.bin -f audio.wav
```

### Deepgram (API)
```python
# Real-time transcription
from deepgram import Deepgram

dg = Deepgram(API_KEY)
# Stream audio for live coding
```

## VS Code Voice Extensions

### Voice Control
- **Voice Control for VS Code**: Basic commands
- **Talon**: Advanced voice coding (programmable)
- **Cursorless**: Structural voice editing

### Talon Example
```talon
# ~/.talon/user/code.talon
save file: key(cmd-s)
new function <user.text>:
    insert("function {text}() {{\n\n}}")
    key(up)
```

## Accessibility Benefits

Voice coding is for everyone:
- RSI prevention/recovery
- Mobility limitations
- Multitasking (pacing while coding)
- Faster for natural language descriptions

## Best Practices

### 1. Use Checkpoints
```
"Before making changes, let's save the current state"
"Now make the change"
"If that didn't work, revert to the checkpoint"
```

### 2. Verify Changes
```
"Read back what you just wrote"
"Take a screenshot and show me"
```

### 3. Iterate
```
"Almost right, but make the font slightly larger"
"Good, now apply the same style to the other buttons"
```

Use when: Hands-free coding, accessibility, natural language development, Sled workflow
