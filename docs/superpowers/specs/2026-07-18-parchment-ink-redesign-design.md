# Parchment & Ink Redesign — Design Spec

**Date:** 2026-07-18
**Status:** Approved pending user review
**Repo:** BusterFranken/DnD-style-portfolio-cv (busterfranken.com)

## Overview

Full visual redesign of the D&D character-sheet CV site to the "classic parchment & ink"
treatment, plus the same treatment for the Create Yours generator app that lives on the
`DnD-cv-maker` branch. **Purely aesthetic: all functionality, data models, and behavior
stay identical.**

## Source of Truth

Two handoff bundles in the repo root define the design. **They win over this spec on any
visual question**; this spec records decisions and architecture, not pixel values.

1. `design_handoff_dnd_cv_redesign/` — desktop redesign
   - `README.md`: tokens, per-screen specs, dice/overlay choreography, copy changes,
     suggested implementation order
   - Six interactive prototypes: `Character Sheet.dc.html`, `Campaigns.dc.html`,
     `Notable.dc.html`, `Projects.dc.html`, `Contact.dc.html`, `Media.dc.html`
2. `design_handoff_dnd_cv_mobile/` — mobile addendum (breakpoint ≤740px)
   - `README.md`: seven-frame mobile spec, behavior rules
   - `Mobile Views.dc.html`: seven 390px frames on one canvas

**Standing rule (user requirement): every implementation phase ends with a side-by-side
browser comparison against the corresponding prototype** — desktop pages at desktop width
against the six `.dc.html` files, mobile at 390px against the seven frames. Reconcile
differences before moving to the next phase. Copy is carried verbatim from the prototypes
(they are the reviewed source of truth for text on the six main pages).

Prototype code itself (`support.js`, `image-slot.js`, inline-styled DOM) is reference
only — never ported.

## Decisions Log (brainstorming outcomes)

| # | Decision |
|---|----------|
| 1 | **Scope: both branches.** Main site first, then the `DnD-cv-maker` branch (creator app). User redeploys Amplify afterwards; the currently-dead Amplify URL (`dnd-cv-maker.dpaft0pdvmuap.amplifyapp.com` — DNS does not resolve) is investigated by the user separately. |
| 2 | **Mobile: follow `design_handoff_dnd_cv_mobile/` exactly** — a deliberate mobile rethink at ≤740px (accordions, bottom sheets, swipe strips, sticky quick bar), not the desktop sheet squeezed down and not the old responsive reflow. |
| 3 | **Method: in-place restyle.** Keep existing HTML/JS skeletons; rewrite CSS to new tokens; adjust markup only where the design demands; keep every id/class contract `js/render.js` and `js/main.js` target. Prototypes are never copied as code. |
| 4 | `gallery.html`/`gallery.js` on the branch are dead code (public gallery was removed for privacy; nothing links to them) — **skipped, not restyled**. |
| 5 | Margin notes: desktop-only via media query, HP note also visible on mobile. **No settings flag** (YAGNI; the handoff only said "consider"). |
| 6 | Dice roller "subtle mode" (optional per README): **not implemented** (YAGNI). `prefers-reduced-motion` is respected if the current code already does so; no new mode added. |
| 7 | Creator page (`creator.html`): **design extrapolated** from the token system (no prototype exists). Existing creator copy kept as-is — the copy-freeze covers only the six prototyped pages. |
| 8 | Delivery: isolated worktree, feature branch off `main`, phased commits, user previews locally, PR to `main` (GitHub Pages deploys on merge). Then the branch port, push, user redeploys Amplify. |

## Architecture Context

- **`main` branch** → static site (root `*.html`, `css/`, `js/`) → GitHub Pages at
  www.busterfranken.com. Content rendered by `js/render.js` from `js/data.js`;
  interactions in `js/main.js`, `js/dice.js`, `js/overlay.js`, `js/admin.js`.
- **`DnD-cv-maker` branch** (27 commits ahead of merge-base `387005f`; `main` is 2 ahead
  with the Create Yours nav links) → Next.js app: entire static site copied into
  `public/`, plus `creator.html`/`css/creator.css`/`js/creator.js`, `js/load-app-data.js`,
  and `app/api/*` routes (CV upload → OpenAI chunked generation → sql.js local /
  DynamoDB prod). Generated sheets render at slug URLs through the same
  `render.js`/CSS, so they inherit the redesign automatically.
- Branch divergence measured: `public/css/*` ≈ identical to root (only
  `character-sheet.css` +13 lines); `dice.js`/`descriptions.js`/`admin.js` identical;
  `main.js`/`render.js`/`overlay.js` heavily extended on the branch (+250–500 lines of
  dynamic rendering & slug propagation); `campaigns/notable/contact/media.html` on the
  branch are data-driven skeletons (hundreds of lines removed vs. root).

## Scope

**In:**
- Restyle of the six main pages (desktop + mobile), dice roller, overlays, admin modal
  (visual tokens only), nav band, new footer contact band
- Copy changes listed in the desktop README §"Copy changes" (live in `js/data.js` and
  page HTML)
- Font swap: Inter dropped; Cinzel (400–800) + Alegreya + Alegreya Sans SC + Caveat
- Port of all of the above to the `DnD-cv-maker` branch, including extrapolated restyle
  of `creator.html`/`creator.css`
- Update of the Create Yours URL on `main` if the user provides a new Amplify URL before
  the PR merges (otherwise unchanged)

**Out:**
- Classic CV view layout/styling (`css/classic-cv.css` untouched). Known intended
  consequence: it uses the shared font variables, so its body font follows the swap
  (Inter → Alegreya) while its layout stays as-is.
- `fruitpunch/` archive, `gallery.html`/`gallery.js`, `network.css` consumers beyond
  restyling if reached by shared tokens
- Any behavior, data-model, or API change; Amplify redeploy/DNS (user-owned)

## Design

### 1. Token layer (`css/main.css`)

All colors, textures, and type from the desktop README §Design Tokens become CSS custom
properties. Shared patterns implemented once: nav band (red gradient, gold d20 clip-path
hexagon mark, SC links, active = bright gold + 2px `#c9a85c` underline), footer contact
band (red gradient, gold SC links; replaces current footers on every page), panel
(parchment + `#c7af7e` border + inner double ring via inset box-shadows), section title
(SC label between 1px gold rules), dotted `#d9c491` list rows, chip styles, ornament
glyphs replacing ALL emoji (`✦ ❖ ◆ ◇ ☾ ✉ ✕ ▾ ▸`), 45°-rotated 7px proficiency pips,
hover lift (`translateY(-2px)` + shadow), rollable-value highlight. Sheet frame: 1220px
centered on `#241a12` desk, `3px double #9a7b36`, SVG-feTurbulence grain + radial light/
age gradients + inset vignette (no image assets).

### 2. index.html — the one structural change

One DOM serves both layouts:

- Every logical section — Saving Throws, Passives+Proficiencies, Skills, and the
  tab-panel sections (Actions / Spells / Inventory / Features & Traits / Background /
  Notes / Extras) — is a panel with a header, containing the exact render targets
  (`#skillsList`, `#actionsList`, …) `render.js` already fills. Contracts untouched.
- **Desktop:** `grid-template-columns: 300px 330px 1fr`; right column shows the tab bar
  (existing JS toggling, restyled: active tab = red block); panel headers that the design
  replaces with tabs are hidden.
- **Mobile (≤740px):** grid linearizes into the frame-1a order — red top bar, header card
  (72px portrait + LEVEL 7 banner), full-width HP banner, 4-up vitals grid
  (AC shield / Initiative hexagon clip-paths, Speed, Proficiency), swipeable abilities
  strip (scroll-snap, 84px tiles, right-edge fade, "swipe · tap to roll" caption),
  conditions chip row, then every section as an accordion bar (SC title + italic one-line
  preview from `data.js` + ▸/▾ chevron; one open at a time; ~250ms slide; tab bar
  hidden). Actions sub-tabs become a chip row inside the open accordion. Sticky bottom
  quick bar (✦ Short Rest · ☾ Long Rest · ❖ Classic CV, ≥48px), index only.
- Header (desktop): portrait in circular red/gold frame with LEVEL 7 banner, name block
  with clickable class line / background / alignment, HP box (double frame, red numerals,
  "€45M crowdsourced"), 6 ability tiles + combat tiles, defenses & conditions chip rows.

### 3. Dice roller (`js/dice.js` + `css/dice.css`)

Same click targets (ability mods, saves, skills, attack to-hit, spell attack) and the
existing `getDiceMessage()` pools from `js/descriptions.js`, unchanged. New presentation:
backdrop `rgba(20,12,6,.74)`; 480px parchment card with double gold border; die = red
wax-seal hexagon (radial `#8a2a17 → #58180d → #3d0e07`, gold Cinzel numeral); tumble
~1.4s (face randomizes every 85ms; rotation += 80–240°/tick; `transition: transform .09s
linear`; settles on a multiple of 360°); card shake keyframe (.5s) on settle; breakdown
rows (1d20 / modifier / total) fade up; total stamps in as a wax-seal circle
(`scale 2.4 → .92 → 1` + slight rotation, .45s); nat 20 → gold "✦ ✦ ✦ CRITICAL ✦ ✦ ✦",
nat 1 → red "✕ FUMBLE ✕". Click outside closes. **Mobile:** presented as a bottom sheet
(parchment, `border-top: 3px double #9a7b36`, radius 22px 22px 0 0, 42×4px grabber,
slide-up; tap backdrop or swipe down to close).

### 4. Overlays (`js/overlay.js` + `css/overlay.css`)

Parchment modal 640px, double gold border, fade-up .25s; red gradient header band with
Cinzel title, SC subtitle from `cvMeaning` (e.g. "Score 18 · Influence"), framed modifier
badge. Body: 150×180 art plate — CHA uses `assets/images/buster.jpg` with
`filter: sepia(.55) contrast(1.05)` in a double gold frame; other abilities a gold-dashed
hatched placeholder captioned `commissioned art — "…"` — beside italic blurb with
`border-left: 3px solid #9a7b36` and a KEY EVIDENCE list (◆ bullets, dotted rules). Data
still flows from `data.js`/`descriptions.js`. Template change lives in `overlay.js`.
**Mobile:** same bottom-sheet treatment as dice.

### 5. Margin notes (index.html)

Absolutely-positioned Caveat spans, rotated ±2°: `← "chaotic" is generous —B`
(alignment), `still full HP!` (red, above HP box), `the money-maker` (CHA tile),
`reads rooms` (passive insight), `— ja, echt waar` (languages), `+10?! nat 20 energy ↑`
(skills). Blue `#3e5a8c`, emphatic red `#a33b2e`. Hidden ≤740px except the HP note.

### 6. Content pages (desktop per README §Screens, mobile per frames 1d–1g)

- **campaigns.html** — centered page header (kicker SC, Cinzel title, gold rule + ❖,
  italic subtitle); 4 collapsible panels with initial-letter tiles (F/A/Z/O), status
  chips, ▾/▸ chevrons; adventures on gold-rule left border; milestones: notable =
  `#efe1be` bg + `3px solid #c9a85c` left border + gold ✦, normal = red ◆; Side Quests
  3-col grid → mobile horizontal swipe rail (200px cards, edge fade).
- **notable.html** — 3-col achievement cards with clip-path pennant ribbons (Legendary
  gold gradient / Epic oxblood / Rare ink-blue `#3e5a8c`), stat footer rows; Key
  Encounters 2-col year-ledger (gold Cinzel year + red ◆) → mobile 1-per-row cards +
  single-column ledger (36px year gutter).
- **projects.html** — filter chips (active = red pill; mobile: 44px horizontal scroll
  strip); partners strip text-only separated by gold ✦ (no logos, by decision); 3-col
  quest cards (150px image area using existing live-site project photos, kicker, title,
  blurb, "View quest details →") → mobile 1-per-row; stats strip €45M / 4500+ / 50+ /
  80+ → mobile 2×2.
- **contact.html** — 4 contact-scroll cards (email = gold border); Home Base + Guilds
  beside 4 Letters of Recommendation quote cards; "Ready to Start a New Quest?" CTA with
  ✦ Start a Quest (solid red) + ❖ Download CV (outline) → mobile full-width rows,
  stacked cards, stacked full-width CTAs (≥48px).
- **media.html** — featured podcast card (gold border + Featured ribbon), 3-col podcast
  cards, 2 video cards, Press Chronicles 2-col year-ledger (source names in red), Key
  Numbers strip → mobile: card stack + single-column ledger (reuses notable's patterns).
- Page-header kickers (verbatim): "The Chronicles of a Founder", "Deeds Worthy of the
  Bards", "Posted at the Guild Hall", "Allies, Guilds & Ravens", "As Told Around the
  Fire".

### 7. Copy changes (from README §Copy changes — applied in `js/data.js` + page HTML)

Attack property tags (finesse · reach / ranged · unlimited / ranged · light); one-line
italic effect summaries on every action row; "The 200+ Pitches"; new "Adventure: Building
the Platform" (2019–2020) + "The Dropout Decision" milestone; Zindi "all 80+ partnerships
handed over intact"; The Watch "graveyard shifts included"; fundraise "two hundred doors
knocked, the right ones opened."; languages in D&D form (Common/Dwarvish/Giant). All
final text lifted verbatim from prototypes during implementation.

### 8. Shared chrome details

Nav band keeps: contextual status chip, Classic CV toggle, ✦ Short Rest / ☾ Long Rest
(index), Create Yours link, admin ⚙ (restyled to tokens), and the existing mobile
hamburger (`#navbarToggle`) — menu drops down as stacked gold SC links; status chips move
into the menu on mobile. Fonts loaded per page via Google Fonts (Cinzel, Alegreya,
Alegreya Sans SC, Caveat). Favicon stays.

## Creator Branch Port

Order: finish `main`, merge `main` → `DnD-cv-maker`, then sync inside the branch:

1. `public/css/*` ← root `css/*` (re-apply the branch's small `character-sheet.css`
   delta if still relevant after redesign).
2. `public/js/dice.js`, `descriptions.js`, `admin.js` ← root versions (identical today).
3. `public/js/main.js`, `render.js`, `overlay.js`: **surgically re-apply the redesign
   deltas** (overlay template, accordion/bottom-sheet/quick-bar additions, any dynamic
   markup pattern changes) onto the branch's extended versions, preserving slug
   propagation and dynamic page rendering.
4. Branch page HTML (`public/*.html`): re-apply structural patterns (nav band, footer,
   page headers, panels) onto the data-driven skeletons; keep dynamic containers, slug
   nav propagation, "example banner", and generated-page behaviors (hidden Classic CV
   toggle etc.).
5. `public/creator.html` + `public/css/creator.css`: extrapolated design — same nav band
   (MODE: Character Creator chip) + footer; centered page header with kicker; upload card
   as parchment panel with double ring; dropzone as gold-dashed hatched slot with ❖
   (replaces 📜); file chips as parchment chips; primary CTA solid red ✦ / secondary gold
   outline; progress + "your past sheets" as dotted-rule ledger rows with red ◆. Copy
   unchanged.

Generated sheets need no extra work beyond the shared files rendering correctly with
arbitrary data (verify with a real generation).

## Functionality Contracts (must not break)

- `js/render.js` render targets and the ids/classes it queries (both branch variants)
- Dice click targets and roll math; `getDiceMessage()` pools
- Overlay data flow from `data.js`/`descriptions.js`
- Tabs + Actions sub-tabs, campaign accordions, quest filters
- Short/Long Rest overlays, Classic CV toggle (view renders as today, modulo font swap)
- Admin login + edit flow (`js/admin.js`, `data/sheets.db` mode on branch)
- Mobile navbar toggle; Create Yours link
- Branch: creator upload → generation → slug page render → past-sheets list; API routes
  untouched

## Verification Plan

- **Per-phase visual gate (standing rule):** local server + Chrome side-by-side
  screenshots, implementation vs. prototype — six desktop pages at desktop width, seven
  mobile frames at 390px. Reconcile before the next phase.
- **Per-phase functional checklist:** the contracts list above, exercised in the browser.
- **Main site:** served statically (`python3 -m http.server`).
- **Branch e2e:** `npm run dev`; upload a CV from `test-cv-s/`; confirm generated sheet
  renders in the new skin; creator page, past sheets, slug nav all work (`.env.local` has
  OpenAI key + local DB mode).
- Final pass: all six pages + creator at both widths, dice + overlays on desktop and as
  bottom sheets on mobile, admin modal, Classic CV toggle.

## Delivery Workflow

1. Worktree + feature branch off `main` (e.g. `redesign/parchment-ink`).
2. Implementation order (per desktop README §Suggested implementation order, mobile layer
   added per page): tokens/`main.css` → index desktop → dice → overlays → index mobile →
   content pages (desktop+mobile each) → copy changes → final verification.
3. Phased commits; user previews locally; PR to `main`; merge = GitHub Pages deploy.
4. Branch port (merge `main` in, sync `public/`, creator restyle), push
   `DnD-cv-maker`; user redeploys Amplify and fixes/repoints the Create Yours URL if it
   changed.

## Risks & Mitigations

- **Pixel fidelity drift** → standing per-phase prototype comparison; prototypes win.
- **Branch port regressions** (heavily diverged `main.js`/`render.js`/`overlay.js`) →
  surgical delta application + full branch e2e including a real generation.
- **Emoji removal misses** → grep sweep for emoji across HTML/JS templates at the end;
  only ornament glyphs remain.
- **Font swap side effects on Classic CV** → accepted & documented (layout untouched,
  body font follows variables).
- **Live-deploy exposure** → nothing merges to `main` without user preview + PR approval.
