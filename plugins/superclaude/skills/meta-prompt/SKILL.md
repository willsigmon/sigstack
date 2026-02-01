---
name: Meta Prompt
description: Generate optimal prompts for complex tasks
allowed-tools: Read, Edit
model: sonnet
---

# Meta Prompt

**Make Claude better at understanding you.**

## When to Use

- Complex task, unclear how to express it
- Want optimal results, not just good
- Creating reusable prompts (skills)
- Teaching Claude new patterns

## Meta Prompt Pattern

### Ask for the Prompt
```
"What's the best way to ask you to [task]?"

Claude returns optimal prompt structure.
Then use that prompt.
```

### Prompt Improvement
```
"Here's my prompt: [prompt]
How can I improve it for better results?"

Claude refines your approach.
```

### Constraint Discovery
```
"What constraints would help you [task] better?"

Claude reveals what it needs to know.
```

## Prompt Architecture

### Structure
```
1. Context (what you're working on)
2. Goal (what you want)
3. Constraints (what to avoid/include)
4. Format (how to return results)
5. Examples (if helpful)
```

### Example
```
Context: iOS app with SwiftUI
Goal: Add dark mode toggle to settings
Constraints:
- Use existing Theme system
- Support system preference
- Persist user choice
Format: Complete Swift code with comments
```

## Prompt Templates

### Feature Request
```
"In [codebase], add [feature].
Use existing [patterns].
Follow [conventions].
Return: [deliverables]"
```

### Bug Investigation
```
"[Symptom] is happening.
Expected: [expected behavior]
Actual: [actual behavior]
Find root cause and fix."
```

### Code Review
```
"Review [code] for:
- [Concern 1]
- [Concern 2]
- [Concern 3]
Return issues ranked by severity."
```

### Architecture Decision
```
"Need to choose between [A] and [B] for [use case].
Consider: [factors]
Recommend with reasoning."
```

## Skill Creation

### From Repeated Prompts
```
Notice: Same prompt used 3+ times

"Turn this into a reusable skill:
[your repeated prompt]"

Claude creates SKILL.md.
```

### Skill Structure
```yaml
---
name: Skill Name
description: When to use this
allowed-tools: [tools]
model: [model]
---

# Skill Name

[The optimized prompt content]
```

## Prompt Debugging

### Not Getting Good Results?
```
"My prompt: [prompt]
I'm getting: [current results]
I want: [desired results]
What's wrong with my prompt?"
```

### Too Verbose?
```
"Compress this prompt while keeping quality:
[long prompt]"
```

### Too Vague?
```
"Make this more specific:
[vague prompt]"
```

## Advanced Patterns

### Chain of Thought
```
"Think through this step by step:
1. First, understand [aspect]
2. Then, identify [aspect]
3. Finally, implement [solution]"
```

### Few-Shot Learning
```
"Here are examples of what I want:
Input: [A] → Output: [X]
Input: [B] → Output: [Y]

Now do: Input: [C] → Output: ?"
```

### Role Assignment
```
"Act as a [role] reviewing [thing].
Focus on [concerns] a [role] would have."
```

## Prompt Economics

### Token Efficiency
```
Short prompt + clear constraints > Long prompt + vague intent
```

### Reuse
```
Good prompt used 100 times = Skill
Skill invocation = 50 tokens
Manual prompt = 500 tokens

90% savings.
```

## Quick Commands

```
"Best prompt for [task]?"
"Improve: [prompt]"
"Compress: [prompt]"
"Turn into skill: [prompt]"
```

Use when: Optimizing prompts, creating skills, complex tasks
