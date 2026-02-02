"""
Local SQLite source connector

Fast local cache with FTS5 full-text search for
quick memory retrieval and persistence.
"""

import os
import sqlite3
import json
from datetime import datetime
from typing import Optional
import asyncio
from contextlib import contextmanager

DB_PATH = os.path.expanduser("~/.sigserve/memory.db")


def _ensure_db():
    """Ensure database and tables exist"""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                source TEXT DEFAULT 'manual',
                category TEXT,
                metadata TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Create FTS5 virtual table for fast full-text search
        conn.execute("""
            CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
                content,
                source,
                category,
                content='memories',
                content_rowid='id'
            )
        """)

        # Triggers to keep FTS in sync
        conn.execute("""
            CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories BEGIN
                INSERT INTO memories_fts(rowid, content, source, category)
                VALUES (new.id, new.content, new.source, new.category);
            END
        """)

        conn.execute("""
            CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories BEGIN
                INSERT INTO memories_fts(memories_fts, rowid, content, source, category)
                VALUES ('delete', old.id, old.content, old.source, old.category);
            END
        """)

        conn.execute("""
            CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories BEGIN
                INSERT INTO memories_fts(memories_fts, rowid, content, source, category)
                VALUES ('delete', old.id, old.content, old.source, old.category);
                INSERT INTO memories_fts(rowid, content, source, category)
                VALUES (new.id, new.content, new.source, new.category);
            END
        """)

        conn.commit()


@contextmanager
def _get_conn():
    """Get a database connection"""
    _ensure_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


async def health_check() -> dict:
    """Check if local database is accessible"""
    try:
        _ensure_db()
        with _get_conn() as conn:
            cursor = conn.execute("SELECT COUNT(*) FROM memories")
            count = cursor.fetchone()[0]
            return {"status": "ok", "memory_count": count, "path": DB_PATH}
    except Exception as e:
        return {"status": "error", "error": str(e)}


async def search(query: str, limit: int = 20) -> list[dict]:
    """Full-text search memories"""
    results = []

    try:
        with _get_conn() as conn:
            # Use FTS5 for fast search
            cursor = conn.execute("""
                SELECT m.id, m.content, m.source, m.category, m.metadata, m.created_at,
                       bm25(memories_fts) as rank
                FROM memories_fts
                JOIN memories m ON memories_fts.rowid = m.id
                WHERE memories_fts MATCH ?
                ORDER BY rank
                LIMIT ?
            """, (query, limit))

            for row in cursor:
                metadata = json.loads(row["metadata"]) if row["metadata"] else {}
                results.append({
                    "content": row["content"],
                    "timestamp": row["created_at"],
                    "metadata": {
                        "type": "local",
                        "id": row["id"],
                        "source": row["source"],
                        "category": row["category"],
                        **metadata
                    },
                    "relevance": 1.0 + row["rank"]  # BM25 returns negative, lower is better
                })

    except sqlite3.OperationalError:
        # FTS might fail on complex queries, fall back to LIKE
        with _get_conn() as conn:
            cursor = conn.execute("""
                SELECT id, content, source, category, metadata, created_at
                FROM memories
                WHERE content LIKE ?
                ORDER BY created_at DESC
                LIMIT ?
            """, (f"%{query}%", limit))

            for row in cursor:
                metadata = json.loads(row["metadata"]) if row["metadata"] else {}
                results.append({
                    "content": row["content"],
                    "timestamp": row["created_at"],
                    "metadata": {
                        "type": "local",
                        "id": row["id"],
                        "source": row["source"],
                        "category": row["category"],
                        **metadata
                    },
                    "relevance": 0.5
                })

    return results


async def store(
    content: str,
    source: str = "manual",
    category: Optional[str] = None,
    metadata: dict = None
) -> dict:
    """Store a new memory"""
    with _get_conn() as conn:
        cursor = conn.execute("""
            INSERT INTO memories (content, source, category, metadata)
            VALUES (?, ?, ?, ?)
        """, (content, source, category, json.dumps(metadata or {})))
        conn.commit()

        return {"id": cursor.lastrowid, "status": "ok"}


async def get_recent(limit: int = 50, source: Optional[str] = None) -> list[dict]:
    """Get recent memories"""
    with _get_conn() as conn:
        if source:
            cursor = conn.execute("""
                SELECT id, content, source, category, metadata, created_at
                FROM memories
                WHERE source = ?
                ORDER BY created_at DESC
                LIMIT ?
            """, (source, limit))
        else:
            cursor = conn.execute("""
                SELECT id, content, source, category, metadata, created_at
                FROM memories
                ORDER BY created_at DESC
                LIMIT ?
            """, (limit,))

        results = []
        for row in cursor:
            metadata = json.loads(row["metadata"]) if row["metadata"] else {}
            results.append({
                "id": row["id"],
                "content": row["content"],
                "source": row["source"],
                "category": row["category"],
                "metadata": metadata,
                "created_at": row["created_at"]
            })

        return results


async def delete(memory_id: int) -> dict:
    """Delete a memory by ID"""
    with _get_conn() as conn:
        conn.execute("DELETE FROM memories WHERE id = ?", (memory_id,))
        conn.commit()
        return {"status": "ok", "deleted": memory_id}
