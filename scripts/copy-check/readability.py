#!/usr/bin/env python3
"""Flesch-Douma per extracted page. Warn under 55. Never fails the run."""

from __future__ import annotations

import sys
from pathlib import Path

try:
    import textstat
except ImportError:
    print("textstat is missing. pip install -r scripts/copy-check/requirements.txt", file=sys.stderr)
    sys.exit(1)

textstat.set_lang("nl")
root = Path(__file__).resolve().parents[2] / ".copy-text"
files = sorted(root.glob("*.txt"))
if not files:
    print("No text in .copy-text/. Run the extract step first.", file=sys.stderr)
    sys.exit(1)

warned = False
print("page\tflesch_douma\tstatus")
for path in files:
    score = float(textstat.flesch_reading_ease(path.read_text(encoding="utf-8")))
    status = "warn" if score < 55 else "ok"
    if status == "warn":
        warned = True
    print(f"{path.stem}\t{score:.1f}\t{status}")

if warned:
    print("Readability warning: at least one page is under 55 (Flesch-Douma).")
