#!/bin/bash
# Sync Claude Code conversations to tower.local
# Run manually or add to cron

TOWER_SHARE="//tower.local/appdata/claude-conversations"
LOCAL_DIR="$HOME/.claude/projects"
MOUNT_POINT="/tmp/tower-claude"

# Option 1: rsync over SSH (if SSH works)
# rsync -avz "$LOCAL_DIR/" "root@tower.local:/mnt/user/appdata/claude-conversations/"

# Option 2: Mount SMB share and copy
mkdir -p "$MOUNT_POINT"
mount -t smbfs "$TOWER_SHARE" "$MOUNT_POINT" 2>/dev/null || \
  mount_smbfs "//guest@tower.local/appdata" "$MOUNT_POINT" 2>/dev/null

if mountpoint -q "$MOUNT_POINT" 2>/dev/null || mount | grep -q "$MOUNT_POINT"; then
    rsync -avz "$LOCAL_DIR/" "$MOUNT_POINT/claude-conversations/"
    echo "✅ Synced to tower"
    umount "$MOUNT_POINT"
else
    # Fallback: direct copy to local backup
    BACKUP_DIR="$HOME/.claude/backups/$(date +%Y%m%d)"
    mkdir -p "$BACKUP_DIR"
    cp -r "$LOCAL_DIR"/* "$BACKUP_DIR/"
    echo "⚠️ Tower unavailable, backed up locally to $BACKUP_DIR"
fi
