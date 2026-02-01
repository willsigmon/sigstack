---
name: Knowledge Graph Expert
description: Knowledge graphs - Neo4j, entity relationships, graph RAG, semantic memory
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Knowledge Graph Expert

Build semantic memory with interconnected knowledge.

## Why Knowledge Graphs for AI?

- **Relationships matter**: "User works at Company" not just "User, Company"
- **Multi-hop reasoning**: Find connections across entities
- **Explainable retrieval**: See why something was recalled
- **Structured + unstructured**: Combine graph with embeddings

## Graph Databases

| Database | Best For | Pricing |
|----------|----------|---------|
| Neo4j | Enterprise, full-featured | Free - $65/mo |
| NebulaGraph | Scale, open source | Free |
| Amazon Neptune | AWS native | $0.10/hr+ |
| FalkorDB | Redis-compatible | Free |

## Neo4j Quick Start

### Docker Setup
```bash
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password123 \
  neo4j:5
```

### Python Driver
```python
from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "password123")
)

def create_user(name, email):
    with driver.session() as session:
        session.run(
            "CREATE (u:User {name: $name, email: $email})",
            name=name, email=email
        )

def create_relationship(user1, user2, relationship):
    with driver.session() as session:
        session.run("""
            MATCH (u1:User {name: $user1})
            MATCH (u2:User {name: $user2})
            CREATE (u1)-[:$relationship]->(u2)
        """, user1=user1, user2=user2, relationship=relationship)
```

## Graph RAG Pattern

Combine knowledge graph with vector search:

```python
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain_anthropic import ChatAnthropic

graph = Neo4jGraph(url="bolt://localhost:7687", username="neo4j", password="password")

chain = GraphCypherQAChain.from_llm(
    ChatAnthropic(model="claude-sonnet-4-20250514"),
    graph=graph,
    verbose=True
)

# Natural language → Cypher → Answer
result = chain.invoke("Who does John work with?")
```

## Entity Extraction for Graphs

```python
from anthropic import Anthropic

client = Anthropic()

def extract_entities(text):
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""Extract entities and relationships from this text.
Return JSON with:
- entities: [{{"name": "...", "type": "Person|Company|Project|..."}}]
- relationships: [{{"from": "...", "to": "...", "type": "works_at|knows|manages|..."}}]

Text: {text}"""
        }]
    )
    return json.loads(response.content[0].text)
```

## Memory-Keeper MCP Integration

Store conversation entities in graph:

```python
# After each conversation turn
entities = extract_entities(user_message + assistant_response)

for entity in entities['entities']:
    graph.create_node(entity['type'], entity['name'])

for rel in entities['relationships']:
    graph.create_relationship(rel['from'], rel['to'], rel['type'])
```

## Query Patterns

### Find Connections
```cypher
// People who work at same company as John
MATCH (john:Person {name: 'John'})-[:WORKS_AT]->(company)<-[:WORKS_AT]-(colleague)
RETURN colleague.name
```

### Path Finding
```cypher
// How is John connected to Alice?
MATCH path = shortestPath(
  (john:Person {name: 'John'})-[*]-(alice:Person {name: 'Alice'})
)
RETURN path
```

### Semantic Search on Graph
```cypher
// Find similar concepts by relationship patterns
MATCH (concept:Concept)-[:RELATED_TO*1..3]-(related)
WHERE concept.name = 'Machine Learning'
RETURN related
```

## Best Practices

### 1. Normalize Entity Names
```python
def normalize_entity(name):
    # "John Doe", "john doe", "J. Doe" → "john_doe"
    return name.lower().replace(" ", "_").strip()
```

### 2. Version Relationships
```cypher
CREATE (u)-[:WORKS_AT {since: date(), current: true}]->(c)
```

### 3. Combine with Embeddings
```python
# Store embedding on node for semantic similarity
CREATE (doc:Document {
  content: $content,
  embedding: $embedding
})
```

Use when: Complex relationships, multi-hop reasoning, semantic memory, RAG enhancement
