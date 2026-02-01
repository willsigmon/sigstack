# Claude Subconscious - Cross-Device Setup

## Quick Install (New Device)

```bash
# 1. Clone sigstack
git clone https://github.com/willsigmon/sigstack.git ~/sigstack

# 2. Symlink claude config
ln -sf ~/sigstack/claude ~/.claude

# 3. Install plugin dependencies
cd ~/.claude/plugins/claude-subconscious && npm install

# 4. Add to shell (zsh)
cat >> ~/.zshrc << 'EOF'

# Letta Subconscious Memory
export LETTA_API_KEY="sk-let-ZDM3MmEwMzctNGNkNi00OTgwLThkNmMtMTc2ZTg0ZWIwZDA3OjYxZmEwZWViLTI2ZjYtNDYwZS1iYmZkLTZiNzc1Mjk3MTkyZA=="
export LETTA_AGENT_ID="agent-52cbb335-2af2-411b-9761-79f62febf329"
EOF

# 5. Create letta config dir
mkdir -p ~/.letta/claude-subconscious
ln -sf ~/sigstack/letta/config.json ~/.letta/claude-subconscious/config.json

# 6. Source and test
source ~/.zshrc
```

## What This Provides

- **Cross-session memory** via Letta Subconscious agent
- **Shared context** across all devices (mba, tower, vt-pc, deck)
- **Automatic hooks**: SessionStart, UserPromptSubmit, Stop

## Verify Setup

```bash
# Test Letta connection
curl -s -X GET "https://api.letta.com/v1/agents/" \
  -H "Authorization: Bearer $LETTA_API_KEY" | head -c 200
```

## Devices

| Hostname | Device | Role | Status |
|----------|--------|------|--------|
| **Wills-MBA** | MacBook Air | Portable daily driver | ✅ Primary |
| **wills-studio** | Mac Studio | Primary build machine | ✅ Active |
| **tower** | Unraid NAS | Central hub, services | Pending |
| **office-pc** | Desktop PC | Secondary workstation | Pending |
| **vt-pc** | Desktop | TBD | Pending |
| **deck** | Steam Deck | Portable | Pending |
