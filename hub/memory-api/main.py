"""
Sigserve Unified Memory API

Central hub for querying all memory sources:
- Omi (conversations, memories from pendant)
- Letta (agent memories, cross-session context)
- Knowledge Graph (MCP memory server)
- Local SQLite (fast cache + full-text search)

Run: uvicorn main:app --host 0.0.0.0 --port 8100 --reload
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from pathlib import Path
import asyncio
import sqlite3
import json

from sources import omi, letta, knowledge_graph, local_db

# Extended DB path for SIGSERVE
SIGSERVE_DB = Path.home() / ".sigserve" / "memory.db"

app = FastAPI(
    title="Sigserve Memory API",
    description="Unified memory hub for sigstack",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str
    sources: list[str] = ["all"]  # omi, letta, graph, local, all
    limit: int = 20
    days_back: Optional[int] = None


class SearchResult(BaseModel):
    source: str
    content: str
    timestamp: Optional[datetime] = None
    metadata: dict = {}
    relevance: float = 1.0


class UnifiedResponse(BaseModel):
    query: str
    total_results: int
    results: list[SearchResult]
    sources_queried: list[str]
    query_time_ms: float


@app.get("/")
async def root():
    return {
        "service": "Sigserve Memory API",
        "version": "2.0.0",
        "description": "The Autonomous Creative Engine - Unified memory hub",
        "endpoints": {
            # Search & Query
            "/search": "Unified search across all sources",
            "/oracle": "Natural language questions about your digital life",
            "/patterns": "Behavioral pattern analysis",

            # Sources
            "/sources": "List available memory sources",
            "/health": "Health check",

            # Watchers
            "/watcher/status": "SIGSERVE watcher daemon status",

            # Omi
            "/omi/memories": "Omi pendant memories",
            "/omi/conversations": "Omi conversations",

            # Letta
            "/letta/memories": "Letta agent memories",
            "/letta/search": "Search Letta history",

            # Knowledge Graph
            "/graph/search": "Knowledge graph search",
            "/graph/entities": "Get entities",

            # Action Queue
            "/queue": "Pending autonomous actions",
            "/queue/{id}/approve": "Approve an action",
            "/queue/{id}/reject": "Reject an action",

            # Ingest
            "/ingest": "Ingest new memory",
        }
    }


@app.get("/health")
async def health():
    """Check health of all memory sources"""
    statuses = await asyncio.gather(
        omi.health_check(),
        letta.health_check(),
        knowledge_graph.health_check(),
        local_db.health_check(),
        return_exceptions=True
    )

    sources = ["omi", "letta", "graph", "local"]
    health_status = {}

    for source, status in zip(sources, statuses):
        if isinstance(status, Exception):
            health_status[source] = {"status": "error", "error": str(status)}
        else:
            health_status[source] = {"status": "ok", **status}

    all_ok = all(
        h.get("status") == "ok"
        for h in health_status.values()
    )

    return {
        "status": "healthy" if all_ok else "degraded",
        "sources": health_status,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/sources")
async def list_sources():
    """List available memory sources and their capabilities"""
    return {
        "sources": [
            {
                "name": "omi",
                "description": "Omi pendant - conversations and extracted memories",
                "capabilities": ["conversations", "memories", "search"],
            },
            {
                "name": "letta",
                "description": "Letta agents - cross-session context and guidance",
                "capabilities": ["memories", "search", "agents"],
            },
            {
                "name": "graph",
                "description": "Knowledge graph - entities and relationships",
                "capabilities": ["entities", "relations", "search"],
            },
            {
                "name": "local",
                "description": "Local SQLite - fast cache with full-text search",
                "capabilities": ["cache", "fts", "search"],
            },
        ]
    }


@app.post("/search", response_model=UnifiedResponse)
async def unified_search(request: SearchRequest):
    """Search across all memory sources"""
    start_time = datetime.now()

    sources_to_query = request.sources
    if "all" in sources_to_query:
        sources_to_query = ["omi", "letta", "graph", "local"]

    # Query all sources in parallel
    tasks = []
    for source in sources_to_query:
        if source == "omi":
            tasks.append(omi.search(request.query, request.limit, request.days_back))
        elif source == "letta":
            tasks.append(letta.search(request.query, request.limit))
        elif source == "graph":
            tasks.append(knowledge_graph.search(request.query, request.limit))
        elif source == "local":
            tasks.append(local_db.search(request.query, request.limit))

    results_by_source = await asyncio.gather(*tasks, return_exceptions=True)

    # Flatten and sort results
    all_results = []
    for source, results in zip(sources_to_query, results_by_source):
        if isinstance(results, Exception):
            continue  # Skip failed sources
        for r in results:
            all_results.append(SearchResult(
                source=source,
                content=r.get("content", ""),
                timestamp=r.get("timestamp"),
                metadata=r.get("metadata", {}),
                relevance=r.get("relevance", 1.0)
            ))

    # Sort by relevance, then recency
    all_results.sort(key=lambda x: (-x.relevance, x.timestamp or datetime.min), reverse=True)
    all_results = all_results[:request.limit]

    query_time = (datetime.now() - start_time).total_seconds() * 1000

    return UnifiedResponse(
        query=request.query,
        total_results=len(all_results),
        results=all_results,
        sources_queried=sources_to_query,
        query_time_ms=round(query_time, 2)
    )


# === Omi endpoints ===

@app.get("/omi/memories")
async def get_omi_memories(
    limit: int = Query(default=50, le=100),
    categories: Optional[str] = None
):
    """Get memories from Omi"""
    cat_list = categories.split(",") if categories else []
    return await omi.get_memories(limit=limit, categories=cat_list)


@app.get("/omi/conversations")
async def get_omi_conversations(
    limit: int = Query(default=20, le=50),
    days_back: int = Query(default=7, le=30)
):
    """Get recent conversations from Omi"""
    return await omi.get_conversations(limit=limit, days_back=days_back)


# === Letta endpoints ===

@app.get("/letta/memories")
async def get_letta_memories():
    """Get memories from Letta agent"""
    return await letta.get_memories()


@app.get("/letta/search")
async def search_letta(
    query: str,
    limit: int = Query(default=10, le=50)
):
    """Search Letta conversation history"""
    return await letta.search(query, limit)


# === Knowledge Graph endpoints ===

@app.get("/graph/search")
async def search_graph(query: str):
    """Search the knowledge graph"""
    return await knowledge_graph.search(query, limit=20)


@app.get("/graph/entities")
async def get_entities(names: Optional[str] = None):
    """Get entities from the knowledge graph"""
    name_list = names.split(",") if names else None
    return await knowledge_graph.get_entities(name_list)


# === Ingest endpoint ===

class IngestRequest(BaseModel):
    content: str
    source: str = "manual"
    category: Optional[str] = None
    metadata: dict = {}


@app.post("/ingest")
async def ingest_memory(request: IngestRequest):
    """Ingest a new memory into the system"""
    # Store in local DB for fast access
    local_result = await local_db.store(
        content=request.content,
        source=request.source,
        category=request.category,
        metadata=request.metadata
    )

    # Also store in Omi if it's a significant memory
    if request.category and request.category != "ephemeral":
        try:
            await omi.create_memory(
                content=request.content,
                category=request.category
            )
        except Exception:
            pass  # Omi storage is best-effort

    return {
        "status": "stored",
        "id": local_result.get("id"),
        "stored_in": ["local", "omi"] if request.category else ["local"]
    }


# === Watcher Status endpoints ===

@app.get("/watcher/status")
async def watcher_status():
    """Get status of all SIGSERVE watchers"""
    if not SIGSERVE_DB.exists():
        return {"error": "SIGSERVE database not found"}

    with sqlite3.connect(SIGSERVE_DB) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.execute("""
            SELECT watcher_name, last_run, last_success, items_captured, last_error, status
            FROM watcher_status
        """)

        watchers = {}
        for row in cursor:
            watchers[row["watcher_name"]] = {
                "status": row["status"],
                "last_run": row["last_run"],
                "last_success": row["last_success"],
                "items_captured": row["items_captured"],
                "last_error": row["last_error"]
            }

        # Get capture counts
        counts = {}
        for table, name in [
            ("screens", "screen_captures"),
            ("browser_history", "browser_entries"),
            ("git_activity", "git_commits"),
            ("memories", "memories")
        ]:
            try:
                cursor = conn.execute(f"SELECT COUNT(*) FROM {table}")
                counts[name] = cursor.fetchone()[0]
            except sqlite3.OperationalError:
                counts[name] = 0

        return {
            "watchers": watchers,
            "counts": counts,
            "database_path": str(SIGSERVE_DB)
        }


# === Oracle endpoint ===

class OracleRequest(BaseModel):
    question: str
    sources: list[str] = ["all"]  # screens, browser, git, memories, omi, letta, all
    limit: int = 20
    days_back: Optional[int] = 7


class OracleResponse(BaseModel):
    question: str
    answer: str
    evidence: list[dict]
    sources_queried: list[str]
    query_time_ms: float


@app.post("/oracle", response_model=OracleResponse)
async def oracle(request: OracleRequest):
    """
    Ask natural language questions about your digital life.

    Examples:
    - "What was I working on last Tuesday?"
    - "When did I last discuss auth with anyone?"
    - "What patterns do you see in my work habits?"
    - "Summarize my conversations from yesterday"
    """
    start_time = datetime.now()

    # Determine sources to query
    sources_to_query = request.sources
    if "all" in sources_to_query:
        sources_to_query = ["screens", "browser", "git", "memories", "omi", "letta"]

    evidence = []

    # Search local SIGSERVE database
    if SIGSERVE_DB.exists():
        with sqlite3.connect(SIGSERVE_DB) as conn:
            conn.row_factory = sqlite3.Row
            query_lower = request.question.lower()

            # Extract keywords for searching
            keywords = [w for w in query_lower.split() if len(w) > 3]
            if not keywords:
                keywords = [query_lower]

            # Search screens
            if "screens" in sources_to_query:
                try:
                    for keyword in keywords[:3]:
                        cursor = conn.execute("""
                            SELECT s.id, s.ocr_text, s.app_name, s.window_title, s.timestamp
                            FROM screens_fts
                            JOIN screens s ON screens_fts.rowid = s.id
                            WHERE screens_fts MATCH ?
                            LIMIT ?
                        """, (keyword, request.limit // 3))

                        for row in cursor:
                            evidence.append({
                                "source": "screen",
                                "content": row["ocr_text"][:500] if row["ocr_text"] else "",
                                "metadata": {
                                    "app": row["app_name"],
                                    "window": row["window_title"],
                                    "timestamp": row["timestamp"]
                                }
                            })
                except sqlite3.OperationalError:
                    pass

            # Search browser history
            if "browser" in sources_to_query:
                try:
                    for keyword in keywords[:3]:
                        cursor = conn.execute("""
                            SELECT b.id, b.url, b.title, b.domain, b.browser, b.visit_time
                            FROM browser_fts
                            JOIN browser_history b ON browser_fts.rowid = b.id
                            WHERE browser_fts MATCH ?
                            LIMIT ?
                        """, (keyword, request.limit // 3))

                        for row in cursor:
                            evidence.append({
                                "source": "browser",
                                "content": f"{row['title']} - {row['url']}",
                                "metadata": {
                                    "domain": row["domain"],
                                    "browser": row["browser"],
                                    "visit_time": row["visit_time"]
                                }
                            })
                except sqlite3.OperationalError:
                    pass

            # Search git activity
            if "git" in sources_to_query:
                try:
                    for keyword in keywords[:3]:
                        cursor = conn.execute("""
                            SELECT g.id, g.repo, g.branch, g.sha, g.message, g.files_changed, g.timestamp
                            FROM git_fts
                            JOIN git_activity g ON git_fts.rowid = g.id
                            WHERE git_fts MATCH ?
                            LIMIT ?
                        """, (keyword, request.limit // 3))

                        for row in cursor:
                            evidence.append({
                                "source": "git",
                                "content": f"{row['message']} ({row['sha'][:8]})",
                                "metadata": {
                                    "repo": row["repo"],
                                    "branch": row["branch"],
                                    "files": row["files_changed"],
                                    "timestamp": row["timestamp"]
                                }
                            })
                except sqlite3.OperationalError:
                    pass

            # Search memories
            if "memories" in sources_to_query:
                try:
                    for keyword in keywords[:3]:
                        cursor = conn.execute("""
                            SELECT m.id, m.content, m.source, m.category, m.created_at
                            FROM memories_fts
                            JOIN memories m ON memories_fts.rowid = m.id
                            WHERE memories_fts MATCH ?
                            LIMIT ?
                        """, (keyword, request.limit // 3))

                        for row in cursor:
                            evidence.append({
                                "source": f"memory:{row['source']}",
                                "content": row["content"][:500],
                                "metadata": {
                                    "category": row["category"],
                                    "created_at": row["created_at"]
                                }
                            })
                except sqlite3.OperationalError:
                    pass

    # Search external sources
    if "omi" in sources_to_query:
        omi_results = await omi.search(request.question, limit=request.limit // 2, days_back=request.days_back)
        for r in omi_results:
            evidence.append({
                "source": "omi",
                "content": r.get("content", "")[:500],
                "metadata": r.get("metadata", {})
            })

    if "letta" in sources_to_query:
        letta_results = await letta.search(request.question, limit=request.limit // 2)
        for r in letta_results:
            evidence.append({
                "source": "letta",
                "content": r.get("content", "")[:500],
                "metadata": r.get("metadata", {})
            })

    # Deduplicate and limit evidence
    seen = set()
    unique_evidence = []
    for e in evidence:
        key = e["content"][:100]
        if key not in seen:
            seen.add(key)
            unique_evidence.append(e)

    unique_evidence = unique_evidence[:request.limit]

    # Synthesize answer (simple for now - could use Claude for better synthesis)
    if unique_evidence:
        answer = f"Found {len(unique_evidence)} relevant items across {len(set(e['source'] for e in unique_evidence))} sources. "
        if "screen" in [e["source"] for e in unique_evidence]:
            apps = set(e["metadata"].get("app", "") for e in unique_evidence if e["source"] == "screen")
            answer += f"Screen activity in: {', '.join(filter(None, apps))}. "
        if "git" in [e["source"] for e in unique_evidence]:
            repos = set(e["metadata"].get("repo", "").split("/")[-1] for e in unique_evidence if e["source"] == "git")
            answer += f"Git commits in: {', '.join(filter(None, repos))}. "
        if "browser" in [e["source"] for e in unique_evidence]:
            domains = set(e["metadata"].get("domain", "") for e in unique_evidence if e["source"] == "browser")
            answer += f"Browsed: {', '.join(list(filter(None, domains))[:5])}. "
    else:
        answer = "No matching records found for your query. Try different keywords or expand the time range."

    query_time = (datetime.now() - start_time).total_seconds() * 1000

    return OracleResponse(
        question=request.question,
        answer=answer,
        evidence=unique_evidence,
        sources_queried=sources_to_query,
        query_time_ms=round(query_time, 2)
    )


# === Pattern Analysis endpoint ===

@app.get("/patterns")
async def get_patterns(days_back: int = 7):
    """Analyze behavioral patterns from captured data"""
    if not SIGSERVE_DB.exists():
        return {"error": "SIGSERVE database not found"}

    patterns = {}

    with sqlite3.connect(SIGSERVE_DB) as conn:
        conn.row_factory = sqlite3.Row
        cutoff = (datetime.now() - timedelta(days=days_back)).isoformat()

        # Most active hours (from screens)
        try:
            cursor = conn.execute("""
                SELECT strftime('%H', timestamp) as hour, COUNT(*) as count
                FROM screens
                WHERE timestamp > ?
                GROUP BY hour
                ORDER BY count DESC
            """, (cutoff,))
            patterns["active_hours"] = {row["hour"]: row["count"] for row in cursor}
        except sqlite3.OperationalError:
            patterns["active_hours"] = {}

        # Most used apps
        try:
            cursor = conn.execute("""
                SELECT app_name, COUNT(*) as count
                FROM screens
                WHERE timestamp > ? AND app_name IS NOT NULL
                GROUP BY app_name
                ORDER BY count DESC
                LIMIT 10
            """, (cutoff,))
            patterns["top_apps"] = {row["app_name"]: row["count"] for row in cursor}
        except sqlite3.OperationalError:
            patterns["top_apps"] = {}

        # Most visited domains
        try:
            cursor = conn.execute("""
                SELECT domain, COUNT(*) as count
                FROM browser_history
                WHERE visit_time > ? AND domain IS NOT NULL
                GROUP BY domain
                ORDER BY count DESC
                LIMIT 10
            """, (cutoff,))
            patterns["top_domains"] = {row["domain"]: row["count"] for row in cursor}
        except sqlite3.OperationalError:
            patterns["top_domains"] = {}

        # Git activity by repo
        try:
            cursor = conn.execute("""
                SELECT repo, COUNT(*) as commits,
                       SUM(insertions) as total_insertions,
                       SUM(deletions) as total_deletions
                FROM git_activity
                WHERE timestamp > ?
                GROUP BY repo
                ORDER BY commits DESC
            """, (cutoff,))
            patterns["git_activity"] = {
                Path(row["repo"]).name: {
                    "commits": row["commits"],
                    "insertions": row["total_insertions"] or 0,
                    "deletions": row["total_deletions"] or 0
                } for row in cursor
            }
        except sqlite3.OperationalError:
            patterns["git_activity"] = {}

        # Memory categories
        try:
            cursor = conn.execute("""
                SELECT category, COUNT(*) as count
                FROM memories
                WHERE created_at > ? AND category IS NOT NULL
                GROUP BY category
                ORDER BY count DESC
            """, (cutoff,))
            patterns["memory_categories"] = {row["category"]: row["count"] for row in cursor}
        except sqlite3.OperationalError:
            patterns["memory_categories"] = {}

    return {
        "days_analyzed": days_back,
        "patterns": patterns,
        "generated_at": datetime.now().isoformat()
    }


# === Action Queue endpoints ===

@app.get("/queue")
async def list_queue(status: str = "pending"):
    """List items in the action queue"""
    if not SIGSERVE_DB.exists():
        return {"error": "SIGSERVE database not found", "actions": []}

    with sqlite3.connect(SIGSERVE_DB) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.execute("""
            SELECT id, action_type, description, payload, status, priority, detected_at
            FROM action_queue
            WHERE status = ?
            ORDER BY priority DESC, detected_at ASC
        """, (status,))

        actions = []
        for row in cursor:
            actions.append({
                "id": row["id"],
                "type": row["action_type"],
                "description": row["description"],
                "payload": json.loads(row["payload"]) if row["payload"] else {},
                "status": row["status"],
                "priority": row["priority"],
                "detected_at": row["detected_at"]
            })

        return {"actions": actions, "count": len(actions)}


@app.post("/queue/{action_id}/approve")
async def approve_action(action_id: int):
    """Approve an action in the queue"""
    if not SIGSERVE_DB.exists():
        raise HTTPException(status_code=404, detail="SIGSERVE database not found")

    with sqlite3.connect(SIGSERVE_DB) as conn:
        conn.execute("""
            UPDATE action_queue
            SET status = 'approved', approved_at = datetime('now')
            WHERE id = ? AND status = 'pending'
        """, (action_id,))
        conn.commit()

        if conn.total_changes == 0:
            raise HTTPException(status_code=404, detail="Action not found or already processed")

        return {"status": "approved", "action_id": action_id}


@app.post("/queue/{action_id}/reject")
async def reject_action(action_id: int):
    """Reject an action in the queue"""
    if not SIGSERVE_DB.exists():
        raise HTTPException(status_code=404, detail="SIGSERVE database not found")

    with sqlite3.connect(SIGSERVE_DB) as conn:
        conn.execute("""
            UPDATE action_queue
            SET status = 'rejected'
            WHERE id = ? AND status = 'pending'
        """, (action_id,))
        conn.commit()

        if conn.total_changes == 0:
            raise HTTPException(status_code=404, detail="Action not found or already processed")

        return {"status": "rejected", "action_id": action_id}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8100)
