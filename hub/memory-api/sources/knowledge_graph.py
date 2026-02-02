"""
Knowledge Graph source connector

Connects to the Memory MCP server's knowledge graph
for entity and relationship queries.
"""

import os
import json
import subprocess
from typing import Optional

# Memory MCP stores data in a JSON file
MEMORY_FILE = os.path.expanduser("~/.claude/memory/graph.json")


async def health_check() -> dict:
    """Check if knowledge graph is accessible"""
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "r") as f:
                data = json.load(f)
                entity_count = len(data.get("entities", []))
                relation_count = len(data.get("relations", []))
                return {
                    "status": "ok",
                    "entities": entity_count,
                    "relations": relation_count
                }
        except Exception as e:
            return {"status": "error", "error": str(e)}

    return {"status": "unconfigured", "error": "Memory file not found"}


def _load_graph() -> dict:
    """Load the knowledge graph from disk"""
    if not os.path.exists(MEMORY_FILE):
        return {"entities": [], "relations": []}

    try:
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {"entities": [], "relations": []}


async def search(query: str, limit: int = 20) -> list[dict]:
    """Search entities and observations in the knowledge graph"""
    graph = _load_graph()
    results = []
    query_lower = query.lower()

    for entity in graph.get("entities", []):
        name = entity.get("name", "")
        entity_type = entity.get("entityType", "")
        observations = entity.get("observations", [])

        # Check entity name
        if query_lower in name.lower():
            results.append({
                "content": f"{name} ({entity_type}): {'; '.join(observations[:3])}",
                "timestamp": None,
                "metadata": {
                    "type": "entity",
                    "name": name,
                    "entity_type": entity_type,
                },
                "relevance": 0.9
            })
            continue

        # Check observations
        for obs in observations:
            if query_lower in obs.lower():
                results.append({
                    "content": f"{name}: {obs}",
                    "timestamp": None,
                    "metadata": {
                        "type": "observation",
                        "entity": name,
                        "entity_type": entity_type,
                    },
                    "relevance": 0.7
                })

    # Also search relations
    for relation in graph.get("relations", []):
        from_entity = relation.get("from", "")
        to_entity = relation.get("to", "")
        rel_type = relation.get("relationType", "")

        if any(query_lower in s.lower() for s in [from_entity, to_entity, rel_type]):
            results.append({
                "content": f"{from_entity} --[{rel_type}]--> {to_entity}",
                "timestamp": None,
                "metadata": {
                    "type": "relation",
                    "from": from_entity,
                    "to": to_entity,
                    "relation_type": rel_type,
                },
                "relevance": 0.6
            })

    return results[:limit]


async def get_entities(names: Optional[list[str]] = None) -> dict:
    """Get entities from the knowledge graph"""
    graph = _load_graph()
    entities = graph.get("entities", [])

    if names:
        entities = [e for e in entities if e.get("name") in names]

    return {"entities": entities}


async def get_relations(entity_name: Optional[str] = None) -> dict:
    """Get relations from the knowledge graph"""
    graph = _load_graph()
    relations = graph.get("relations", [])

    if entity_name:
        relations = [
            r for r in relations
            if r.get("from") == entity_name or r.get("to") == entity_name
        ]

    return {"relations": relations}


async def add_entity(name: str, entity_type: str, observations: list[str]) -> dict:
    """Add an entity to the knowledge graph"""
    graph = _load_graph()

    # Check if entity already exists
    for entity in graph.get("entities", []):
        if entity.get("name") == name:
            # Update observations
            existing_obs = set(entity.get("observations", []))
            entity["observations"] = list(existing_obs | set(observations))
            break
    else:
        # Add new entity
        graph.setdefault("entities", []).append({
            "name": name,
            "entityType": entity_type,
            "observations": observations
        })

    # Save
    os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
    with open(MEMORY_FILE, "w") as f:
        json.dump(graph, f, indent=2)

    return {"status": "ok", "entity": name}
