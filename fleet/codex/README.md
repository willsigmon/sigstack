# Codex (App/CLI) Configuration

This folder contains the Codex config + instruction files used on the Sigstack machines.

Tracked files:
- `codex/config.toml`: template copy of `~/.codex/config.toml` (secrets redacted)
- `codex/instructions.md`: `~/.codex/instructions.md`
- `codex/AGENTS.md`: `~/.codex/AGENTS.md`

## What This Enables

- `web_search = "live"` (replaces deprecated `[features].web_search_request`)
- `model_instructions_file` pointing at `~/.codex/instructions.md`
- `project_doc_fallback_filenames = ["CLAUDE.md"]`
- profiles: `fast` and `deep`

## Safety

`codex/config.toml` is a template. Keep secrets out of git.
