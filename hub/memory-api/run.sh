#!/bin/bash
# Run the Sigserve Memory API

cd "$(dirname "$0")"

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Activate venv if it exists
if [ -d .venv ]; then
    source .venv/bin/activate
fi

# Run the server
uvicorn main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8100} --reload
