"""
Letta source connector

Connects to Letta (MemGPT) API to fetch agent memories
and conversation history for cross-session context.
"""

import os
import httpx
from typing import Optional

LETTA_API_BASE = os.getenv("LETTA_API_BASE", "https://api.letta.com")
LETTA_API_KEY = os.getenv("LETTA_API_KEY", "")
LETTA_AGENT_ID = os.getenv("LETTA_AGENT_ID", "agent-52cbb335-2af2-411b-9761-79f62febf329")


def _headers():
    return {
        "Authorization": f"Bearer {LETTA_API_KEY}",
        "Content-Type": "application/json",
    }


async def health_check() -> dict:
    """Check if Letta API is reachable"""
    if not LETTA_API_KEY:
        return {"status": "unconfigured", "error": "LETTA_API_KEY not set"}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{LETTA_API_BASE}/v1/agents/{LETTA_AGENT_ID}",
                headers=_headers(),
                timeout=5.0
            )
            if response.status_code == 200:
                return {"status": "ok", "agent_id": LETTA_AGENT_ID}
            return {"status": "error", "code": response.status_code}
    except Exception as e:
        return {"status": "error", "error": str(e)}


async def get_memories() -> dict:
    """Fetch memory blocks from Letta agent"""
    if not LETTA_API_KEY:
        return {"memories": [], "error": "unconfigured"}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{LETTA_API_BASE}/v1/agents/{LETTA_AGENT_ID}/memory",
                headers=_headers(),
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()

            # Parse memory blocks
            memories = []
            for block in data.get("memory", {}).get("blocks", []):
                memories.append({
                    "label": block.get("label"),
                    "content": block.get("value", ""),
                    "description": block.get("description"),
                })

            return {"memories": memories}
    except Exception as e:
        return {"memories": [], "error": str(e)}


async def search(query: str, limit: int = 20) -> list[dict]:
    """Search Letta conversation history"""
    if not LETTA_API_KEY:
        return []

    results = []

    try:
        async with httpx.AsyncClient() as client:
            # Search conversation history
            response = await client.get(
                f"{LETTA_API_BASE}/v1/agents/{LETTA_AGENT_ID}/messages",
                headers=_headers(),
                params={"limit": 100},  # Get recent messages to search
                timeout=15.0
            )
            response.raise_for_status()
            messages = response.json().get("messages", [])

            for msg in messages:
                content = msg.get("content", "") or msg.get("text", "")
                if isinstance(content, str) and query.lower() in content.lower():
                    results.append({
                        "content": content[:500],  # Truncate long messages
                        "timestamp": msg.get("created_at"),
                        "metadata": {
                            "type": "letta_message",
                            "role": msg.get("role"),
                            "message_id": msg.get("id"),
                        },
                        "relevance": 0.8
                    })

            # Also search memory blocks
            memories = await get_memories()
            for mem in memories.get("memories", []):
                content = mem.get("content", "")
                if query.lower() in content.lower():
                    results.append({
                        "content": content[:500],
                        "timestamp": None,
                        "metadata": {
                            "type": "letta_memory_block",
                            "label": mem.get("label"),
                        },
                        "relevance": 0.9  # Memory blocks are high value
                    })

    except Exception as e:
        pass  # Return empty on error

    return results[:limit]


async def get_guidance() -> Optional[str]:
    """Get current guidance block from Letta agent"""
    memories = await get_memories()
    for mem in memories.get("memories", []):
        if mem.get("label") == "guidance":
            return mem.get("content")
    return None
