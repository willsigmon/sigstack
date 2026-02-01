## Legend
| Symbol | Meaning | | Abbrev | Meaning |
|--------|---------|---|--------|---------|
| → | leads to | | MC | multiple choice |
| & | and/with | | UX | user experience |
| w/ | with | | AC | acceptance criteria |

Deep spec interview mode. Grill the user w/ pointed questions → produce a polished spec.

Activate on: `/interview`, "interview me", "grill me on this", "deep spec interview",
"run the question drill", "spec interview mode", or any description + "make it really solid",
"think deeply", "no obvious bugs later", "surface all tradeoffs".

## Phase 1: Acknowledge & Frame

First response after activation:
```
Understood. Entering deep interview mode.
Goal: produce @spec.md (or spec-v2.md if one exists)
Starting with your description: «summarize what user gave»
```

Check for existing `@spec*.md` files. If found, note version & increment.

## Phase 2: Question Strategy (internal — do NOT show this to user)

Prioritize **non-obvious, high-leverage** questions. Cover minimum:

### iOS-Adapted Question Taxonomy
1. **Core invariant** — single most important outcome that must never break
2. **Data model & persistence** — SwiftData, CloudKit, UserDefaults, what gets stored where
3. **UI/UX flows & navigation** — screens, transitions, loading states, empty states
4. **State management & data flow** — @Observable, environment, bindings
5. **Offline behavior & sync** — what works offline? conflict resolution?
6. **Error states & recovery UX** — what the user sees when things fail
7. **Permissions & entitlements** — camera, notifications, HealthKit, etc.
8. **Edge cases & failure modes** — what can go wrong, what's the blast radius
9. **Accessibility** — VoiceOver, Dynamic Type, color contrast basics
10. **Testing approach** — what's worth testing, what's not
11. **Performance** — large lists, memory, battery, network usage
12. **Future extension points** — what will almost certainly be asked for next
13. **Trade-offs being made right now** — what user is implicitly choosing

Skip categories that clearly don't apply. Don't ask about tenancy, i18n, or enterprise scale
unless the feature actually touches them.

## Phase 3: Asking Style

### Rules
- Ask **one focused cluster** at a time (1–3 closely related questions)
- Use AskUserQuestion tool w/ structured options when it **sharply narrows** possibilities
- Phrase questions **open-ended but pointed**

### Bad vs Good
- Bad: "What database do you want?"
- Good: "When the user closes the app mid-edit, should their changes persist automatically, require explicit save, or be discarded?"

### MC When It Helps
Use MC format when choices are concrete & bounded:
```
How should this data persist across app launches?

A) SwiftData — structured, queryable, supports CloudKit sync
B) UserDefaults — simple key-value, no sync
C) File system — custom format, full control
D) No persistence needed — ephemeral only
```

### Teaching While Asking
Since user is learning iOS dev, each question cluster should briefly explain **why it matters**
before asking. One sentence max. Don't lecture.

Example:
```
SwiftData handles persistence + CloudKit sync together, but locks you into Apple's
conflict resolution. Given that:
— Do users ever edit the same item from multiple devices?
— Is losing the older edit acceptable, or do you need merge logic?
```

### Pacing
- After ~4–7 question rounds, check:
  ```
  Are we getting close, or are there still large uncovered areas?
  ```
- Never exceed 15 rounds. If still unclear, note gaps as Open Questions in spec.

## Phase 4: Exit Condition

Interview is complete when **at least two** of:
1. User explicitly says "that's enough" / "done" / "write the spec" / "looks good"
2. Asked ≥ 8 meaningful rounds AND no large new topic in last 2 rounds
3. You can write a spec that lets a competent dev implement w/ < 5 clarifying questions

## Phase 5: Write the Spec

Say: `Interview complete. Writing spec now…`

Use Write tool. File: `@spec.md` (or `@spec-v2.md`, `@{feature-slug}-spec.md`).

### Spec Structure (10 sections — no empty sections)

```markdown
# Feature: «clear one-line title»

## 1. Goal
One sentence. What this feature does and why it matters.

## 2. Non-goals
What this feature explicitly does NOT do. Scope boundaries.

## 3. Core Invariants
Things that must NEVER break. The "if this fails, everything fails" list.

## 4. User Stories & Acceptance Criteria
Concrete scenarios w/ AC. Testable. No ambiguity.

## 5. Data Model
What gets stored, where, relationships. SwiftData models if applicable.

## 6. UI/UX Flows
Screen-by-screen. States: loading, empty, error, success.
Navigation paths. Animations if specified.

## 7. Edge Cases & Error Handling
What can go wrong → what the user sees → recovery path.

## 8. Testing Approach
What to test, what not to test, critical paths.

## 9. Known Trade-offs
What was chosen, what was rejected, why.

## 10. Open Questions
Anything still unresolved. Should be very few (< 3).
```

**Omit sections that are empty.** Don't pad w/ boilerplate.

## Phase 6: Review

After writing, show first ~15 lines inline & ask:
```
Spec written to @spec.md.

Quick review:
• Anything critically missing or wrong?
• Want to refine any section?
• Ready to move to implementation?
```

## Complexity Gate

NOT every feature needs a full interview. Skip interview & use normal decision phase for:
- Single screen, no new data model
- Bug fixes
- UI tweaks (colors, spacing, text)
- Adding a button w/ obvious behavior

Only trigger full interview for:
- Flows touching 3+ screens
- New data models or persistence changes
- Real architectural decisions
- Features w/ non-obvious edge cases

If the feature is too small for interview, say so:
```
This is small enough to skip the interview. Here's what I'd do: [decision phase summary]
Want the full interview anyway?
```

Deliverables: `@spec.md` w/ 10-section structure, clear enough for implementation
