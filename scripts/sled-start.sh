#!/bin/bash
# Start Sled voice interface

SLED_DIR="$HOME/Developer/sled"

if [ ! -d "$SLED_DIR" ]; then
    echo "Sled not found. Installing..."
    git clone https://github.com/layercodedev/sled "$SLED_DIR"
    pnpm --dir "$SLED_DIR" install
    pnpm --dir "$SLED_DIR" migrate
fi

echo "Starting Sled on http://localhost:8787"
echo "Access from phone via Tailscale or ngrok"
pnpm --dir "$SLED_DIR" start
