#!/bin/bash
SYNC_DIR="$HOME/Mac-Settings-Sync/1code"
REMOTE="wsig@192.168.1.139"
REMOTE_DIR="~/Mac-Settings-Sync/1code"
LOCKFILE="/tmp/1code-sync.lock"

if [ -f "$LOCKFILE" ]; then exit 0; fi
touch "$LOCKFILE"
trap "rm -f $LOCKFILE" EXIT

rsync -avz --delete \
    --exclude '*.db-shm' \
    --exclude '*.db-wal' \
    --exclude '.DS_Store' \
    "$SYNC_DIR/" "$REMOTE:$REMOTE_DIR/" 2>/dev/null

echo "[$(date '+%H:%M:%S')] Synced to Studio" >> /tmp/1code-sync.log
