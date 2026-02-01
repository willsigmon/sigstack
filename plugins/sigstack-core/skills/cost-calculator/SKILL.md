---
name: Cost Calculator
description: Calculate and optimize Claude costs across interfaces
allowed-tools: Read, Bash
model: haiku
---

# Cost Calculator

Know what you're spending.

## 2026 Pricing

### Claude Pro Plan ($20/month)
```
Includes:
- Claude Code (unlimited)
- Claude Desktop (unlimited)
- Claude CLI (unlimited)
- 5x more usage than free

Best for: Daily interactive use
```

### API Pricing (Per Million Tokens)

| Model | Input | Output | Batch Input | Batch Output |
|-------|-------|--------|-------------|--------------|
| Opus 4.5 | $15 | $75 | $7.50 | $37.50 |
| Sonnet 4 | $3 | $15 | $1.50 | $7.50 |
| Haiku 3.5 | $0.80 | $4 | $0.40 | $2 |

### Quick Reference
```
1K tokens ≈ 750 words
1M tokens ≈ 750,000 words ≈ 3 novels

Typical request: 100-500 input tokens
Typical response: 200-2000 output tokens
```

## Cost Estimation

### Single Request
```
Input: 500 tokens
Output: 1000 tokens

Sonnet: ($3 × 0.0005) + ($15 × 0.001) = $0.0165
Haiku: ($0.80 × 0.0005) + ($4 × 0.001) = $0.0044

Difference: 3.7x cheaper with Haiku
```

### Daily Usage (Heavy)
```
100 requests/day
Avg: 500 input, 1000 output each

Sonnet: $1.65/day = $49.50/month
Haiku: $0.44/day = $13.20/month

Pro plan: $20/month (unlimited interactive)
```

### Batch Processing (1000 documents)
```
Each doc: 2000 input, 500 output tokens

Regular Sonnet:
  Input: 2M × $3 = $6
  Output: 0.5M × $15 = $7.50
  Total: $13.50

Batch Sonnet (50% off):
  Input: 2M × $1.50 = $3
  Output: 0.5M × $7.50 = $3.75
  Total: $6.75

Savings: $6.75 (50%)
```

## Optimization Strategies

### 1. Model Selection
```
Task complexity → Model choice

Simple: Haiku (80% cheaper than Sonnet)
Medium: Sonnet (balanced)
Complex: Opus (when needed)

Most tasks work fine with Haiku.
```

### 2. Pro Plan vs API
```
Break-even calculation:

Pro: $20/month unlimited
API: Pay per token

If you'd spend >$20/month on API:
→ Use Pro plan

If you'd spend <$20/month on API:
→ Use API (or free tier)

Heavy users: Pro always wins.
```

### 3. Batch API
```
Can wait 24 hours? Use Batch.
50% savings on everything.

Best for:
- Overnight processing
- Non-urgent bulk work
- Scheduled jobs
```

### 4. Token Reduction
```
Compress prompts: 50-80% fewer tokens
Use MCP: 80-90% fewer tokens
Reference files: 90% fewer tokens

Compound savings possible.
```

## Monthly Budget Planning

### Light User ($0-10/month)
```
Free tier + occasional API
- Claude Desktop free
- API for automation only
```

### Medium User ($20/month)
```
Pro plan
- Unlimited Claude Code
- Unlimited Desktop
- CLI access
```

### Heavy User ($50-100/month)
```
Pro plan + API for batch
- Interactive: Pro plan
- Automation: API batch
- High volume: API streaming
```

### Team ($100+/month)
```
Pro plans + Team API
- Individual Pro for each dev
- Shared API for automation
- Consider Claude for Teams
```

## Quick Calculators

### Per-Request Cost
```bash
# Sonnet
echo "scale=4; (INPUT_TOKENS * 3 + OUTPUT_TOKENS * 15) / 1000000" | bc

# Example: 500 in, 1000 out
echo "scale=4; (500 * 3 + 1000 * 15) / 1000000" | bc
# = 0.0165 ($0.0165)
```

### Monthly Projection
```bash
# Requests per day × cost per request × 30
echo "scale=2; REQUESTS * COST_PER_REQUEST * 30" | bc

# Example: 100 requests/day at $0.0165 each
echo "scale=2; 100 * 0.0165 * 30" | bc
# = 49.50 ($49.50/month)
```

## Decision Framework

```
Daily interactive coding?
→ Pro plan ($20/month)

Batch processing 100+ items?
→ Batch API (50% off)

Simple, repetitive tasks?
→ Haiku (80% cheaper)

Occasional use only?
→ Free tier + pay-as-go API
```

Use when: Budget planning, cost optimization, usage analysis
