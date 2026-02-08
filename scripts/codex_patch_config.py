#!/usr/bin/env python3
"""Idempotently patch ~/.codex/config.toml with our preferred Codex settings.

We do minimal text surgery (not a full TOML rewrite) to preserve comments/order.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


WEB_SEARCH_LINE = 'web_search = "live"\n'
FALLBACK_DOCS_LINE = 'project_doc_fallback_filenames = ["CLAUDE.md"]\n'

PROFILES_BLOCK = """
[profiles.fast]
# Cheap + snappy: for quick edits, simple questions, small refactors.
model_reasoning_effort = "low"
model_max_output_tokens = 8000

[profiles.deep]
# Default "big brain" mode: for architecture, gnarly bugs, migrations.
model_reasoning_effort = "xhigh"
model_max_output_tokens = 32000
""".lstrip()


def _has_top_level_key(text: str, key: str) -> bool:
    return re.search(rf"(?m)^{re.escape(key)}\s*=", text) is not None


def _remove_deprecated_features_key(text: str) -> str:
    return re.sub(r"(?m)^\s*web_search_request\s*=.*\n", "", text)


def _ensure_insert_before_features(text: str, line: str) -> str:
    if line.rstrip("\n") in text:
        return text

    m = re.search(r"(?m)^\[features\]\s*$", text)
    if not m:
        return text + ("\n" if not text.endswith("\n") else "") + line

    insert_at = m.start()
    prefix = text[:insert_at]
    suffix = text[insert_at:]

    if prefix and not prefix.endswith("\n\n"):
        if prefix.endswith("\n"):
            prefix += "\n"
        else:
            prefix += "\n\n"

    return prefix + line + suffix


def _ensure_model_header_keys(text: str) -> str:
    # Use an absolute path so Codex can always find it (works across macOS/Linux).
    instructions_path = (Path.home() / ".codex" / "instructions.md").as_posix()
    model_instr_line = f'model_instructions_file = "{instructions_path}"\n'

    if model_instr_line.rstrip("\n") not in text:
        m = re.search(r"(?m)^model_max_output_tokens\s*=.*$", text)
        if m:
            insert_at = m.end()
            text = text[:insert_at] + "\n" + model_instr_line + text[insert_at:]
        else:
            text = model_instr_line + text

    if FALLBACK_DOCS_LINE.rstrip("\n") not in text:
        m = re.search(r"(?m)^model_instructions_file\s*=.*$", text)
        if m:
            insert_at = m.end()
            text = text[:insert_at] + "\n" + FALLBACK_DOCS_LINE + text[insert_at:]
        else:
            text = _ensure_insert_before_features(text, FALLBACK_DOCS_LINE)

    return text


def _ensure_profiles(text: str) -> str:
    if re.search(r"(?m)^\[profiles\.fast\]\s*$", text) and re.search(r"(?m)^\[profiles\.deep\]\s*$", text):
        return text

    if not text.endswith("\n"):
        text += "\n"
    if not text.endswith("\n\n"):
        text += "\n"

    return text + PROFILES_BLOCK


def patch(path: Path) -> str:
    text = path.read_text()

    text = _remove_deprecated_features_key(text)

    if not _has_top_level_key(text, "web_search"):
        text = _ensure_insert_before_features(text, WEB_SEARCH_LINE)

    text = _ensure_model_header_keys(text)
    text = _ensure_profiles(text)

    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(f"usage: {argv[0]} /path/to/config.toml", file=sys.stderr)
        return 2

    path = Path(argv[1]).expanduser()
    if not path.exists():
        print(f"error: {path} does not exist", file=sys.stderr)
        return 1

    patched = patch(path)
    path.write_text(patched)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
