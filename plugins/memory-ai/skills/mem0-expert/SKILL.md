---
name: Mem0 Expert
description: Mem0 - AI memory layer, persistent context, user preferences, conversation history
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Mem0 Expert

Add persistent memory to any AI application.

## What is Mem0?

Memory layer for LLMs - remembers users, preferences, and context across sessions.

- **Automatic extraction**: Finds memorable facts from conversations
- **User-scoped**: Each user has their own memory
- **Semantic search**: Recalls relevant memories
- **Multi-LLM**: Works with Claude, GPT, etc.

## Pricing (2026)

- **Open Source**: Free (self-hosted)
- **Cloud Free**: 1,000 memories
- **Cloud Pro**: $20/month - Unlimited
- **Enterprise**: Custom

## Quick Start

### Install
```bash
pip install mem0ai
```

### Basic Usage
```python
from mem0 import Memory

# Initialize
memory = Memory()

# Add memories
memory.add(
    "User prefers dark mode and uses vim keybindings",
    user_id="user_123"
)

# Search memories
results = memory.search(
    "What are the user's preferences?",
    user_id="user_123"
)
```

## Integration with Claude

```python
from anthropic import Anthropic
from mem0 import Memory

client = Anthropic()
memory = Memory()

def chat_with_memory(user_id: str, message: str) -> str:
    # Recall relevant memories
    memories = memory.search(message, user_id=user_id)
    memory_context = "\n".join([m["memory"] for m in memories])

    # Include in system prompt
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=f"""You are a helpful assistant.
User memories:
{memory_context}

Use these memories to personalize your response.""",
        messages=[{"role": "user", "content": message}]
    )

    assistant_message = response.content[0].text

    # Store new memories from conversation
    memory.add(
        f"User: {message}\nAssistant: {assistant_message}",
        user_id=user_id
    )

    return assistant_message
```

## Configuration

### Custom Vector Store
```python
from mem0 import Memory

config = {
    "vector_store": {
        "provider": "qdrant",
        "config": {
            "host": "localhost",
            "port": 6333,
        }
    },
    "llm": {
        "provider": "anthropic",
        "config": {
            "model": "claude-sonnet-4-20250514",
        }
    }
}

memory = Memory.from_config(config)
```

### With OpenAI Embeddings
```python
config = {
    "embedder": {
        "provider": "openai",
        "config": {
            "model": "text-embedding-3-small"
        }
    }
}
```

## Memory Operations

### Add with Metadata
```python
memory.add(
    "User is building a podcast app called Modcaster",
    user_id="user_123",
    metadata={
        "category": "project",
        "importance": "high"
    }
)
```

### Get All Memories
```python
all_memories = memory.get_all(user_id="user_123")
for m in all_memories:
    print(f"{m['id']}: {m['memory']}")
```

### Update Memory
```python
memory.update(
    memory_id="mem_abc123",
    data="User's podcast app is now called PodFlow"
)
```

### Delete Memory
```python
memory.delete(memory_id="mem_abc123")
# Or delete all for user
memory.delete_all(user_id="user_123")
```

## Self-Hosted Setup

### Docker
```bash
docker run -d \
  -p 8000:8000 \
  -e OPENAI_API_KEY=your-key \
  mem0ai/mem0:latest
```

### With Qdrant
```yaml
version: '3.8'
services:
  mem0:
    image: mem0ai/mem0:latest
    ports:
      - "8000:8000"
    environment:
      - QDRANT_HOST=qdrant
      - OPENAI_API_KEY=${OPENAI_API_KEY}

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  qdrant_data:
```

## vs Alternatives

| Feature | Mem0 | Letta | Zep |
|---------|------|-------|-----|
| Auto-extraction | ✅ | ✅ | ✅ |
| Self-hosted | ✅ | ✅ | ✅ |
| Multi-user | ✅ | ✅ | ✅ |
| Pricing | $20/mo | $20/mo | $20/mo |
| Focus | Simple memory | Stateful agents | Enterprise |

Use when: User preferences, conversation history, personalization, cross-session context
