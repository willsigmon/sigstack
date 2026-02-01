---
name: Letta Expert
description: Letta (MemGPT) - stateful AI agents with long-term memory, self-improving agents
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Letta (MemGPT) Expert

Build AI agents with true long-term memory using Letta.

## Pricing (2026)

### Free Plan
- Access to Letta API
- Visual Agent Development Environment (ADE)
- 2 agent templates
- 1 GB storage

### Pro ($20/mo)
- 20,000 monthly credits
- Pay-as-you-go overage
- Unlimited agents
- 20 agent templates
- 10 GB storage

### Enterprise
- BYOK (Bring Your Own Key)
- SAML/OIDC SSO
- RBAC
- Unlimited agents & storage
- Custom model deployments

## Key Concepts

### Memory Architecture
```
Core Memory (always in context)
├── Human: User preferences, history
├── Persona: Agent personality, goals
└── System: Rules, constraints

Archival Memory (searchable, unlimited)
└── Long-term facts, conversations, documents

Recall Memory (recent context)
└── Short-term working memory
```

### Agent Microservices
- REST APIs for agent interaction
- Stateless requests, stateful agents
- Model-agnostic (OpenAI, Anthropic, local)

## Quick Start

### Install
```bash
pip install letta
letta quickstart
```

### Create Agent
```python
from letta import create_client

client = create_client()

agent = client.create_agent(
    name="my-assistant",
    memory={
        "human": "User: Developer building iOS apps",
        "persona": "I am a helpful coding assistant with expertise in Swift."
    }
)
```

### Chat with Memory
```python
response = client.send_message(
    agent_id=agent.id,
    message="Remember: I prefer SwiftUI over UIKit"
)

# Later conversation...
response = client.send_message(
    agent_id=agent.id,
    message="What UI framework should I use?"
)
# Agent remembers SwiftUI preference
```

### Archival Memory
```python
# Store long-term knowledge
client.insert_archival_memory(
    agent_id=agent.id,
    memory="Project architecture uses MVVM pattern with SwiftData"
)

# Agent can search this when relevant
```

## Use Cases
- Personal assistants that remember you
- Customer support with context
- Coding agents that learn codebase
- Research assistants with persistent knowledge

## MCP Integration
Letta agents can connect to MCP servers for tool access while maintaining memory across sessions.

Use when: Building AI agents that need to remember, learn, and improve over time
