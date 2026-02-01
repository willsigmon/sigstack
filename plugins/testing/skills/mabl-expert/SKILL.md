---
name: Mabl Expert
description: Mabl - AI-powered E2E testing, self-healing tests, low-code automation
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Mabl Expert

AI-powered end-to-end testing with self-healing capabilities.

## What Makes Mabl Special?

- **Self-Healing Tests**: AI adapts to UI changes automatically
- **Low-Code Builder**: Record tests visually
- **AI Insights**: Automatic root cause analysis
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Mobile Web**: Responsive testing built-in

## Pricing (2026)

- **Pro**: $500+/month
- **Enterprise**: Custom pricing
- Best for: Teams with frequent UI changes

## When to Use Mabl

### Good Fit
- Frequently changing UI
- Non-technical QA team
- Need visual test recording
- High test maintenance burden

### Not Ideal
- Simple static sites
- Budget constraints (expensive!)
- Need mobile native testing
- API-only testing

## Key Features

### 1. Self-Healing
```
Traditional: Selector changed → Test fails
Mabl: Selector changed → AI finds new selector → Test passes
```

### 2. Visual Recording
- Point and click to create tests
- Assertions added visually
- No code required for basic tests

### 3. API Testing
```javascript
// Mabl can also test APIs
api.request('POST', '/users')
  .body({ name: 'Test User' })
  .expect(201)
  .extractJson('$.id', 'userId');
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Mabl Tests
  uses: mablhq/github-run-tests-action@v1
  with:
    api-key: ${{ secrets.MABL_API_KEY }}
    application-id: your-app-id
    environment-id: your-env-id
```

### Deployment Events
```bash
# Notify mabl of deployment
curl -X POST "https://api.mabl.com/events/deployment" \
  -H "Authorization: Bearer $MABL_API_KEY" \
  -d '{
    "environment_id": "env-123",
    "application_id": "app-456"
  }'
```

## Alternatives for Budget-Conscious

### Playwright + AI (DIY Self-Healing)
```typescript
// Use AI to find elements when selector fails
async function smartClick(page, selectors) {
  for (const selector of selectors) {
    try {
      await page.click(selector, { timeout: 1000 });
      return;
    } catch (e) {
      continue;
    }
  }
  // Fall back to AI vision
  const screenshot = await page.screenshot();
  const element = await aiVision.findElement(screenshot, 'login button');
  await page.click(element.selector);
}
```

### Playwright + Claude Vision
```typescript
// Screenshot-based testing (vibe coder friendly)
const screenshot = await page.screenshot();
const analysis = await claude.vision.analyze(screenshot,
  "Is the login form visible and properly styled?"
);
```

## Best Practices

### 1. Use Data-TestIDs
```html
<!-- Even with AI, good selectors help -->
<button data-testid="submit-btn">Submit</button>
```

### 2. Group Related Tests
```
Flows/
├── Authentication/
│   ├── Login
│   └── Logout
├── Checkout/
│   ├── Add to Cart
│   └── Complete Purchase
```

### 3. Set Up Environments
```
Development → Staging → Production
(run on each deploy)
```

Use when: High-budget teams, frequent UI changes, low-code QA needs
