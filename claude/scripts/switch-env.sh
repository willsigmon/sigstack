#!/bin/bash
# Switch Claude Code environment to match Vercel environments
# Usage: switch-env.sh [production|preview]

CLAUDE_DIR="$HOME/.claude"
ENV_DIR="$CLAUDE_DIR/environments"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

usage() {
    echo "Usage: $0 [production|preview]"
    echo ""
    echo "Environments:"
    echo "  production  - Production environment (mirrors Vercel Production)"
    echo "  preview     - Preview environment (mirrors Vercel Preview)"
    echo ""
    echo "Current environment: $(cat $CLAUDE_DIR/.current-env 2>/dev/null || echo 'not set')"
    exit 1
}

if [ -z "$1" ]; then
    usage
fi

ENV_NAME="$1"
ENV_FILE="$ENV_DIR/${ENV_NAME}.json"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment '$ENV_NAME' not found at $ENV_FILE"
    exit 1
fi

# Backup current settings
cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup.$(date +%Y%m%d_%H%M%S)"

# Merge environment config with base settings using jq
if command -v jq &> /dev/null; then
    # Get base settings (without env-specific overrides)
    BASE_SETTINGS=$(cat "$SETTINGS_FILE")
    ENV_SETTINGS=$(cat "$ENV_FILE")

    # Merge env variables
    echo "$BASE_SETTINGS" | jq --argjson env "$(echo "$ENV_SETTINGS" | jq '.env')" '.env = (.env // {}) * $env' > "$SETTINGS_FILE.tmp"
    mv "$SETTINGS_FILE.tmp" "$SETTINGS_FILE"

    echo "$ENV_NAME" > "$CLAUDE_DIR/.current-env"
    echo "✓ Switched to '$ENV_NAME' environment"
    echo ""
    echo "Environment variables set:"
    jq '.env' "$SETTINGS_FILE"
else
    echo "Error: jq is required for environment switching"
    echo "Install with: brew install jq"
    exit 1
fi
