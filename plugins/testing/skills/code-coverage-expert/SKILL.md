---
name: Code Coverage Expert
description: Code coverage tools - Codecov, Istanbul, coverage thresholds, CI integration
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Code Coverage Expert

Measure and improve test coverage across your codebase.

## Tools Comparison (2026)

| Tool | Best For | Free Tier | Pricing |
|------|----------|-----------|---------|
| Codecov | Team coverage | Open source | $29/user/mo |
| Coveralls | Simple setup | Open source | $10/repo/mo |
| Istanbul/nyc | JavaScript | Free | Free |
| llvm-cov | Swift/C++ | Free | Free |

## Codecov Setup

### GitHub Actions
```yaml
- uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./coverage/lcov.info
    fail_ci_if_error: true
    verbose: true
```

### Coverage Thresholds
```yaml
# codecov.yml
coverage:
  status:
    project:
      default:
        target: 80%
        threshold: 2%
    patch:
      default:
        target: 90%
```

## JavaScript/TypeScript (Istanbul)

### Setup with Jest
```json
{
  "jest": {
    "collectCoverage": true,
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### Vitest Coverage
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
      }
    }
  }
})
```

## Swift Coverage

### Xcode Coverage
```bash
# Enable coverage in scheme
xcodebuild test \
  -scheme App \
  -enableCodeCoverage YES \
  -resultBundlePath TestResults.xcresult

# Extract report
xcrun xccov view --report TestResults.xcresult
```

### Export to Codecov
```bash
# Convert to lcov format
xcrun llvm-cov export \
  -format=lcov \
  -instr-profile coverage.profdata \
  App.app/App > coverage.lcov
```

## Coverage for Vibe Coders

### Minimum Viable Coverage
```
Core business logic: 80%+
UI code: 40-60% (visual testing preferred)
Generated code: Skip
Third-party wrappers: Skip
```

### Quick Win: Cover Critical Paths
```bash
# Find uncovered critical files
npx nyc report --reporter=text | grep -E "0%|[1-4][0-9]%"
```

## CI Integration Pattern

```yaml
jobs:
  test:
    steps:
      - run: pnpm test --coverage
      - uses: codecov/codecov-action@v4

  coverage-gate:
    needs: test
    steps:
      - run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage below 80%!"
            exit 1
          fi
```

Use when: Setting up coverage, CI thresholds, improving test quality
