---
name: Batch Processing
description: Process multiple items efficiently using API batch, agents, or loops
allowed-tools: Read, Edit, Bash
model: sonnet
---

# Batch Processing

Process many items without proportional token growth.

## Batch Options

| Method | Best For | Cost | Speed |
|--------|----------|------|-------|
| Claude Code agents | 5-20 items | Pro plan | Fast (parallel) |
| API Batch | 100+ items | 50% off | Async (24h) |
| API streaming | Real-time needs | Full price | Immediate |
| Loop in conversation | Sequential deps | Pro plan | Slower |

## Claude Code: Agent Swarms

### Parallel Processing
```
Process 10 files simultaneously:

[Single message with 10 Task calls]
Each agent handles one file.
All run in parallel.
Results collected together.
```

### When to Use
- 5-20 independent items
- Need results quickly
- Interactive review needed

### Example
```
"Review these 10 modules for bugs"

→ Spawn 10 explore agents
→ Each searches one module
→ Collect findings
→ Prioritize and fix
```

## API Batch Processing

### Setup
```python
from anthropic import Anthropic

client = Anthropic()

# Create batch request
batch = client.batches.create(
    requests=[
        {
            "custom_id": f"doc-{i}",
            "params": {
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": doc}]
            }
        }
        for i, doc in enumerate(documents)
    ]
)
```

### Check Status
```python
status = client.batches.retrieve(batch.id)
print(status.status)  # "processing" or "completed"
```

### Get Results
```python
for result in client.batches.results(batch.id):
    print(result.custom_id, result.result)
```

### When to Use
- 100+ items
- Can wait up to 24 hours
- Cost is primary concern
- Predictable, repeatable tasks

### Cost Savings
```
Regular API: $3/M input, $15/M output
Batch API: $1.50/M input, $7.50/M output

50% savings on everything.
```

## Conversation Loops

### Sequential in Claude Code
```
For items that depend on each other:

"Process these files in order:
1. Read config.json
2. Generate types from config
3. Update imports based on types
4. Run tests"

Claude handles the loop internally.
```

### When to Use
- Items have dependencies
- Order matters
- Need to adjust based on results

## Efficiency Comparison

### 100 Document Reviews
```
Method 1: One by one in conversation
= 100 round trips
= Hours of waiting
= Full context each time

Method 2: API Batch
= 1 submission
= Wait overnight
= 50% cost savings
= Results in morning

Method 3: Agent swarm (10 at a time)
= 10 rounds of parallel agents
= Minutes to complete
= Can review as they finish
```

## Batch Best Practices

### 1. Consistent Prompts
```
# Batch works best with identical structure
prompt_template = """
Review this code for bugs:
{code}

Return JSON: {"bugs": [...], "severity": "..."}
"""
```

### 2. Structured Output
```python
# Parse batch results automatically
results = []
for r in batch_results:
    data = json.loads(r.result.content)
    results.append(data)
```

### 3. Error Handling
```python
for result in batch_results:
    if result.error:
        failed.append(result.custom_id)
    else:
        success.append(result)

# Retry failed items
```

### 4. Progress Tracking
```python
# Batch status updates
while status.status != "completed":
    print(f"Processed: {status.completed}/{status.total}")
    time.sleep(60)
```

## Decision Tree

```
How many items?
├─ 1-5: Direct conversation
├─ 5-20: Agent swarm
├─ 20-100: API streaming or agents
└─ 100+: API Batch

Time sensitive?
├─ Yes: Agents or streaming
└─ No: Batch (50% savings)

Dependencies between items?
├─ Yes: Sequential loop
└─ No: Parallel processing
```

Use when: Multiple similar tasks, document processing, code review at scale
