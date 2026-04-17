# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Anki-Canvas is a touch-enabled drawing widget injected into Anki/AnkiDroid cards. It lets the user draw a shape on the **front** of a card (e.g. a kanji) and shows that drawing back on the **reverse** at a smaller size so it can be compared against the reference stroke diagram.

## Commands

- `bun run start` — Bun's fullstack dev server on `index.html`. Query string picks the view: `/?view=all` (default), `/?view=front`, `/?view=back`.
- `bun run build` — fast dev build via `bun build` (Zig, esbuild-family). Emits self-contained `dist/front.js` + `dist/back.js`. Use this for iteration.
- `bun run build:release` — production build via Vite 8 (Rolldown). Slower but tree-shakes more aggressively — outputs are ~13% smaller, which matters for JS inlined into Anki card templates.
- `bun run test` — `bun test`, happy-dom preloaded via `bunfig.toml`.
  - Single file: `bun test test/brushcolor.test.ts`.
  - Single test by name: `bun test -t "spectrum 漢"`.
- `bun run dist` — `bun build` + `scripts/dist.ts` copies `dist/front.js` and `dist/back.js` into the desktop Anki media folder (`~/Library/Application Support/Anki2/User 1/collection.media/_front.js`, `_back.js`) for in-Anki testing.
- `bun run release` — clean, `build:release` (Vite), then `scripts/release.py` (via `uv run`, PEP 723 inline deps) uses `genanki` to package a `.apkg` sample deck that embeds the built JS inline into the card templates.
- `bun run ghrelease` — `scripts/ghrelease.py` auto-increments the latest `v0.X` GitHub release, builds a release deck, asks Claude CLI to summarize commits since the last tag, and publishes via `gh release create`.
- `bun run lint` / `bun run format` — Biome 2.

### Build tool split: why two bundlers

`build` uses Bun's native bundler (esbuild-lineage) for fast feedback during development — a full front+back build is ~8ms.

`build:release` uses Vite's Rolldown bundler (Rollup-lineage, Rust) because it tree-shakes dead code more aggressively, producing meaningfully smaller bundles (~18 KB combined vs ~21 KB). Since `front.js` and `back.js` get embedded verbatim into every card template of a generated `.apkg` deck, bundle size compounds across every card — the extra build latency is worth paying at release time.

Do not swap `build:release` back to `bun build` for convenience. The size delta is the entire reason the split exists.

## Architecture

The two entry points `src/front.ts` and `src/back.ts` are **separate bundles** — they are loaded into different card templates (question side / answer side) and communicate only through persisted state, not imports. Every shared module (app, render, storage, brushcolor, options) gets inlined into **both** output files; neither bundler emits shared chunks for this setup (Vite runs per-entry in lib mode via the `ENTRY` env var; Bun's multi-entry mode duplicates shared modules by default).

- **`src/front.ts`** — mounts a canvas + undo/clear buttons into `#ac-front`, wires touch + mouse handlers to the state actions in `app.ts`, and runs a `requestAnimationFrame` render loop. On every pointer event it persists state.
- **`src/back.ts`** — loads the persisted state, scales every point by `backCanvasSize / frontCanvasSize` via `app.map`, and draws the result once into `#ac-back`. No interaction.
- **`src/app.ts`** — the state module. `State` is a newtype-wrapped `{ lines, drawing, dirty, down }` record. All mutations (`addFirstDrawingPoint`, `addDrawingPoint`, `addLastDrawingPoing`, `undo`, `clear`) mutate in place and call `save()`. `willdisplay(state, cb)` is the dirty-flag gate used by the render loop to skip redraws when nothing changed.
- **`src/storage.ts`** — storage abstraction. Desktop Anki's Qt web view (`QtWebEngine` UA) gets an in-memory object because `localStorage` is unavailable; everything else uses `localStorage`/`sessionStorage`. This is how front→back state transfer works on both platforms.
- **`src/render.ts`** — pure canvas drawing: `rendergrid` draws the 4-line dashed guide grid; `rendercanvas` clears, redraws grid, then iterates lines calling a `colorizer(index, count)` per stroke.
- **`src/brushcolor.ts`** — three colorizers (`none`, `spectrum`, `contrast`) compatible with the Kanji Colorizer Anki plugin's color output. The test fixtures in `test/brushcolor.test.ts` are pinned to that plugin's reference colors — do not change the HSV→RGB math without updating both.
- **`src/options.ts`** — merges `window.AnkiCanvasOptions` (set inline in the Anki card template by the user) over the defaults. `colorScheme: 'auto'` detects Anki Night Mode by looking for a `night_mode` CSS class on the document; `userOption` only accepts user values whose runtime `typeof` matches the default's, which silently discards malformed config.
- **`src/newtype.ts`** — minimal `Newtype<URI, A>` + `_iso` identity wrapper/unwrapper, used only to give `State` a nominal type.

## Dev preview (`index.html`)

One template, query-string routed. `?view=front|back|all` sets `document.body.dataset.view`, CSS hides the inactive panel, and both entries are loaded via static `<script type="module" src="./src/front.ts"></script>` + `<script type="module" src="./src/back.ts"></script>` tags so Bun's dev server picks them up at bundle time. Served by `bun index.html` — Bun bundles inline + referenced scripts into one client chunk per page.

Do not switch to dynamic `import('/src/front.ts')` — Bun's dev server falls back unknown paths to the HTML shell, so runtime fetches of source files return HTML and the dynamic import throws `TypeError: Failed to fetch dynamically imported module`. Only `<script src>` references in HTML get picked up as bundle entries. Both entries loading on every view is fine: CSS hides the inactive panel, and the side-effect mounts (pointer handlers on front, one-shot render on back) are harmless in the hidden state.
