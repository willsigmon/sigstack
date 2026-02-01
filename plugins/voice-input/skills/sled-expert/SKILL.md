---
name: Sled Expert
description: Sled mobile voice control - voice-to-Claude from your phone, hands-free coding
allowed-tools: Read, Edit, Bash
model: sonnet
---

# Sled Mobile Voice Expert

Control Claude Code from your phone with voice.

## What is Sled?
Sled is your mobile voice interface to Claude. Talk from your phone, Claude responds on your Mac.

## Location
```bash
cd ~/Developer/sled
```

## Quick Start
```bash
# Start Sled server
./start.sh

# Or with specific port
./start.sh --port 8080
```

## Use Cases

### Hands-Free Coding
- Walk around while coding
- Review code with voice
- Quick questions without keyboard
- Accessibility for RSI

### Remote Pairing
- Voice from phone
- Claude types on Mac
- Review results on either device

### On-the-Go Ideas
- Capture coding ideas via voice
- Claude saves them for later
- Works from anywhere on your network

## Voice Commands

### Basic
- "Hey Claude, create a new Swift file for user authentication"
- "Read me the error in the terminal"
- "Run the tests"

### Complex
- "Refactor the login function to use async/await"
- "Add a new endpoint for user profile at /api/profile"
- "Fix the bug where the button doesn't respond"

## Setup

### Network Config
Sled runs on local network. Phone and Mac must be on same WiFi.

### Firewall
May need to allow incoming connections:
```bash
# macOS
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add ~/Developer/sled/sled
```

## Integration with Typeless
Sled uses Typeless for speech-to-text, then sends to Claude.

Use when: Hands-free coding, mobile voice control, accessibility, on-the-go ideas
