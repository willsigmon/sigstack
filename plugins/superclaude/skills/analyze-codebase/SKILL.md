---
name: Analyze Codebase
description: Deep codebase analysis using agent swarms
allowed-tools: Task, Read, Glob, Grep
model: sonnet
---

# Analyze Codebase

**Understand any codebase quickly.**

## Analysis Types

### Architecture Overview
```
"What's the architecture of this codebase?"

Agents analyze:
- Entry points
- Layer structure
- Data flow
- Dependencies
- Key abstractions
```

### Pattern Inventory
```
"What patterns does this codebase use?"

Agents find:
- Design patterns (MVVM, etc.)
- Code conventions
- Naming schemes
- File organization
- Common idioms
```

### Health Check
```
"How healthy is this codebase?"

Agents assess:
- Code complexity
- Test coverage
- Dead code
- Duplications
- Tech debt indicators
```

### Dependency Map
```
"Map the dependencies"

Agents trace:
- Internal dependencies
- External packages
- Circular references
- Coupling points
- Isolated modules
```

## Quick Commands

### 5-Minute Overview
```
"Quick overview: What does this codebase do?"

Returns:
- Purpose
- Main components
- Entry points
- Key files
```

### Entry Point Discovery
```
"Where does execution start?"

For apps:
- main(), App.swift, index.ts
- Configuration loading
- Initialization sequence
```

### Data Flow
```
"Trace data from [source] to [destination]"

Returns:
- Flow path
- Transformations
- Storage points
- Exit points
```

## Agent Deployment

### Parallel Exploration
```
Spawn 5 agents:
1. Structure analyzer (files, folders)
2. Entry point finder
3. Pattern identifier
4. Dependency mapper
5. Test coverage checker

Results in <1 minute.
```

### Deep Dive
```
After overview:
"Deep dive into [specific area]"

Focused analysis with full context.
```

## Output Formats

### For Understanding
```
Narrative explanation
Key concepts highlighted
Examples shown
Gotchas noted
```

### For Documentation
```
Markdown structure
Diagrams (Mermaid)
Code references
File links
```

### For Onboarding
```
Step-by-step guide
"Start here" pointer
Learning path
Common tasks
```

## Codebase Types

### iOS/Swift
```
Analyze:
- App lifecycle
- View hierarchy
- Data persistence
- Networking layer
- State management
```

### Web/React
```
Analyze:
- Component tree
- State management
- Routing
- API integration
- Build pipeline
```

### Backend/Node
```
Analyze:
- Server setup
- Route handlers
- Database access
- Middleware
- Authentication
```

## Integration with Memory

### Store Findings
```
After analysis:
"Remember: [key insight]"

Never re-analyze for the same question.
```

### Update CLAUDE.md
```
Add architecture notes:
- Key abstractions
- Important patterns
- Gotchas discovered
```

## Example Prompt

```
Analyze this iOS codebase:

1. What's the architecture pattern?
2. How is state managed?
3. Where's the networking code?
4. What persistence is used?
5. How are views structured?

Return a concise overview I can reference.
```

Use when: New codebase, architecture review, onboarding
