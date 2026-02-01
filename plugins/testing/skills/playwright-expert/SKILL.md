---
name: Playwright Expert
description: Playwright testing - cross-browser, auto-waiting, visual testing, mobile emulation
allowed-tools: Read, Edit, Bash
model: sonnet
---

# Playwright Testing Expert

Modern end-to-end testing with Playwright.

## Why Playwright
- Cross-browser (Chrome, Firefox, Safari)
- Auto-waiting (no flaky tests)
- Mobile emulation
- API testing
- Visual regression
- Trace viewer debugging

## Setup

```bash
pnpm create playwright
# or
pnpm add -D @playwright/test
npx playwright install
```

## Test Patterns

### Basic Test
```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

### Page Object Model
```typescript
// pages/login.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/auth.spec.ts
test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/login');
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

### API Testing
```typescript
test('API health check', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toEqual({ status: 'ok' });
});
```

### Visual Regression
```typescript
test('homepage visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### Mobile Testing
```typescript
import { devices } from '@playwright/test';

test.use(devices['iPhone 14']);

test('mobile menu', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="menu-toggle"]');
  await expect(page.locator('nav')).toBeVisible();
});
```

## Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
});
```

## MCP Integration
Playwright MCP server enables browser automation directly from Claude.

Use when: E2E testing, cross-browser testing, visual regression, API testing
