---
name: bible-feature-expert
description: Work with Leavn Bible features - chapter rendering, verse search, translations, reading modes, AI transformations, Scripture database
allowed-tools: Read, Edit, Grep, Glob
disable-model-invocation: false
context: fork
user-invocable: true
argument-hint: "[context]"
---

# Bible Feature Expert

Expert in Leavn's Bible architecture:

**Key Files**:
- BibleViewModel - Main state
- ChapterView - Chapter rendering
- OptimizedBibleContent - Verse display + AI
- BibleService - Scripture APIs
- ScriptureDatabase - FTS5 search

**Common tasks**:
- Fix rendering issues
- Optimize AI transformations
- Add translation support
- Debug search
- Performance tuning

Use when: Bible features, Scripture issues, verse rendering, search problems
