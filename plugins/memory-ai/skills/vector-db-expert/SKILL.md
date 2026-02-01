---
name: Vector Database Expert
description: Vector databases - Pinecone, Weaviate, Chroma, Qdrant for RAG and semantic search
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Vector Database Expert

Choose and implement the right vector database for your AI applications.

## Pricing Comparison (2026)

| Database | Free Tier | Paid (1M vectors) |
|----------|-----------|-------------------|
| Pinecone | Yes | ~$41/mo |
| Weaviate | Yes | ~$25-153/mo |
| Chroma | Open source | Self-host cost |
| Qdrant | Open source | Self-host or cloud |

## When to Use Each

### Pinecone
- **Best for**: Production RAG, minimal ops
- **Pros**: Fully managed, fast, reliable
- **Cons**: 3-5x more expensive
- **Use when**: Need SLAs, no DevOps capacity

### Weaviate
- **Best for**: Hybrid search, GraphQL fans
- **Pros**: Flexible pricing, compression options
- **Cons**: More complex setup
- **Use when**: Mid-scale with in-house ops

### Chroma
- **Best for**: Prototypes, learning, embedded use
- **Pros**: Free, simple Python API
- **Cons**: Limited production features
- **Use when**: Starting out, tight budget

### Qdrant
- **Best for**: Performance-critical apps
- **Pros**: Fast, Rust-based, filtering
- **Cons**: Newer ecosystem
- **Use when**: High-performance requirements

## Quick Implementations

### Chroma (Local Dev)
```python
import chromadb
from chromadb.utils import embedding_functions

client = chromadb.Client()
ef = embedding_functions.OpenAIEmbeddingFunction(api_key="...")

collection = client.create_collection(
    name="docs",
    embedding_function=ef
)

collection.add(
    documents=["Swift is great for iOS", "React is for web"],
    ids=["doc1", "doc2"]
)

results = collection.query(
    query_texts=["mobile development"],
    n_results=2
)
```

### Pinecone (Production)
```python
from pinecone import Pinecone

pc = Pinecone(api_key="...")
index = pc.Index("my-index")

# Upsert
index.upsert(vectors=[
    {"id": "doc1", "values": [...], "metadata": {"source": "docs"}}
])

# Query
results = index.query(
    vector=[...],
    top_k=5,
    filter={"source": "docs"}
)
```

### Weaviate
```python
import weaviate

client = weaviate.connect_to_wcs(
    cluster_url="your-url",
    auth_credentials=weaviate.AuthApiKey("key")
)

collection = client.collections.create(
    name="Document",
    vectorizer_config=wvc.Configure.Vectorizer.text2vec_openai()
)
```

## RAG Pattern
```
User Query → Embed → Vector Search → Top K Docs → LLM Context → Response
```

Use when: Building RAG, semantic search, similarity matching, AI memory
