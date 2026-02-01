---
name: Activepieces Expert
description: Activepieces - open source automation, Zapier alternative, self-hosted workflows
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Activepieces Expert

Open source automation alternative to Zapier.

## Why Activepieces?

- **100% Open Source**: Self-host for free
- **Visual Builder**: No-code flow creation
- **200+ Integrations**: Growing piece library
- **Code Pieces**: Write custom TypeScript
- **Fair Pricing**: Much cheaper than Zapier

## Pricing (2026)

- **Self-hosted**: Free forever
- **Cloud Free**: 1,000 tasks/month
- **Cloud Pro**: $29/month - 10K tasks
- **Enterprise**: Custom

## Self-Hosted Setup

### Docker Compose
```yaml
version: '3.8'
services:
  activepieces:
    image: activepieces/activepieces:latest
    ports:
      - "8080:80"
    environment:
      - AP_ENGINE_EXECUTABLE_PATH=dist/packages/engine/main.js
      - AP_ENCRYPTION_KEY=your-32-char-key-here-1234567890
      - AP_JWT_SECRET=your-jwt-secret-here
      - AP_POSTGRES_DATABASE=activepieces
      - AP_POSTGRES_HOST=postgres
      - AP_POSTGRES_PASSWORD=activepieces
      - AP_POSTGRES_PORT=5432
      - AP_POSTGRES_USERNAME=activepieces
      - AP_REDIS_HOST=redis
      - AP_REDIS_PORT=6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=activepieces
      - POSTGRES_PASSWORD=activepieces
      - POSTGRES_USER=activepieces
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Run
```bash
docker-compose up -d
# Access at http://localhost:8080
```

## Built-in Pieces

Popular integrations:
- Slack, Discord, Email
- Google Sheets, Airtable
- GitHub, GitLab
- Stripe, Shopify
- OpenAI, Claude
- HTTP/Webhooks

## Creating Flows

### Example: GitHub → Slack
```
Trigger: New GitHub Issue
Action: Send Slack Message
  Channel: #issues
  Message: "New issue: {{trigger.title}}"
```

### Example: Form → Email + Sheet
```
Trigger: Webhook (form submission)
Action 1: Add Row to Google Sheets
Action 2: Send Email Confirmation
```

## Custom Code Piece

### TypeScript Piece
```typescript
// pieces/my-custom-piece/src/index.ts
import { createPiece } from '@activepieces/pieces-framework';
import { myAction } from './actions/my-action';
import { myTrigger } from './triggers/my-trigger';

export const myCustomPiece = createPiece({
  displayName: 'My Custom Piece',
  logoUrl: 'https://example.com/logo.png',
  authors: ['wsig'],
  actions: [myAction],
  triggers: [myTrigger],
});
```

### Action Definition
```typescript
// actions/my-action.ts
import { createAction, Property } from '@activepieces/pieces-framework';

export const myAction = createAction({
  name: 'my_action',
  displayName: 'My Action',
  description: 'Does something cool',
  props: {
    inputText: Property.ShortText({
      displayName: 'Input',
      required: true,
    }),
  },
  async run(context) {
    const { inputText } = context.propsValue;
    // Your logic here
    return { result: `Processed: ${inputText}` };
  },
});
```

## API Access

### Execute Flow via API
```bash
curl -X POST "https://your-activepieces.com/api/v1/webhooks/{webhook-id}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@example.com"}'
```

## vs Alternatives

| Feature | Activepieces | n8n | Zapier |
|---------|--------------|-----|--------|
| Open Source | ✅ | ✅ | ❌ |
| Self-hosted | ✅ | ✅ | ❌ |
| Visual Builder | ✅ | ✅ | ✅ |
| Code Actions | ✅ | ✅ | Limited |
| Free Tasks | 1,000/mo | 5,000/mo | 100/mo |
| Pricing | $29/mo | Free | $19/mo |

## Best For

- Self-hosted automation
- Simple integrations
- Growing teams
- Cost-conscious projects

Use when: Zapier alternative, self-hosted automation, simple workflows
