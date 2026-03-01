---
name: {{name}}
description: {{description}}
allowed-tools: Bash, Read, Grep, Edit
{{#if author}}author: {{author}}{{/if}}
category: debugging
---

# {{name}}

{{description}}

## Debugging Process

### 1. Reproduce the Issue
- [ ] Get exact steps to reproduce
- [ ] Identify conditions (environment, data, timing)
- [ ] Verify the issue is consistent

### 2. Gather Information
- [ ] Error messages and stack traces
- [ ] Log files
- [ ] System state at time of error
- [ ] User actions leading to error

### 3. Form Hypothesis
- [ ] What could cause this behavior?
- [ ] What changed recently?
- [ ] Similar issues in the past?

### 4. Test Hypothesis
- [ ] Add logging/debugging statements
- [ ] Run debugger with breakpoints
- [ ] Test edge cases
- [ ] Verify assumptions

### 5. Fix and Verify
- [ ] Implement fix
- [ ] Test fix works
- [ ] Check for side effects
- [ ] Add regression test

## Debugging Techniques

### Print Debugging
```{{language}}
{{#if print_examples}}
{{print_examples}}
{{else}}
// Add strategic print statements
console.log('State before:', state);
doSomething();
console.log('State after:', state);
{{/if}}
```

### Debugger
```bash
{{#if debugger_commands}}
{{debugger_commands}}
{{else}}
# Set breakpoints
# Step through code
# Inspect variables
# Check call stack
{{/if}}
```

### Logging
```{{language}}
{{#if logging_examples}}
{{logging_examples}}
{{else}}
// Structured logging
logger.debug('Processing item', { id, status });
logger.error('Failed to process', { error, context });
{{/if}}
```

## Common Issues

{{#if common_issues}}
{{#each common_issues}}
### {{this.title}}

**Symptoms:**
{{this.symptoms}}

**Diagnosis:**
{{this.diagnosis}}

**Fix:**
{{this.fix}}

{{/each}}
{{else}}
### Null/Undefined Values
- Check initialization
- Verify data loading
- Add null checks

### Unexpected Behavior
- Check assumptions
- Verify input data
- Review recent changes

### Performance Issues
- Profile the code
- Check for loops
- Look for memory leaks
{{/if}}

## Tools and Commands

{{#if debug_tools}}
{{#each debug_tools}}
### {{this.name}}

{{this.description}}

```bash
{{this.commands}}
```

{{/each}}
{{else}}
### System Logs
```bash
# View logs
tail -f /var/log/app.log

# Filter errors
grep ERROR /var/log/app.log

# Follow specific process
ps aux | grep myapp
```

### Network Debugging
```bash
# Check connections
netstat -an | grep LISTEN

# Test endpoint
curl -v https://api.example.com/endpoint
```
{{/if}}

## Debugging Workflow

```
ISSUE: {{issue_description}}

OBSERVED:
- [What user/system sees]

EXPECTED:
- [What should happen]

DIAGNOSTIC STEPS:
1. [First check]
   → Result:
2. [Second check]
   → Result:
3. [Investigation]
   → Finding:

ROOT CAUSE:
[What's actually wrong]

FIX:
[Code change or configuration]

VERIFICATION:
1. [Test case 1]
2. [Test case 2]
3. [Edge cases]

PREVENTION:
- [How to avoid in future]
- [Tests to add]
```

## When to Use

{{when_to_use}}

{{#if related_tools}}
## Related Tools

{{#each related_tools}}
- **{{this.name}}**: {{this.description}}
{{/each}}
{{/if}}
