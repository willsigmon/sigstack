#!/bin/bash
# Global Bash validator to prevent token blowups and unsafe reads

COMMAND="$@"

BLOCKED="node_modules|\\.env|__pycache__|\\.git/|dist|build|DerivedData|Pods|venv|target/debug|target/release|\\.next|\\.nuxt"

if echo "$COMMAND" | grep -qE "$BLOCKED"; then
  echo "❌ ERROR: Blocked directory pattern detected — command aborted." >&2
  exit 2
fi

# Optional: warn on large or recursive scans
if echo "$COMMAND" | grep -qE "(grep|find|cat|du|tar).* -r"; then
  echo "⚠️  Warning: Recursive scan detected. Consider narrowing your scope or using ripgrep with .gitignore." >&2
fi
