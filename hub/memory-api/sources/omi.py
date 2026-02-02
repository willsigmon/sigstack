"""
Omi source connector

Connects to the Omi API to fetch conversations and memories
from the pendant/wearable device.
"""

import os
import httpx
from datetime import datetime, timedelta
from typing import Optional

OMI_API_BASE = "https://api.omi.me/v1"
OMI_API_KEY = os.getenv("OMI_API_KEY", "")
OMI_USER_ID = os.getenv("OMI_USER_ID", "")


def _headers():
    return {
        "Authorization": f"Bearer {OMI_API_KEY}",
        "Content-Type": "application/json",
    }


async def health_check() -> dict:
    """Check if Omi API is reachable"""
    if not OMI_API_KEY:
        return {"status": "unconfigured", "error": "OMI_API_KEY not set"}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{OMI_API_BASE}/memories",
                headers=_headers(),
                params={"limit": 1},
                timeout=5.0
            )
            if response.status_code == 200:
                return {"status": "ok", "latency_ms": response.elapsed.total_seconds() * 1000}
            return {"status": "error", "code": response.status_code}
    except Exception as e:
        return {"status": "error", "error": str(e)}


async def get_memories(limit: int = 50, categories: list[str] = None) -> dict:
    """Fetch memories from Omi"""
    if not OMI_API_KEY:
        return {"memories": [], "error": "unconfigured"}

    params = {"limit": limit}
    if categories:
        params["categories"] = ",".join(categories)

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{OMI_API_BASE}/memories",
                headers=_headers(),
                params=params,
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        return {"memories": [], "error": str(e)}


async def get_conversations(limit: int = 20, days_back: int = 7) -> dict:
    """Fetch recent conversations from Omi"""
    if not OMI_API_KEY:
        return {"conversations": [], "error": "unconfigured"}

    start_date = (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%d")

    params = {
        "limit": limit,
        "start_date": start_date,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{OMI_API_BASE}/conversations",
                headers=_headers(),
                params=params,
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        return {"conversations": [], "error": str(e)}


async def search(query: str, limit: int = 20, days_back: Optional[int] = None) -> list[dict]:
    """Search Omi memories and conversations"""
    results = []

    # Search memories
    memories = await get_memories(limit=limit * 2)
    for mem in memories.get("memories", []):
        content = mem.get("content", "")
        if query.lower() in content.lower():
            results.append({
                "content": content,
                "timestamp": mem.get("created_at"),
                "metadata": {
                    "type": "memory",
                    "category": mem.get("category"),
                    "id": mem.get("id"),
                },
                "relevance": 0.8 if query.lower() in content.lower()[:100] else 0.5
            })

    # Search conversations
    convos = await get_conversations(limit=limit, days_back=days_back or 30)
    for convo in convos.get("conversations", []):
        # Check transcript segments
        for segment in convo.get("transcript", []):
            text = segment.get("text", "")
            if query.lower() in text.lower():
                results.append({
                    "content": text,
                    "timestamp": convo.get("started_at"),
                    "metadata": {
                        "type": "conversation",
                        "conversation_id": convo.get("id"),
                        "speaker": segment.get("speaker"),
                    },
                    "relevance": 0.7
                })

    return results[:limit]


async def create_memory(content: str, category: str = "auto") -> dict:
    """Create a new memory in Omi"""
    if not OMI_API_KEY:
        return {"error": "unconfigured"}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OMI_API_BASE}/memories",
                headers=_headers(),
                json={
                    "content": content,
                    "category": category,
                },
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        return {"error": str(e)}
