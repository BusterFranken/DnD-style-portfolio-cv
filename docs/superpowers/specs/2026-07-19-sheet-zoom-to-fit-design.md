# Sheet Zoom-to-Fit — Design Spec

**Date:** 2026-07-19
**Status:** Approved (user: option 1 + ultrawide cap)
**Follows:** 2026-07-18-parchment-ink-redesign-design.md (post-merge amendment)

## Goal

The parchment sheet currently renders as a centered 1220px document with dark desk
margins. Scale the whole D&D view up uniformly ("zoom in") so it fills the viewport
width edge-to-edge on desktop — same proportions, bigger text — capped on ultrawide
monitors. No reflow, no content stretch.

## Behavior

- Zoom factor `z = clamp(1, viewportWidth / 1220, 1.6)`, recomputed on resize.
  - < 1220px viewport: z = 1 → exactly today's rendering (incl. 741–1219px h-scroll band).
  - 1220–1952px: sheet fills width edge-to-edge (gold double border hugs the edges).
  - > 1952px (ultrawide): capped at 1.6× — desk margins reappear beyond the cap.
- Desktop body desk padding (26px 14px 44px) removed in D&D view so the sheet truly
  touches the edges; desk color remains behind (visible only on over-scroll/ultrawide).
- Scope: D&D view only (`html[data-view="dnd"]`). Classic CV view, admin modal in
  classic context, and the ≤740px mobile layer are untouched (mobile is already
  edge-to-edge; the media query evaluates against the real viewport, and z clamps
  to 1 there anyway).
- Fixed-position surfaces that belong to the D&D presentation (dice modal, overlay
  modal) scale consistently with the page.

## Implementation

- `css/main.css`: `html[data-view="dnd"] body { zoom: var(--sheet-zoom, 1); }` and
  the desktop padding removal (guarded so ≤740px rules are unaffected). Fallback:
  without JS, `--sheet-zoom` defaults to 1 → current centered look (graceful).
- `js/main.js`: `updateSheetZoom()` — sets `--sheet-zoom` on `document.documentElement`
  from `Math.min(1.6, Math.max(1, document.documentElement.clientWidth / 1220))`
  (clientWidth excludes the scrollbar, giving an exact fit); called on init and on
  `resize` (existing debounce helper); no-ops gracefully when the property is
  unsupported (value simply ignored).
- Zoom placement must cover the fixed modals (`zoom` on body covers them; if testing
  shows a browser quirk, fall back to applying the same variable to
  `.dice-modal/.overlay-modal/.admin-modal` contents explicitly).
- Port: identical changes to the generator branch's `public/css/main.css` +
  `public/js/main.js` (kept in sync with root, same as the redesign sync).

## Out of scope

- Classic CV view sizing; mobile layer; any reflow/stretch of the 1220px design;
  rem refactor.

## Verification

- Screenshots at 1440 / 1920 / 2560 (cap visible) / 1000 (unchanged h-scroll) /
  390 (mobile unchanged) against current captures.
- Functional: dice roll + overlay open at 1440 (modals scale, centered, clickable);
  Classic CV toggle renders unzoomed; accordion/matchMedia behavior at ≤740 intact;
  no horizontal scrollbar at 1440/1920.
- Generator branch: owner page + one generated sheet (?slug=) spot-check at 1440.

## Risks

- `zoom` + fixed elements browser quirks → explicit fallback placement noted above.
- Rounding seams at some widths (1px) — acceptable; verify none at 1440/1920.
