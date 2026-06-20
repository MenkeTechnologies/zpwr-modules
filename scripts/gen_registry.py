#!/usr/bin/env python3
"""Build registry.json by scanning modules/ for published user modules.

Each module is a .z*mod file (zpwr-fx/.zfxmod, zpwr-synth/.zsynmod, zpwr-midi-fx/.zmfxmod)
exactly as exported by the plugin (the WebEditor's "Save selection" / on-disk module store).
This script reads each file's envelope metadata and emits the flat registry.json index that
the plugins fetch (EditorConfig::registryUrl). Re-run after adding/removing modules:

    python3 scripts/gen_registry.py        # rewrites registry.json

The published site is static (GitHub Pages): registry.json + the modules/ tree are served as
plain files, so there is no server to run. `url` is the raw download URL of each module file.
"""
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODULES = ROOT / "modules"
# Raw download base for the published site. Override if the repo/host differs.
BASE_URL = "https://menketechnologies.github.io/zpwr-modules/modules/"
MODULE_EXTS = (".zfxmod", ".zsynmod", ".zmfxmod", ".zmod")


def slugify(name):
    return "".join(c.lower() if c.isalnum() else "-" for c in name).strip("-").replace("--", "-")


def main():
    entries = []
    for f in sorted(MODULES.glob("*")) if MODULES.exists() else []:
        if f.suffix not in MODULE_EXTS:
            continue
        try:
            doc = json.loads(f.read_text(encoding="utf-8"))
        except (ValueError, OSError) as e:
            print(f"skip {f.name}: {e}")
            continue
        name = doc.get("name", f.stem)
        entries.append({
            "slug":     slugify(name),
            "name":     name,
            "author":   doc.get("author", ""),
            "category": doc.get("category", "User"),
            "tags":     doc.get("tags", []),
            "license":  doc.get("license", ""),
            "host":     doc.get("host", ""),
            "desc":     doc.get("desc", ""),
            "url":      BASE_URL + f.name,
        })
    registry = {
        "registry": 1,
        "name": "zpwr-modules",
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "modules": entries,
    }
    (ROOT / "registry.json").write_text(json.dumps(registry, indent=2) + "\n", encoding="utf-8")
    print(f"wrote registry.json - {len(entries)} module(s)")


if __name__ == "__main__":
    main()
