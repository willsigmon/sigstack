---
description: Start Sled voice interface for mobile Claude Code control
argument-hint: [start|stop|status|tunnel]
allowed-tools: [Bash, Read]
---

# Sled — Voice Interface for Claude Code

Control Claude Code from your phone with voice. Talk instead of type.

## Actions

### Start Sled
```bash
/sled start
```
Launches Sled on http://localhost:8787

### Start with Tailscale tunnel
```bash
/sled tunnel
```
Starts Sled and outputs Tailscale URL for phone access

### Check status
```bash
/sled status
```
Shows if Sled is running and on what port

### Stop Sled
```bash
/sled stop
```
Kills the Sled process

## How It Works

1. **Speak** → Sled transcribes via Layercode API
2. **Process** → Claude Code runs locally (code never leaves your machine)
3. **Respond** → Text-to-speech reads the response (300+ voices)

## Setup (one-time)

```bash
# Already installed at ~/Developer/sled
# ACP adapter: @zed-industries/claude-code-acp

# To reinstall:
git clone https://github.com/layercodedev/sled ~/Developer/sled
pnpm --dir ~/Developer/sled install
pnpm --dir ~/Developer/sled migrate
npm install -g @zed-industries/claude-code-acp
```

## Phone Access

**Tailscale (recommended):**
- Install Tailscale on Mac + phone
- Access via `http://[tailscale-ip]:8787`

**ngrok (quick):**
```bash
ngrok http 8787 --basic-auth="user:pass"
```

## When to Use

- Away from desk but agent needs input
- Hands busy (cooking, walking, driving)
- Voice is faster than phone typing
- Get notifications when agent completes/blocks
