---
name: Context Window Expert
description: Context optimization - token management, chunking, compression, RAG strategies
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Context Window Expert

Maximize what fits in your LLM context window.

## Context Window Sizes (2026)

| Model | Context | Input Price/1M | Notes |
|-------|---------|----------------|-------|
| Claude Opus 4.5 | 200K | $15 | Best reasoning |
| Claude Sonnet 4 | 200K | $3 | Best balance |
| GPT-4o | 128K | $5 | Fast |
| Gemini 1.5 Pro | 2M | $3.50 | Largest |

## Token Counting

### Claude (tiktoken alternative)
```python
from anthropic import Anthropic

client = Anthropic()

def count_tokens(text: str) -> int:
    # Use the API's token counter
    response = client.messages.count_tokens(
        model="claude-sonnet-4-20250514",
        messages=[{"role": "user", "content": text}]
    )
    return response.input_tokens
```

### Estimation Rule
```
~4 characters = 1 token (English)
~1.5 characters = 1 token (code)
```

## Chunking Strategies

### Fixed Size
```python
def chunk_fixed(text: str, chunk_size: int = 1000, overlap: int = 100):
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunks.append(text[i:i + chunk_size])
    return chunks
```

### Semantic (Better)
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100,
    separators=["\n\n", "\n", ". ", " ", ""]
)

chunks = splitter.split_text(document)
```

### Code-Aware
```python
from langchain.text_splitter import Language, RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PYTHON,
    chunk_size=1000,
    chunk_overlap=100
)

chunks = splitter.split_text(code)
```

## Context Compression

### LLMLingua (Microsoft)
```python
from llmlingua import PromptCompressor

compressor = PromptCompressor()

compressed = compressor.compress_prompt(
    long_context,
    instruction="Answer the question",
    question="What is the main point?",
    target_token=1000
)
# 50-80% compression with minimal quality loss
```

### Summary-Based Compression
```python
async def compress_with_summary(text: str, max_tokens: int) -> str:
    if count_tokens(text) <= max_tokens:
        return text

    # Use Claude to summarize
    response = await client.messages.create(
        model="claude-haiku-3-5-20241022",
        max_tokens=max_tokens,
        messages=[{
            "role": "user",
            "content": f"Summarize this text in under {max_tokens} tokens, preserving key details:\n\n{text}"
        }]
    )
    return response.content[0].text
```

## RAG for Large Contexts

### Vector Search
```python
from anthropic import Anthropic
import chromadb

# Index documents
collection = chromadb.Client().create_collection("docs")
collection.add(documents=chunks, ids=[f"chunk_{i}" for i in range(len(chunks))])

# Query
results = collection.query(query_texts=[user_question], n_results=5)
relevant_chunks = results['documents'][0]

# Use in context
context = "\n\n".join(relevant_chunks)
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    messages=[{
        "role": "user",
        "content": f"Context:\n{context}\n\nQuestion: {user_question}"
    }]
)
```

## Context Window Management

### Priority Ordering
```
1. System prompt (always)
2. Current user message (always)
3. Most recent conversation (sliding window)
4. Retrieved context (RAG)
5. Older conversation (summarized)
```

### Implementation
```python
def build_context(
    system: str,
    current_message: str,
    conversation_history: list,
    retrieved_context: str,
    max_tokens: int = 100000
) -> list:
    messages = []
    used_tokens = count_tokens(system) + count_tokens(current_message)

    # Add retrieved context as system context
    if retrieved_context:
        context_tokens = count_tokens(retrieved_context)
        if used_tokens + context_tokens < max_tokens * 0.7:
            system += f"\n\nRelevant context:\n{retrieved_context}"
            used_tokens += context_tokens

    # Add conversation history (most recent first)
    for msg in reversed(conversation_history):
        msg_tokens = count_tokens(msg['content'])
        if used_tokens + msg_tokens < max_tokens * 0.9:
            messages.insert(0, msg)
            used_tokens += msg_tokens
        else:
            break

    messages.append({"role": "user", "content": current_message})
    return system, messages
```

## Best Practices

1. **Count before sending**: Always verify you're under the limit
2. **Reserve output space**: Leave 20-30% for response
3. **Summarize old context**: Don't drop, compress
4. **Use system prompt wisely**: It's included in every request
5. **Batch similar requests**: Reuse context across related queries

Use when: Large documents, long conversations, context limits, RAG optimization
