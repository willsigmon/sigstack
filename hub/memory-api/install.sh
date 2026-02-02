#!/bin/bash
# Install Sigserve Memory API

set -e

cd "$(dirname "$0")"

echo "=== Installing Sigserve Memory API ==="

# Create virtual environment
if [ ! -d .venv ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate and install dependencies
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create .env from example if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file - please configure your API keys"
fi

# Create data directories
mkdir -p ~/.sigserve

# Make run script executable
chmod +x run.sh

echo ""
echo "=== Installation complete ==="
echo ""
echo "Next steps:"
echo "1. Edit .env with your API keys (OMI_API_KEY, LETTA_API_KEY)"
echo "2. Run: ./run.sh"
echo "3. Access: http://localhost:8100"
echo ""
