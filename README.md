# zpwr-modules

The shared **user-module registry** for the MenkeTechnologies plugin stack
([`zpwr-fx`](https://github.com/MenkeTechnologies/zpwr-fx) ·
[`zpwr-synth`](https://github.com/MenkeTechnologies/zpwr-synth) ·
[`zpwr-midi-fx`](https://github.com/MenkeTechnologies/zpwr-midi-fx)) — a browsable library of
reusable patch modules, modeled on [library.vcvrack.com](https://library.vcvrack.com/).

It is a **static, git-backed registry** (no server): `registry.json` is the index the plugins
fetch (`EditorConfig::registryUrl`), and `modules/` holds the published module files. Both are
served as plain files over GitHub Pages.

## What a module is

A module is a selection of patch blocks (with their internal cables, mod routes and tempo-sync
overrides) saved as a self-contained sub-graph — see
[`zpwr-patch-core` §0x05](https://github.com/MenkeTechnologies/zpwr-patch-core#0x05-user-modules--registry).
Files are exactly what the plugin's **◈ MODULES → Save selection** writes:
`.zfxmod` / `.zsynmod` / `.zmfxmod`.

## In the plugin

1. **Cmd/Ctrl-click** or **Shift-click** blocks to select them.
2. **◈ MODULES** → name + **Save selection** → the module is stored locally with full CRUD.
3. **REGISTRY** tab → **Refresh** → browse/filter → **⤓ Import** pulls a module into your store.
4. Click a module to **drop it into the current patch** (it expands into editable blocks).

## Publishing (manifest PR, VCV-style)

1. Add your `modules/<name>.<ext>` file (export it from the plugin).
2. `python3 scripts/gen_registry.py` — rebuilds `registry.json` from the `modules/` tree.
3. Open a PR. Once merged and Pages redeploys, every plugin sees it on the next **Refresh**.

## registry.json schema

```jsonc
{ "registry": 1, "name": "zpwr-modules", "updated": "2026-06-20",
  "modules": [
    { "slug": "barrys-delay", "name": "Barry's Delay", "author": "MenkeTechnologies",
      "category": "Delay", "tags": ["delay", "mod"], "license": "CC0", "host": "zpwr-fx",
      "desc": "Dynamic ducking delay.", "url": "https://.../modules/barrys-delay.zfxmod" } ] }
```

## Hosting

Enable GitHub Pages on `main` (root). The registry is then served at
`https://menketechnologies.github.io/zpwr-modules/registry.json`, which is the default
`registryUrl` baked into each plugin.
