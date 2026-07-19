# Sheet Zoom (fixed 1.1×, margins kept) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the D&D view at a fixed 1.1× zoom (desk margins kept) on the main site and the generator branch.

**Architecture:** A CSS variable–driven `zoom` on `body` in D&D view; a tiny JS updater computes `clamp(1, clientWidth/1248, 1.1)` on init/resize. No layout/padding changes. Port = same two files under `public/` on the `DnD-cv-maker` branch.

**Tech Stack:** Vanilla CSS (`zoom` property) + vanilla JS. Verification via headless Chrome screenshots against the running server.

**Spec:** `docs/superpowers/specs/2026-07-19-sheet-zoom-to-fit-design.md`

## Global Constraints

- Zoom formula exactly: `Math.min(1.1, Math.max(1, document.documentElement.clientWidth / 1248))`.
- Scope selector exactly: `html[data-view="dnd"] body { zoom: var(--sheet-zoom, 1); }` — Classic CV view and ≤740px mobile must render byte-identically to today (z clamps to 1 below 1248px).
- No padding/margin/layout value changes anywhere.
- Main site work happens on branch `main` in `/Users/busterfranken/Personal-page` (already merged redesign); port work on branch `DnD-cv-maker` in the same checkout (switch back to `main` afterwards).
- Never start/stop the user's own preview server if one is running; use your own port for `npm run dev` checks (generator).
- Commits end with trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

### Task 1: Main site — zoom variable, updater, verification

**Files:**
- Modify: `css/main.css` (after the `html[data-view="classic"] body.has-classic` rule, ~line 97)
- Modify: `js/main.js` (new function near `debounce()` ~line 709; call in `init()` after `setupMobileAccordions();`)

**Interfaces:**
- Produces: CSS var `--sheet-zoom` on `document.documentElement`; function `updateSheetZoom()` (no args, no return). Task 2 copies both verbatim.

- [ ] **Step 1: CSS — add the zoom hook** (`css/main.css`, insert directly after the `html[data-view="classic"] body.has-classic { ... }` rule)

```css
/* Fixed 1.1× "charmed" zoom (spec 2026-07-19): JS sets --sheet-zoom to
   clamp(1, clientWidth/1248, 1.1); default 1 keeps today's look without JS.
   Scoped to D&D view so Classic CV stays unzoomed. */
html[data-view="dnd"] body { zoom: var(--sheet-zoom, 1); }
```

- [ ] **Step 2: JS — updater + wiring** (`js/main.js`)

Add above `function debounce(...)`:

```javascript
// Fixed 1.1× sheet zoom with desk margins kept (spec 2026-07-19).
// clientWidth excludes the scrollbar, so the ease-down clamp between
// 1248-1373px never introduces horizontal scroll; ≤1248px → 1 (unchanged).
function updateSheetZoom() {
  const z = Math.min(1.1, Math.max(1, document.documentElement.clientWidth / 1248));
  document.documentElement.style.setProperty('--sheet-zoom', z);
}
```

In `init()`, after `setupMobileAccordions();` add:

```javascript
  updateSheetZoom();
  window.addEventListener('resize', debounce(updateSheetZoom, 150));
```

- [ ] **Step 3: Syntax check**

Run: `node --check js/main.js`
Expected: no output (pass).

- [ ] **Step 4: Visual verification** (serve if needed: check `curl -s -o /dev/null -w '%{http_code}' http://localhost:8098/index.html`; if not 200, start `python3 -m http.server 8098 -d /Users/busterfranken/Personal-page` yourself)

Headless Chrome (`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --screenshot=<path> --window-size=W,H URL`), screenshots to the session scratchpad:
- 1440×1200 `index.html`: sheet visibly larger than before (≈1373px incl. margins), desk margins present both sides, no horizontal scrollbar (verify via `--dump-dom` + JS: `document.documentElement.scrollWidth <= document.documentElement.clientWidth` through a CDP evaluate, or visually no cut content).
- 1920×1200: flat 1.1×, wider desk margins.
- 1300×1000: eased factor (sheet+margins exactly fit, no h-scroll).
- 1000×900: byte-similar to pre-change (h-scroll band unchanged, z=1).
- 390×1200 (or 500 floor): mobile identical to pre-change.
- Classic check: CDP-click the Classic CV toggle at 1440 → classic view renders unzoomed (light bg, normal size).
- Dice + overlay at 1440: open one of each — scaled with the page, centered, clickable.

- [ ] **Step 5: Commit**

```bash
git add css/main.css js/main.js
git commit -m "feat: fixed 1.1x sheet zoom with desk margins kept (D&D view only)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Generator branch port

**Files:**
- Modify (branch `DnD-cv-maker`): `public/css/main.css`, `public/js/main.js`

**Interfaces:**
- Consumes: Task 1's exact CSS rule + `updateSheetZoom()` code (copy verbatim; public/js/main.js has the same `debounce()` helper and `init()` shape — insert at the same anchors: CSS after the `html[data-view="classic"] body.has-classic` rule; JS above `debounce()` and the two wiring lines in `init()` after `setupMobileAccordions();`).

- [ ] **Step 1: Switch branch** — `git checkout DnD-cv-maker` (tree is clean; if not, stop and report).

- [ ] **Step 2: Apply the same two edits** to `public/css/main.css` and `public/js/main.js` (identical code blocks as Task 1 Steps 1–2, same insertion anchors; the branch's init() also calls `setupMobileAccordions()` — verify with grep first, and if the anchor differs, insert after the last `setup*()` call in `init()` and note it).

- [ ] **Step 3: Checks**

Run: `node --check public/js/main.js` → pass.
Run: `PORT=3001 npm run dev` (background), then:
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/index.html` → 200
- Headless screenshot 1440×1200 of `http://localhost:3001/index.html` → zoomed owner sheet with margins.
- Headless screenshot of a generated sheet `http://localhost:3001/index.html?slug=F4tx5FL9ka` → zoomed, styled, no console errors (`--dump-dom` shows content).
Kill the dev server you started.

- [ ] **Step 4: Commit + return to main**

```bash
git add public/css/main.css public/js/main.js
git commit -m "port: fixed 1.1x sheet zoom (D&D view) to generator public/

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git checkout main
```

---

## Self-Review (completed)

1. **Spec coverage:** formula/scope/fallback → T1 S1-S2; no-padding-change → constraint (no task touches padding); modals covered by body-zoom (T1 S4 verifies; fallback path documented in spec if quirk appears); breakpoints/Classic untouched → T1 S4 checks; port → T2; screenshots matrix → T1 S4 / T2 S3. No gaps.
2. **Placeholders:** none — all code shown verbatim, commands exact.
3. **Consistency:** `--sheet-zoom` and `updateSheetZoom()` names identical across tasks; 1248 constant consistent with spec.
