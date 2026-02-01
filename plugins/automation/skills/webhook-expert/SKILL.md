---
name: Webhook Expert
description: Webhook automation - real-time triggers, payload handling, retry logic, security
allowed-tools: Read, Edit, Bash
model: sonnet
---

# Webhook Automation Expert

Master webhook-driven automation for real-time integrations.

## Key Concepts
- Event-driven, push-based
- Eliminates polling
- Real-time execution
- Lightweight and scalable

## Testing Webhooks

### Webhook.site
```bash
# Get test URL at webhook.site
# Send test payload
curl -X POST https://webhook.site/your-uuid \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": {"key": "value"}}'
```

### ngrok for Local Testing
```bash
ngrok http 3000
# Exposes localhost:3000 to public URL
```

## Webhook Patterns

### Express Handler
```typescript
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// Verify webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expected}`)
  );
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'] as string;

  if (!verifySignature(JSON.stringify(req.body), signature, process.env.WEBHOOK_SECRET!)) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  console.log('Event:', req.body.event);

  // Respond quickly, process async
  res.status(200).send('OK');

  processWebhookAsync(req.body);
});
```

### Retry Logic
```typescript
async function sendWebhook(url: string, payload: object, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) return true;

      if (response.status >= 500) {
        // Server error, retry with exponential backoff
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }

      return false; // Client error, don't retry
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
  return false;
}
```

## Security Best Practices
1. Always verify signatures
2. Use HTTPS only
3. Validate payload schema
4. Implement idempotency
5. Rate limit incoming requests
6. Log all webhook activity

## Webhook-as-a-Service

### Hook0 (Open Source)
- Self-hostable
- Automatic retries
- Fine-grained subscriptions
- REST API

Use when: Real-time integrations, event-driven automation, third-party callbacks
