#!/bin/bash
# Auto-check for Claude Code updates
CURRENT=$(claude --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
LATEST=$(npm view @anthropic-ai/claude-code version 2>/dev/null)

if [ -n "$LATEST" ] && [ "$CURRENT" != "$LATEST" ]; then
    echo "⚡ Claude Code update available: $CURRENT → $LATEST"
    echo "   Run: npm update -g @anthropic-ai/claude-code"
fi
