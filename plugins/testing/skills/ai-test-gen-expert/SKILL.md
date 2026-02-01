---
name: AI Test Generation Expert
description: AI-powered test generation - mabl, Qodo Cover, automated coverage improvement
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# AI Test Generation Expert

Leverage AI to automatically generate and improve tests.

## Top Tools (2026)

### mabl
- AI-driven test creation (2x faster)
- Self-healing tests
- Web, mobile, API testing
- Starting ~$500/mo (custom pricing)

### Qodo Cover
- Open source test generation
- Targets coverage gaps
- GitHub Actions integration
- Free CLI tool

### Testim (Tricentis)
- AI-powered element detection
- Codeless + code options
- Enterprise focused

### Virtuoso QA
- Natural language test creation
- 85% maintenance reduction
- Self-healing automation

## Qodo Cover Setup

```bash
# Install
pip install qodo-cover

# Run on file
qodo-cover \
  --source-file src/calculator.ts \
  --test-file tests/calculator.test.ts \
  --code-coverage-report coverage/lcov.info

# GitHub Action
- uses: qodo-ai/qodo-cover-action@v1
  with:
    project-language: typescript
    source-file: src/calculator.ts
```

## AI Test Generation Patterns

### Coverage Gap Targeting
```
1. Run existing tests
2. Collect coverage report
3. AI analyzes uncovered lines
4. Generate tests for gaps
5. Validate and merge
```

### Mutation Testing
```
1. AI generates code mutations
2. Tests run against mutants
3. Find tests that don't catch bugs
4. Generate missing assertions
```

### Property-Based Generation
```typescript
// AI generates property tests
test.prop([fc.integer(), fc.integer()])('addition commutes', (a, b) => {
  expect(add(a, b)).toBe(add(b, a));
});
```

## Best Practices

1. **Start with coverage report**
   - Know what's untested
   - Prioritize critical paths

2. **Review generated tests**
   - AI tests need human review
   - Ensure meaningful assertions
   - Check edge cases

3. **Integrate in CI**
   - Run coverage checks
   - Fail on coverage drops
   - Generate tests for new code

4. **Combine with existing tests**
   - Don't replace human tests
   - Augment coverage gaps
   - Learn from existing patterns

## Coverage Goals
- 80% line coverage baseline
- 90% for critical paths
- 100% for security functions

Use when: Improving test coverage, generating edge case tests, reducing testing debt
