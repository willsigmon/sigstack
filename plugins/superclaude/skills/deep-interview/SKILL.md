---
name: Deep Interview
description: Structured requirements interview that produces polished implementation specs. Grills the user with pointed, iOS-relevant questions before writing code.
allowed-tools: Read, Write, Glob, AskUserQuestion
model: sonnet
---

# Deep Interview

**Spec-first development. Ask hard questions now, avoid expensive rework later.**

## The Pattern

```
Feature description → Pointed questions (8-15 rounds) → Polished @spec.md → Implementation
```

## When to Use

- New flows touching 3+ screens
- New data models or persistence changes
- Architectural decisions with real trade-offs
- Features with non-obvious edge cases
- Anything where "just build it" would lead to rework

## When NOT to Use

- Bug fixes
- Single-screen UI tweaks
- Adding a button with obvious behavior
- Text/color/spacing changes

## Question Taxonomy (iOS-Adapted)

Focus questions on what actually matters for iOS app development:

### Always Cover
```
1. Core invariant — the one thing that must never break
2. Data model — what's stored, where, relationships
3. UI/UX flows — screens, states (loading/empty/error/success)
4. State management — @Observable, environment, bindings
5. Edge cases — what goes wrong, blast radius
```

### Cover If Relevant
```
6. Offline behavior & sync (CloudKit, conflict resolution)
7. Permissions & entitlements (camera, notifications, etc.)
8. Accessibility (VoiceOver, Dynamic Type)
9. Performance (large lists, memory, battery)
10. Future extension points
```

### Skip Unless Explicitly Needed
```
- Tenancy models
- i18n / l10n
- API contract design
- Enterprise scale concerns
- Observability / analytics
```

## Asking Style

### One Cluster at a Time
Ask 1-3 closely related questions per round. Never dump 10 questions.

### Teach While Asking
Brief context before the question — one sentence explaining why it matters.
Don't lecture. The user is learning, not being tested.

### Use Structured Choices When Sharp
AskUserQuestion with concrete options when it narrows the decision space.
Open-ended when the answer space is too wide for multiple choice.

### Pointed, Not Generic
```
Bad:  "What database do you want?"
Good: "When the user closes mid-edit, should changes auto-save, require
       explicit save, or be discarded?"
```

## Exit Conditions

Stop interviewing when at least two are true:
- User says "done" / "write the spec" / "that's enough"
- ≥ 8 rounds asked, no new topics in last 2 rounds
- Spec can be written with < 5 remaining questions

## Spec Output

Write to `@spec.md` (or versioned: `@spec-v2.md`, `@feature-spec.md`).

10 sections max. Omit empty sections:
1. Goal
2. Non-goals
3. Core Invariants
4. User Stories & Acceptance Criteria
5. Data Model
6. UI/UX Flows
7. Edge Cases & Error Handling
8. Testing Approach
9. Known Trade-offs
10. Open Questions (should be < 3)

## Integration with SigStack

After spec is approved, hand off to normal execution flow:
- Decision phase confirms approach
- Spawn agents for implementation
- Spec serves as the source of truth for all agents

Use when: New feature interview, spec writing, requirements gathering, "grill me", "deep spec"
