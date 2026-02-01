---
name: GitHub Actions Expert
description: GitHub Actions CI/CD - workflows, reusable actions, matrix builds, secrets management
allowed-tools: Read, Edit, Bash
model: sonnet
---

# GitHub Actions CI/CD Expert

Master GitHub Actions for automated builds, tests, and deployments.

## Key Advantages
- Deep GitHub integration
- Free for public repos
- 2,000 free minutes/mo (private)
- YAML-based configuration
- Extensive marketplace

## Workflow Patterns

### iOS Build & TestFlight
```yaml
name: iOS Build
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Install dependencies
        run: bundle exec pod install

      - name: Build & Upload
        env:
          APP_STORE_CONNECT_API_KEY: ${{ secrets.ASC_KEY }}
        run: |
          bundle exec fastlane beta
```

### Node.js CI with Caching
```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
```

### Matrix Strategy
```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

### Reusable Workflows
```yaml
# .github/workflows/deploy.yml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      DEPLOY_KEY:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - run: echo "Deploying to ${{ inputs.environment }}"
```

## Secrets Management
- Repository secrets: Settings → Secrets
- Environment secrets: Per-environment isolation
- OIDC tokens: Passwordless cloud auth

## AI Integration (2026)
- GitHub Copilot in Actions: Suggest workflow improvements
- AI-powered failure diagnosis
- Predictive test selection

Use when: CI/CD pipelines, automated testing, deployment automation, GitHub-based workflows
