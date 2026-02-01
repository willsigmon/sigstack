---
name: Qodo Cover Expert
description: Qodo Cover - AI-generated test coverage, automatic test writing
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# Qodo Cover Expert

AI-powered test generation for automatic coverage improvement.

## What is Qodo Cover?

Formerly Codium Cover - uses AI to automatically generate meaningful tests.

- Analyzes your code semantically
- Generates edge cases automatically
- Finds bugs through test generation
- Integrates with CI/CD

## Pricing (2026)

- **Free**: 10 test generations/month
- **Pro**: $19/month - Unlimited generations
- **Team**: $49/user/month - CI integration

## CLI Installation

```bash
pip install qodo-cover
```

## Basic Usage

### Generate Tests for File
```bash
qodo-cover generate src/utils/validation.ts
```

### Output
```typescript
// Generated tests for validation.ts
describe('validateEmail', () => {
  it('should accept valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should reject email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('should reject email with spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });

  // AI found edge case!
  it('should handle unicode domains', () => {
    expect(validateEmail('user@例え.jp')).toBe(true);
  });
});
```

## Configuration

### qodo.yaml
```yaml
language: typescript
test_framework: jest
coverage_target: 80
output_dir: __tests__/generated

exclude:
  - "**/*.d.ts"
  - "**/node_modules/**"

focus:
  - src/core/**
  - src/utils/**
```

## CI Integration

### GitHub Actions
```yaml
name: AI Test Generation
on:
  pull_request:
    paths:
      - 'src/**/*.ts'

jobs:
  generate-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate Tests
        run: |
          pip install qodo-cover
          qodo-cover generate --changed-files
        env:
          QODO_API_KEY: ${{ secrets.QODO_API_KEY }}

      - name: Run Generated Tests
        run: pnpm test

      - name: Comment Coverage
        uses: actions/github-script@v6
        with:
          script: |
            // Post coverage improvement comment
```

## Best Practices

### 1. Review Generated Tests
```bash
# Generate but don't auto-commit
qodo-cover generate src/ --dry-run

# Review and curate
qodo-cover generate src/ --interactive
```

### 2. Focus on Complex Logic
```bash
# Target high-complexity files
qodo-cover generate --complexity-threshold 10
```

### 3. Combine with Manual Tests
```
__tests__/
├── generated/     # AI-generated (don't edit)
├── unit/          # Manual unit tests
└── integration/   # Manual integration tests
```

## Swift Support

```bash
qodo-cover generate Sources/App/ \
  --language swift \
  --test-framework xctest
```

## Comparison: AI Test Generators

| Tool | Languages | Quality | Price |
|------|-----------|---------|-------|
| Qodo Cover | TS, Python, Java | High | $19/mo |
| Copilot | All | Medium | $19/mo |
| Diffblue | Java only | Very High | Enterprise |
| Mabl | E2E only | High | $500+/mo |

Use when: Bootstrapping tests, increasing coverage quickly, finding edge cases
