#!/bin/bash
# Dotfiles Hub Sync Script
# Usage: ./sync.sh [push|pull]

DOTFILES_DIR="${HOME}/.dotfiles-hub"
REPO_URL="https://github.com/willsigmon/dotfiles-hub.git"

# Clone if not exists
if [ ! -d "$DOTFILES_DIR" ]; then
    git clone "$REPO_URL" "$DOTFILES_DIR"
fi

cd "$DOTFILES_DIR"

case "$1" in
    pull)
        git pull origin main
        echo "✓ Pulled latest dotfiles"
        ;;
    push)
        git add -A
        git commit -m "Update dotfiles $(date +%Y-%m-%d)"
        git push origin main
        echo "✓ Pushed dotfiles"
        ;;
    link)
        # Create symlinks (macOS)
        ln -sf "$DOTFILES_DIR/claude/skills" ~/.claude/skills
        ln -sf "$DOTFILES_DIR/claude/commands" ~/.claude/commands
        ln -sf "$DOTFILES_DIR/claude/scripts" ~/.claude/scripts
        ln -sf "$DOTFILES_DIR/mcp/.mcp-fixed-servers" ~/.mcp-fixed-servers
        # Ensure scripts are executable
        chmod +x ~/.claude/scripts/*.sh 2>/dev/null
        echo "✓ Symlinks created"
        ;;
    *)
        echo "Usage: $0 {pull|push|link}"
        exit 1
        ;;
esac
