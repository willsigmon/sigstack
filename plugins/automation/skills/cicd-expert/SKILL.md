---
name: CI/CD Expert
description: Multi-platform CI/CD - GitHub Actions, GitLab CI, Bitrise, best practices for mobile and web
allowed-tools: Read, Edit, Bash
model: sonnet
---

# CI/CD Expert

Cross-platform continuous integration and deployment patterns.

## Platform Comparison (2026)

| Platform | Best For | Free Tier | Pricing |
|----------|----------|-----------|---------|
| GitHub Actions | GitHub repos | 2000 min/mo | $0.008/min |
| GitLab CI | GitLab repos | 400 min/mo | $0.0008/min |
| Bitrise | Mobile | 300 credits | $35/mo+ |
| CircleCI | Speed | 6000 min/mo | $15/mo+ |
| Xcode Cloud | Apple-only | 25 hrs/mo | In Apple Dev |

## Universal Best Practices

### 1. Cache Dependencies
```yaml
# GitHub Actions
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('pnpm-lock.yaml') }}

# GitLab CI
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
```

### 2. Fail Fast
```yaml
jobs:
  test:
    strategy:
      fail-fast: true
      matrix:
        node: [18, 20, 22]
```

### 3. Parallel Jobs
```yaml
# Run independent jobs in parallel
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: ...

  test:
    runs-on: ubuntu-latest
    steps: ...

  build:
    needs: [lint, test]  # Only after parallel jobs pass
    steps: ...
```

### 4. Artifacts and Reports
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: coverage/
```

## Mobile CI Patterns

### iOS (GitHub Actions)
```yaml
jobs:
  ios:
    runs-on: macos-14
    steps:
      - uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '15.2'
      - run: xcodebuild test -scheme App -destination 'platform=iOS Simulator,name=iPhone 15'
```

### Android
```yaml
jobs:
  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - run: ./gradlew test assembleRelease
```

## Web CI Patterns

### Node.js
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install && pnpm test && pnpm build
```

## Security in CI

```yaml
# Secret scanning
- uses: trufflesecurity/trufflehog@main

# Dependency scanning
- uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## AI Integration (2026)
- Predictive test selection
- Intelligent failure diagnosis
- Auto-fix suggestions
- Risk assessment for changes

Use when: Setting up CI/CD, optimizing pipelines, multi-platform builds
