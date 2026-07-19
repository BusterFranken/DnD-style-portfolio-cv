# Sheet Zoom (fixed 1.1×, margins kept) — Design Spec

**Date:** 2026-07-19
**Status:** Approved (user superseded zoom-to-fit with fixed 10% zoom + kept margins, per screenshot)
**Follows:** 2026-07-18-parchment-ink-redesign-design.md (post-merge amendment)

## Goal

Render the whole D&D view at a fixed 1.1× zoom — same proportions, ~10% bigger text
and sheet — while KEEPING the dark desk margins around the centered sheet exactly as
designed. (User is charmed by the browser-zoom-110% look and wants it as the default.)

## Behavior

- Zoom factor `z = clamp(1, viewportWidth / 1248, 1.1)`, recomputed on resize.
  - ≥ ~1373px viewport (e.g. user's Mac): flat **1.1×** — sheet + desk margins, no
    horizontal scroll, matches the screenshot.
  - ~1248–1373px: eases down toward 1 so the zoom never *introduces* horizontal
    scroll that today's layout doesn't have (sheet+padding always fit).
  - < 1248px: z = 1 → exactly today's rendering (incl. the 741–1219px h-scroll band).
  - 1248 = 1220px sheet + 2×14px desk side padding (which STAYS — no padding changes).
- Desk padding/margins: unchanged at all widths. Body stays centered-on-desk.
- Scope: D&D view only (`html[data-view="dnd"] body`). Classic CV view untouched;
  ≤740px mobile layer untouched (z clamps to 1 below 1248 anyway; media queries
  evaluate against the real viewport).
- Fixed-position surfaces of the D&D presentation (dice modal, overlay modal, admin
  modal, mobile quick bar — the latter moot since mobile z=1) scale consistently
  (zoom on body covers fixed descendants).

## Implementation

- `css/main.css`: `html[data-view="dnd"] body { zoom: var(--sheet-zoom, 1); }` —
  nothing else changes (no padding edits).
- `js/main.js`: `updateSheetZoom()` sets `--sheet-zoom` on `document.documentElement`
  from `Math.min(1.1, Math.max(1, document.documentElement.clientWidth / 1248))`
  (clientWidth excludes the scrollbar → the ease-down clamp is exact); called from
  `init()` and on `resize` via the existing `debounce()` helper. Without JS the CSS
  var defaults to 1 → current look (graceful fallback).
- If a browser quirk surfaces with body-zoom + fixed elements during verification,
  fall back to applying the same var to the modal contents explicitly.
- Port: identical changes to the generator branch's `public/css/main.css` +
  `public/js/main.js`.

## Out of scope

Classic CV sizing; mobile; padding/margin changes; reflow/stretch; rem refactor.

## Verification

- Screenshots at 1440 & 1920 (1.1× + margins, no h-scrollbar), 1300 (eased factor,
  no h-scrollbar), 1000 (unchanged h-scroll band), 390 (mobile unchanged) — compare
  against pre-change captures.
- Functional at 1440: dice roll + overlay open (scaled, centered, clickable); Classic
  CV toggle renders unzoomed; hamburger/accordions at ≤740 intact.
- Generator branch: owner page + one generated sheet (?slug=) spot-check at 1440.

## Risks

- `zoom` + fixed elements quirks → explicit fallback noted above.
- 1px rounding seams at some widths — verify none at 1440/1920.
