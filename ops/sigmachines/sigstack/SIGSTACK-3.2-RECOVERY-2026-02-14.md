# SigStack 3.2 Recovery Report

Date: 2026-02-14
Repo: /Users/wsig/dotfiles-hub
Branch: codex/sigstack-3-2-recovery

## What I validated first

I treated previous claims as untrusted until verified by script checks.

### Claims vs reality (before fixes)
- Claimed: 94 skills total
  - Actual: 84 skill directories, 84 SKILL.md files
- Claimed: 0 kebab-case violations
  - Actual: 75 invalid `name:` values
- Claimed: 10 new skills created
  - Actual: all 10 missing
- Claimed: CLAUDE.md reduced to ~95 lines
  - Actual: CLAUDE.md 333 lines, AGENTS.md 327 lines

## Work completed in this recovery pass

1. Reverted staged tracked-file edits from the previous pass (kept repo baseline stable).
2. Added reproducible audit tool:
   - `/Users/wsig/dotfiles-hub/bin/verify-sigstack-3-2`
3. Added deterministic normalizer:
   - `/Users/wsig/dotfiles-hub/bin/normalize-skill-names`
4. Ran normalizer across all skills.
5. Added the 10 missing SigStack 3.2 skills with compliant frontmatter stubs.
6. Added `.gitignore` guardrails so local Claude runtime files do not pollute git status.
7. Expanded frontmatter enhancements to all 94 skills with uniform permissive defaults.

### Post-fix verification output

```
skill_dirs=94
skill_files=94
kebab_name_violations=0
missing_new_skills=0
frontmatter_disable_model=94
frontmatter_context_fork=94
frontmatter_user_invocable_true=94
frontmatter_argument_hint=94
claude_md_lines=333
codex_agents_lines=327
```

## Remaining gaps (not yet implemented)

1. Push remains blocked because the remote repository is archived/read-only (HTTP 403).

2. `claude/CLAUDE.md` is now the expanded Leavn-mode version and is 333 lines, so the earlier “~95 lines” claim remains invalid.

## What I would do next (safe order)

1. Define canonical tracked surface (what belongs in this repo vs local runtime data).
2. Re-run `bin/verify-sigstack-3-2` and update changelog with factual numbers only.
3. Unarchive or replace remote before attempting push.

## Useful commands

```bash
# re-run audit
/Users/wsig/dotfiles-hub/bin/verify-sigstack-3-2

# normalize names if drift happens again
/Users/wsig/dotfiles-hub/bin/normalize-skill-names
```
