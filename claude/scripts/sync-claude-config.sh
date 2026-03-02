#!/bin/bash
# sync-claude-config.sh — Deploy Claude Code config from sigstack to ~/.claude/
# Run on any Sig machine to match the canonical config.
# Usage: ./sync-claude-config.sh [--dry-run]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_SRC="$(dirname "$SCRIPT_DIR")"  # sigstack/claude/
CLAUDE_DST="$HOME/.claude"

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

sync_file() {
    local src="$1" dst="$2"
    if $DRY_RUN; then
        echo "[dry-run] $src → $dst"
    else
        cp "$src" "$dst"
        echo "  ✓ $(basename "$dst")"
    fi
}

echo "Syncing Claude Code config from sigstack..."
echo "  Source: $CLAUDE_SRC"
echo "  Target: $CLAUDE_DST"
echo

# Core config
sync_file "$CLAUDE_SRC/CLAUDE.md" "$CLAUDE_DST/CLAUDE.md"
sync_file "$CLAUDE_SRC/settings.json" "$CLAUDE_DST/settings.json"
sync_file "$CLAUDE_SRC/settings.local.json" "$CLAUDE_DST/settings.local.json"
sync_file "$CLAUDE_SRC/aliases.json" "$CLAUDE_DST/aliases.json"
sync_file "$CLAUDE_SRC/mcp.json" "$CLAUDE_DST/.mcp.json"

# Skills (additive — don't delete existing)
if [ -d "$CLAUDE_SRC/skills" ]; then
    echo
    echo "Syncing skills..."
    rsync -a "$CLAUDE_SRC/skills/" "$CLAUDE_DST/skills/" 2>/dev/null && echo "  ✓ skills synced" || echo "  ⚠ skills dir empty or missing"
fi

# Scripts
if [ -d "$CLAUDE_SRC/scripts" ]; then
    mkdir -p "$CLAUDE_DST/scripts"
    rsync -a "$CLAUDE_SRC/scripts/" "$CLAUDE_DST/scripts/" 2>/dev/null && echo "  ✓ scripts synced" || true
fi

echo
echo "Done. Restart Claude Code for MCP/plugin changes to take effect."
