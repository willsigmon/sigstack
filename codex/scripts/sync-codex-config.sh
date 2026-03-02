#!/bin/bash
# sync-codex-config.sh — Deploy Codex CLI config from sigstack to ~/.codex/
# Run on any Sig machine to match the canonical config.
# Usage: ./sync-codex-config.sh [--dry-run]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CODEX_SRC="$(dirname "$SCRIPT_DIR")"  # sigstack/codex/
CODEX_DST="$HOME/.codex"

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

sync_file() {
    local src="$1" dst="$2"
    if $DRY_RUN; then
        echo "[dry-run] $src → $dst"
    else
        mkdir -p "$(dirname "$dst")"
        cp "$src" "$dst"
        echo "  ✓ $(basename "$dst")"
    fi
}

echo "Syncing Codex CLI config from sigstack..."
echo "  Source: $CODEX_SRC"
echo "  Target: $CODEX_DST"
echo

# Core config
sync_file "$CODEX_SRC/config.toml" "$CODEX_DST/config.toml"
sync_file "$CODEX_SRC/instructions.md" "$CODEX_DST/instructions.md"
sync_file "$CODEX_SRC/AGENTS.md" "$CODEX_DST/AGENTS.md"
sync_file "$CODEX_SRC/mcp-config.json" "$CODEX_DST/mcp-config.json"

# Rules
if [ -d "$CODEX_SRC/rules" ]; then
    mkdir -p "$CODEX_DST/rules"
    rsync -a "$CODEX_SRC/rules/" "$CODEX_DST/rules/" 2>/dev/null && echo "  ✓ rules synced" || true
fi

echo
echo "NOTE: mcp-config.json has REDACTED tokens — update manually from 1Password."
echo "Done. Restart Codex for changes to take effect."
