---
name: Prompt Compression
description: Write shorter prompts that get better results
allowed-tools: Read, Edit
model: haiku
---

# Prompt Compression

Fewer words, better results.

## The Compression Mindset

```
Verbose: 500 tokens, ambiguous
Compressed: 50 tokens, precise

Claude understands context.
You don't need to explain everything.
```

## Before/After Examples

### File Operations
```
# BAD (67 tokens)
"I would like you to please open the file located at
src/components/Button.swift and read through it carefully
to understand what it does, then make changes to fix
the styling issue I mentioned earlier."

# GOOD (12 tokens)
"Fix the Button.swift styling issue we discussed."
```

### Code Review
```
# BAD (89 tokens)
"Can you please review this code and look for any
potential bugs, security vulnerabilities, performance
issues, code style violations, and also check if there
are any improvements that could be made to make the
code more maintainable and readable?"

# GOOD (8 tokens)
"Review for bugs, security, and performance."
```

### Feature Request
```
# BAD (112 tokens)
"I want to add a new feature to my app. The feature
should allow users to log in using their email and
password. When they enter their credentials and tap
the login button, it should validate the input and
then make an API call to our backend server to
authenticate them..."

# GOOD (18 tokens)
"Add email/password login with validation and API auth."
```

## Compression Techniques

### 1. Drop Pleasantries
```
❌ "Could you please..."
❌ "I would like you to..."
❌ "Would you mind..."

✓ Just state the task.
```

### 2. Use References
```
❌ "The file we were working on earlier"
✓ "Button.swift"

❌ "That error we discussed"
✓ "The nil crash on line 42"
```

### 3. Imply Context
```
❌ "In the Swift file for the login screen..."
✓ "In LoginView.swift..."

Claude knows Swift files have .swift extension.
```

### 4. Use Shorthand
```
auth = authentication
config = configuration
impl = implementation
func = function
params = parameters
```

### 5. List, Don't Explain
```
❌ "Check for bugs, and also look at security, and
   don't forget about performance issues"

✓ "Check: bugs, security, performance"
```

## Context Compression

### Summarize Long Conversations
```
Every 10-15 messages:
"Summarize our progress in 3 bullets."

Use summary as checkpoint for future sessions.
```

### Scope Narrowing
```
After exploration:
"Focus only on auth.swift now.
Forget the other files."
```

### Reference by Result
```
After Claude finds something:
"Fix that" (Claude remembers what 'that' is)

Not: "Fix the bug you found in the authentication
module in the validateCredentials function..."
```

## The 10-Word Challenge

Try to express any request in ~10 words:

```
"Add dark mode toggle to settings" (6 words)
"Fix the crash when tapping save" (6 words)
"Review PR #123 for security issues" (6 words)
"Why is login slow on first launch?" (7 words)
"Refactor UserService to use async/await" (5 words)
```

## When Verbosity Helps

### Complex Requirements
```
When precision matters more than brevity:
- API contracts
- Security requirements
- Edge case handling

Be explicit about constraints.
```

### Teaching/Onboarding
```
First time explaining a codebase pattern:
More context helps Claude learn.

After that:
"Same pattern as UserService"
```

## Token Math

```
Average request: 100-500 tokens
Compressed request: 20-50 tokens

10 requests/hour × 8 hours = 80 requests/day

Verbose: 40,000 tokens/day
Compressed: 4,000 tokens/day

10x savings.
```

Use when: Every prompt, especially in long sessions
