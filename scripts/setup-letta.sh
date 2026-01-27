#!/bin/bash
# Letta Subconscious Setup Script
# Run this on any device after cloning sigstack

set -e

SIGSTACK_DIR="${SIGSTACK_DIR:-$HOME/sigstack}"

echo "🧠 Setting up Letta Subconscious..."

# Check if sigstack exists
if [ ! -d "$SIGSTACK_DIR" ]; then
    echo "❌ sigstack not found at $SIGSTACK_DIR"
    echo "   Clone it first: git clone https://github.com/willsigmon/sigstack.git ~/sigstack"
    exit 1
fi

# Symlink claude config
if [ -L "$HOME/.claude" ]; then
    echo "✅ ~/.claude already symlinked"
elif [ -d "$HOME/.claude" ]; then
    echo "⚠️  ~/.claude exists as directory, backing up to ~/.claude.bak"
    mv "$HOME/.claude" "$HOME/.claude.bak"
    ln -sf "$SIGSTACK_DIR/claude" "$HOME/.claude"
else
    ln -sf "$SIGSTACK_DIR/claude" "$HOME/.claude"
    echo "✅ Symlinked ~/.claude -> $SIGSTACK_DIR/claude"
fi

# Install plugin dependencies
echo "📦 Installing claude-subconscious dependencies..."
cd "$HOME/.claude/plugins/claude-subconscious"
npm install --silent

# Setup letta config
mkdir -p "$HOME/.letta/claude-subconscious"
ln -sf "$SIGSTACK_DIR/letta/config.json" "$HOME/.letta/claude-subconscious/config.json" 2>/dev/null || true
echo "✅ Letta config linked"

# Add to zshrc if not present
if ! grep -q "LETTA_API_KEY" "$HOME/.zshrc" 2>/dev/null; then
    cat >> "$HOME/.zshrc" << 'EOF'

# Letta Subconscious Memory
export LETTA_API_KEY="sk-let-ZDM3MmEwMzctNGNkNi00OTgwLThkNmMtMTc2ZTg0ZWIwZDA3OjYxZmEwZWViLTI2ZjYtNDYwZS1iYmZkLTZiNzc1Mjk3MTkyZA=="
export LETTA_AGENT_ID="agent-52cbb335-2af2-411b-9761-79f62febf329"
EOF
    echo "✅ Added Letta exports to ~/.zshrc"
else
    echo "✅ Letta exports already in ~/.zshrc"
fi

echo ""
echo "🎉 Setup complete! Run: source ~/.zshrc"
echo ""
echo "Test with:"
echo '  curl -s "https://api.letta.com/v1/agents/" -H "Authorization: Bearer $LETTA_API_KEY" | head -c 100'
