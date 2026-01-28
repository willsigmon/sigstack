#!/bin/bash
# Bulletproof 1Code Session Sync - MBA side

STUDIO="wsig@wills-studio.local"
LOCAL_DIR="$HOME/Mac-Settings-Sync/1code"
REMOTE_DIR="~/Mac-Settings-Sync/1code"

# Check if Studio is reachable
if ! ping -c1 -W2 wills-studio.local &>/dev/null; then
    exit 0
fi

# Bi-directional sync
rsync -avz --update "$STUDIO:$REMOTE_DIR/claude-sessions/" "$LOCAL_DIR/claude-sessions/" 2>/dev/null
rsync -avz --update "$LOCAL_DIR/claude-sessions/" "$STUDIO:$REMOTE_DIR/claude-sessions/" 2>/dev/null

echo "$(date): 1Code sessions synced" >> ~/.claude/logs/1code-sync.log
