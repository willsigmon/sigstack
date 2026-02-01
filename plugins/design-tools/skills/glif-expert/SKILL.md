---
name: Glif Expert
description: Build and run Glif AI workflows - API integration, workflow design, app embedding
allowed-tools: Bash, Read, Edit, WebFetch
---

# Glif Expert

Complete Glif workflow expertise.

## API Usage
**Base URL**: `https://simple-api.glif.app`
**Auth**: Bearer token from https://glif.app/settings/api-tokens

```bash
curl -X POST https://simple-api.glif.app \
  -H "Authorization: Bearer $GLIF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": "glif-id", "inputs": {"prompt": "..."}}'
```

## Workflow Design
Glifs are JSON graphs with blocks connected via variable references.

**Block types**: Text input, image input, GPT-4, Claude, DALL-E, Stable Diffusion, code execution

## Integration Patterns
- **Node.js**: `@glifxyz/sdk` package
- **Discord bots**: Webhook triggers
- **Web apps**: REST API + webhooks for async

Use when: Creating glifs, running AI workflows, integrating Glif into apps
