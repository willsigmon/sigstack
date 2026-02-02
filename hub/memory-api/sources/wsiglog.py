"""
wsiglog source connector

Connects to the wsiglog database on tower for conversation history.
wsiglog stores conversations from Limitless, Omi, Zoom, and other sources.

Tower path: /mnt/user/data/claude/wsiglog/data/wsiglog.db
"""

import os
import subprocess
import json
from datetime import datetime, timedelta
from typing import Optional

TOWER_HOST = os.getenv("TOWER_HOST", "root@tower.local")
TOWER_DB_PATH = os.getenv(
    "TOWER_DB_PATH",
    "/mnt/user/data/claude/wsiglog/data/wsiglog.db"
)


def _run_sql(sql: str, timeout: int = 30) -> list[dict]:
    """Execute SQL on tower's wsiglog database via SSH"""
    cmd = ["ssh", TOWER_HOST, f"sqlite3 -json {TOWER_DB_PATH} \"{sql}\""]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout
        )

        if result.returncode != 0:
            return []

        output = result.stdout.strip()
        if not output:
            return []

        return json.loads(output)

    except subprocess.TimeoutExpired:
        return []
    except json.JSONDecodeError:
        return []
    except Exception:
        return []


async def health_check() -> dict:
    """Check if wsiglog on tower is reachable"""
    try:
        result = _run_sql("SELECT COUNT(*) as count FROM conversations", timeout=10)
        if result:
            return {"status": "ok", "conversation_count": result[0].get("count", 0)}
        return {"status": "error", "error": "No response from tower"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


async def get_conversations(
    limit: int = 50,
    days_back: Optional[int] = None,
    source: Optional[str] = None
) -> dict:
    """Get conversations from wsiglog"""
    conditions = []

    if days_back:
        cutoff = (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%d")
        conditions.append(f"started_at >= '{cutoff}'")

    if source:
        conditions.append(f"source = '{source}'")

    where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""

    sql = f"""
        SELECT id, external_id, source, title, summary, transcript,
               participants, duration_seconds, started_at, ended_at, location
        FROM conversations
        {where_clause}
        ORDER BY started_at DESC
        LIMIT {limit}
    """

    result = _run_sql(sql.replace("\n", " "))

    conversations = []
    for row in result:
        conversations.append({
            "id": row.get("id"),
            "external_id": row.get("external_id"),
            "source": row.get("source"),
            "title": row.get("title"),
            "summary": row.get("summary"),
            "transcript": row.get("transcript"),
            "participants": json.loads(row.get("participants") or "[]"),
            "duration_seconds": row.get("duration_seconds"),
            "started_at": row.get("started_at"),
            "ended_at": row.get("ended_at"),
            "location": row.get("location")
        })

    return {"conversations": conversations}


async def search(query: str, limit: int = 20, days_back: Optional[int] = None) -> list[dict]:
    """Search wsiglog conversations"""
    # Simple LIKE search (tower doesn't have FTS set up)
    conditions = [f"(title LIKE '%{query}%' OR transcript LIKE '%{query}%' OR summary LIKE '%{query}%')"]

    if days_back:
        cutoff = (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%d")
        conditions.append(f"started_at >= '{cutoff}'")

    where_clause = " AND ".join(conditions)

    sql = f"""
        SELECT id, source, title, summary, transcript, started_at
        FROM conversations
        WHERE {where_clause}
        ORDER BY started_at DESC
        LIMIT {limit}
    """

    result = _run_sql(sql.replace("\n", " "))

    results = []
    for row in result:
        content = row.get("summary") or row.get("transcript") or row.get("title") or ""
        results.append({
            "content": content[:500],
            "timestamp": row.get("started_at"),
            "metadata": {
                "type": "conversation",
                "source": row.get("source"),
                "title": row.get("title"),
                "id": row.get("id")
            },
            "relevance": 0.8 if query.lower() in (row.get("title") or "").lower() else 0.6
        })

    return results


async def get_sources() -> list[str]:
    """Get list of conversation sources in wsiglog"""
    sql = "SELECT DISTINCT source FROM conversations ORDER BY source"
    result = _run_sql(sql)
    return [row.get("source") for row in result if row.get("source")]
