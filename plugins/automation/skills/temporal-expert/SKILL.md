---
name: Temporal Expert
description: Temporal - durable workflows, long-running processes, reliable execution
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Temporal Expert

Build bulletproof workflows that survive failures.

## What is Temporal?

Durable execution platform for long-running, reliable workflows.

- **Survives crashes**: Workflow resumes exactly where it left off
- **Automatic retries**: Failed activities retry with backoff
- **Versioning**: Update workflows without breaking running ones
- **Visibility**: Full history of every execution

## When to Use Temporal

### Good Fit
- Multi-step order processing
- Payment workflows
- Data pipelines
- Long-running background jobs
- Saga patterns (distributed transactions)

### Overkill For
- Simple CRUD
- Single API calls
- Fast synchronous operations

## Pricing (2026)

- **Self-hosted**: Free (complex to operate)
- **Temporal Cloud**: $25/mo base + $0.035/action

## Quick Start (TypeScript)

### Install
```bash
npm install @temporalio/client @temporalio/worker @temporalio/workflow @temporalio/activity
```

### Define Workflow
```typescript
// workflows.ts
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { sendEmail, chargeCard, shipOrder } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 minutes',
  retry: {
    maximumAttempts: 3,
  },
});

export async function orderWorkflow(orderId: string): Promise<void> {
  // Each step is durable - survives crashes
  await chargeCard(orderId);
  await shipOrder(orderId);
  await sendEmail(orderId, 'Your order has shipped!');
}
```

### Define Activities
```typescript
// activities.ts
export async function chargeCard(orderId: string): Promise<void> {
  // Call payment API
}

export async function shipOrder(orderId: string): Promise<void> {
  // Call shipping API
}

export async function sendEmail(orderId: string, message: string): Promise<void> {
  // Send email
}
```

### Start Worker
```typescript
// worker.ts
import { Worker } from '@temporalio/worker';
import * as activities from './activities';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'orders',
  });
  await worker.run();
}
```

### Execute Workflow
```typescript
// client.ts
import { Client } from '@temporalio/client';
import { orderWorkflow } from './workflows';

const client = new Client();

await client.workflow.start(orderWorkflow, {
  taskQueue: 'orders',
  workflowId: `order-${orderId}`,
  args: [orderId],
});
```

## Saga Pattern

Handle distributed rollbacks:

```typescript
export async function bookingWorkflow(booking: Booking): Promise<void> {
  try {
    await reserveFlight(booking.flightId);
    await reserveHotel(booking.hotelId);
    await chargePayment(booking.paymentId);
  } catch (error) {
    // Compensating transactions
    await cancelFlight(booking.flightId);
    await cancelHotel(booking.hotelId);
    throw error;
  }
}
```

## Docker Compose Setup

```yaml
version: '3.8'
services:
  temporal:
    image: temporalio/auto-setup:1.22
    ports:
      - "7233:7233"
    environment:
      - DB=postgresql
      - DB_PORT=5432
      - POSTGRES_USER=temporal
      - POSTGRES_PWD=temporal
      - POSTGRES_SEEDS=postgresql

  temporal-ui:
    image: temporalio/ui:2.21
    ports:
      - "8080:8080"
    environment:
      - TEMPORAL_ADDRESS=temporal:7233
```

## Best Practices

### 1. Idempotent Activities
```typescript
export async function chargeCard(orderId: string): Promise<void> {
  // Check if already charged
  const existing = await getPayment(orderId);
  if (existing) return;

  await processPayment(orderId);
}
```

### 2. Use Workflow IDs
```typescript
// Prevents duplicate workflows
await client.workflow.start(orderWorkflow, {
  workflowId: `order-${orderId}`,  // Same ID = same workflow
});
```

### 3. Heartbeats for Long Activities
```typescript
export async function processLargeFile(fileId: string): Promise<void> {
  for (const chunk of chunks) {
    await processChunk(chunk);
    Context.current().heartbeat();  // Keep alive
  }
}
```

Use when: Multi-step workflows, payment processing, data pipelines, reliability needed
