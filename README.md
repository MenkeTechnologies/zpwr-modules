```
███╗   ███╗ ██████╗ ██████╗ ██╗   ██╗██╗     ███████╗███████╗
████╗ ████║██╔═══██╗██╔══██╗██║   ██║██║     ██╔════╝██╔════╝
██╔████╔██║██║   ██║██║  ██║██║   ██║██║     █████╗  ███████╗
██║╚██╔╝██║██║   ██║██║  ██║██║   ██║██║     ██╔══╝  ╚════██║
██║ ╚═╝ ██║╚██████╔╝██████╔╝╚██████╔╝███████╗███████╗███████║
╚═╝     ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚══════╝
```

![Registry](https://img.shields.io/badge/registry-static%20%2F%20git--backed-05d9e8?style=flat-square)
![Format](https://img.shields.io/badge/format-.zmod-ff2a6d?style=flat-square)
![Role](https://img.shields.io/badge/shared-user%20module%20library-39ff14?style=flat-square)
![MenkeTechnologies](https://img.shields.io/badge/MenkeTechnologies-audio%20stack-d300c5?style=flat-square)

### `[THE SHARED MODULE REGISTRY]`

> *"Patch once. Reuse everywhere."*

The shared **user-module registry** for the MenkeTechnologies plugin stack — a browsable library of reusable patch modules, modeled on [library.vcvrack.com](https://library.vcvrack.com/). Created by MenkeTechnologies.

### [`zpwr-fx`](https://github.com/MenkeTechnologies/zpwr-fx) · [`zpwr-synth`](https://github.com/MenkeTechnologies/zpwr-synth) · [`zpwr-midi-fx`](https://github.com/MenkeTechnologies/zpwr-midi-fx) · [`zpwr-patch-core`](https://github.com/MenkeTechnologies/zpwr-patch-core)

### → **[Browse the registry](https://menketechnologies.github.io/zpwr-modules/)**

---

## Table of Contents

- [\[0x00\] Overview](#0x00-overview)
- [\[0x01\] A Module](#0x01-a-module)
- [\[0x02\] In the Plugin](#0x02-in-the-plugin)
- [\[0x03\] Publishing](#0x03-publishing)
- [\[0x04\] registry.json](#0x04-registryjson)
- [\[0x05\] Hosting](#0x05-hosting)
- [\[0xFF\] License](#0xff-license)

---

## [0x00] OVERVIEW

A **static, git-backed registry** — no server. `registry.json` is the index the plugins fetch (`EditorConfig::registryUrl`), and `modules/` holds the published module files. Both are served as plain files over GitHub Pages, with a cyberpunk web browser at the [Pages site](https://menketechnologies.github.io/zpwr-modules/).

---

## [0x01] A MODULE

A module is a selection of patch blocks (with their internal cables, mod routes and tempo-sync overrides) saved as a self-contained sub-graph — see [`zpwr-patch-core` §0x05](https://github.com/MenkeTechnologies/zpwr-patch-core#0x05-user-modules--registry). Files are exactly what the plugin's **◈ MODULES → Save selection** writes: `.zfxmod` / `.zsynmod` / `.zmfxmod`. Loading one **splices it into the current patch** — its blocks expand into editable blocks, ids remapped.

---

## [0x02] IN THE PLUGIN

1. **Cmd/Ctrl-click** or **Shift-click** blocks to select them.
2. **◈ MODULES** -> name + **Save selection** -> the module is stored locally with full CRUD.
3. **REGISTRY** tab -> **Refresh** -> browse/filter -> **import** pulls a module into your store.
4. Click a module to **drop it into the current patch** (it expands into editable blocks).

---

## [0x03] PUBLISHING

A manifest PR, mirroring VCV's submission flow:

1. Add your `modules/<name>.<ext>` file (export it from the plugin).
2. `python3 scripts/gen_registry.py` - rebuilds `registry.json` from the `modules/` tree.
3. Open a PR. Once merged and Pages redeploys, every plugin sees it on the next **Refresh**.

---

## [0x04] registry.json

```jsonc
{ "registry": 1, "name": "zpwr-modules", "updated": "2026-06-20",
  "modules": [
    { "slug": "barrys-delay", "name": "Barry's Delay", "author": "MenkeTechnologies",
      "category": "Delay", "tags": ["delay", "mod"], "license": "CC0", "host": "zpwr-fx",
      "desc": "Dynamic ducking delay.", "url": "https://.../modules/barrys-delay.zfxmod" } ] }
```

---

## [0x05] HOSTING

GitHub Pages on `main` (root). The registry is served at
`https://menketechnologies.github.io/zpwr-modules/registry.json` — the default
`registryUrl` baked into each plugin — and the styled browser at the site root
(`index.html`).

| Path | Role |
| --- | --- |
| `index.html` | cyberpunk registry browser (GitHub Pages landing page) |
| `registry.json` | the flat index the plugins + the browser fetch |
| `modules/` | published module files (`.zfxmod` / `.zsynmod` / `.zmfxmod`) |
| `scripts/gen_registry.py` | rebuilds `registry.json` from `modules/` |

---

## [0xFF] LICENSE

Module files carry their own `license` field. The registry tooling is MIT, (c) MenkeTechnologies.
