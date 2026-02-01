---
name: UXPilot Expert
description: UXPilot - AI UX research, user testing analysis, design recommendations
allowed-tools: Read, Edit, Bash, WebFetch
model: sonnet
---

# UXPilot Expert

AI-powered UX research and design guidance.

## What is UXPilot?

AI tools for UX research and design:
- Analyze user testing sessions
- Generate design recommendations
- Create user personas
- Identify usability issues

## Features

### Session Analysis
Upload user testing recordings and get:
- Key friction points identified
- Emotion detection
- Task completion analysis
- Improvement suggestions

### Design Critique
Submit designs for AI review:
- Accessibility issues
- Usability problems
- Design pattern violations
- Improvement recommendations

### Persona Generation
From user data, create:
- Detailed personas
- User journey maps
- Pain point documentation
- Opportunity areas

## AI-Powered UX Research Stack

### For Vibe Coders
Combine tools for comprehensive UX:

```
1. Hotjar/Clarity - Session recordings (free)
2. Claude Vision - Analyze recordings/screenshots
3. UXPilot/Maze - Structured testing
4. Notion - Document findings
```

## DIY UX with Claude Vision

### Design Review Prompt
```
Review this app screenshot for UX issues:

1. Information hierarchy - Is the most important info prominent?
2. Touch targets - Are buttons large enough (44pt minimum)?
3. Cognitive load - Is there too much on screen?
4. Accessibility - Color contrast, text size, labels?
5. Consistency - Do similar elements look/behave similarly?
6. Error prevention - Are destructive actions protected?

Screenshot: [attached]
```

### User Flow Analysis
```
Here are 5 screenshots showing our onboarding flow.
Analyze for:
1. Drop-off risk at each step
2. Unnecessary friction
3. Missing information
4. Opportunities to simplify

[attach screenshots 1-5]
```

### Competitive Analysis
```
Compare these 3 competitor app screenshots with ours.
What are they doing better?
What are we doing better?
What should we adopt?

[attach competitor + our screenshots]
```

## User Testing Patterns

### Guerrilla Testing
```
1. Find 5 people (friends, family, strangers)
2. Give them a task: "Sign up and find X"
3. Screen record (with permission)
4. Watch silently, take notes
5. Analyze recordings with Claude
```

### Think-Aloud Protocol
```
Ask users to verbalize thoughts while using app:
- "I'm looking for the settings..."
- "I'm confused why this button is here..."
- "Oh, I expected this to..."

Record and transcribe for AI analysis.
```

### A/B Testing
```
Use Firebase Remote Config or PostHog:
1. Create two design variations
2. Split traffic 50/50
3. Measure conversion/engagement
4. Ship winner
```

## Usability Heuristics

### Nielsen's 10 Heuristics (AI Checklist)
```
1. Visibility of system status
2. Match between system and real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency
8. Aesthetic and minimalist design
9. Help users recognize and recover from errors
10. Help and documentation
```

### Prompt for Heuristic Review
```
Review this screenshot against Nielsen's 10 usability heuristics.
Rate each 1-5 and explain issues found.
Prioritize fixes by impact.

[attach screenshot]
```

## Tools for Budget UX Research

### Free
- **Hotjar**: Heatmaps, recordings (free tier)
- **Microsoft Clarity**: Unlimited recordings
- **Google Forms**: Surveys
- **Loom**: Record yourself using app

### Affordable
- **Maze**: $99/mo for testing
- **Useberry**: $29/mo for prototypes
- **UsabilityHub**: $79/mo for quick tests

### Enterprise
- **UserTesting**: $$$
- **Optimal Workshop**: $$$

## Integration Workflow

```
1. Build feature in app
2. Screenshot key screens
3. Run through Claude Vision for UX review
4. Fix major issues
5. Deploy to TestFlight
6. Watch Clarity recordings
7. Iterate based on real user behavior
```

Use when: UX research, design critique, usability testing, persona creation
