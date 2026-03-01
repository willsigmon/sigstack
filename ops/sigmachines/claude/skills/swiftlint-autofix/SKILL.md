---
name: swiftlint-autofix
description: Run SwiftFormat and fix all auto-correctable SwiftLint issues
model: haiku
disable-model-invocation: false
context: fork
user-invocable: true
argument-hint: "[context]"
---

# SwiftLint Auto-Fix Workflow

Automatically fix code style issues:

1. **Run SwiftFormat:**
```bash
make format
```

2. **Run SwiftLint with autocorrect:**
```bash
swiftlint --fix --quiet
```

3. **Check remaining issues:**
```bash
swiftlint | grep -E "(error:|warning:)" | head -20
```

4. **Report:**
- Files formatted count
- Issues auto-fixed count
- Remaining manual issues
- File paths needing manual attention

**Return concise summary of what was fixed.**
