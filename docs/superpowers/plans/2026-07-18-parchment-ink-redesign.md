# Parchment & Ink Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the D&D character-sheet CV site (and its Create Yours generator on the `DnD-cv-maker` branch) to the "Parchment & Ink" design, pixel-faithful to the prototypes, with zero behavior change.

**Architecture:** In-place restyle of a vanilla HTML/CSS/JS static site: rewrite CSS to a new token layer, adjust markup only where the design demands, small presentational JS changes (dice choreography, overlay template, mobile accordions/bottom sheets). Then port to the `DnD-cv-maker` branch (Next.js wrapper serving the same files from `public/`).

**Tech Stack:** Vanilla HTML/CSS/JS, Google Fonts (Cinzel, Alegreya, Alegreya Sans SC, Caveat), Python http.server for local serve, Chrome (claude-in-chrome MCP) for visual verification. Branch: Next.js 14 app (`npm run dev`).

**Spec:** `docs/superpowers/specs/2026-07-18-parchment-ink-redesign-design.md`

## Global Constraints

- **Prototypes win every visual question.** Desktop: `design_handoff_dnd_cv_redesign/*.dc.html` (6 pages). Mobile: `design_handoff_dnd_cv_mobile/Mobile Views.dc.html` (7 frames, 390px). Copy on the six pages is carried **verbatim from the prototypes**.
- **Standing verification rule:** every task ends with a side-by-side Chrome comparison implementation ↔ prototype before commit. Serve implementation from the worktree: `python3 -m http.server 8099` → `http://localhost:8099/<page>.html`. Serve prototypes from the main checkout (handoff folders are untracked and absent in the worktree): `cd /Users/busterfranken/Personal-page && python3 -m http.server 8098` → `http://localhost:8098/design_handoff_dnd_cv_redesign/Character%20Sheet.dc.html` etc. Mobile checks: viewport/window 390px wide.
- **Never commit the handoff folders** (`design_handoff_dnd_cv_redesign/`, `design_handoff_dnd_cv_mobile/`). Task 1 adds them to `.gitignore`.
- **Functionality contracts (must not break):** every `id` in the HTML; classes queried by JS: `.rollable`, `.clickable`, `.editable`, `.skill-item`, `.save-item`, `.ability-score`, `.class-item`, `.passive-skill`, `.stat-box`, `.hit-points`, `.defenses-box`, `.conditions-box`, `.campaign-status`, `.spell-item`, `.action-item`, `.tab-btn`, `.tab-panel`, `.sub-tabs`, `.sub-tab`, `.view-toggle-btn`, `.nav-link`, `.navbar-toggle`, `.filter-btn`, `.campaign-card`, `.campaign-header`; all `data-*` attributes (`data-mod`, `data-skill`, `data-ability`, `data-save`, `data-element`, `data-tab`, `data-view`, `data-filter`, `data-campaign`, `data-field`, `data-class`); render targets `#skillsList #actionsList #spellsList #inventoryList #featuresList #backgroundContent #notesContent #extrasContent #projectsGrid #classicCvContainer`; `getDiceMessage()` from `js/descriptions.js` unchanged; localStorage keys (`preferredView`).
- **Design tokens (CSS custom properties, defined once in Task 1, consumed everywhere):**
  `--desk:#241a12` `--parchment:#efe1be` `--panel:#f7eed8` `--panel-border:#c7af7e` `--panel-ring:#e0cd9e` `--tile-border:#b49254` `--ink:#2f2114` `--body-ink:#4a3a22` `--oxblood:#58180d` `--oxblood-hi:#63200f` `--oxblood-lo:#4a130a` `--red-hover:#7a2e1d` `--gold:#9a7b36` `--gold-bright:#c9a85c` `--gold-pale:#e9cf96` `--gold-chip:#d8b878` `--gold-max:#f4e3b6` `--gold-dim:#c8a367` `--label:#7a5c25` `--dot-rule:#d9c491` `--note-blue:#3e5a8c` `--note-red:#a33b2e` `--font-display:'Cinzel',Georgia,serif` `--font-body:'Alegreya',Georgia,serif` `--font-sc:'Alegreya Sans SC',sans-serif` `--font-note:'Caveat',cursive`.
- **Glyph set replaces ALL emoji** in UI text/templates: `✦ ❖ ◆ ◇ ☾ ✉ ✕ ▾ ▸ →`. Exception: the 🎲 favicon stays.
- **Mobile breakpoint:** `@media (max-width: 740px)`. Desktop layout unchanged above it.
- **No behavior changes.** Quirks are preserved (e.g., subpages have no classic view; the toggle there only flips `data-view`/localStorage — keep that; dice modal closes only after the roll is done).
- `css/classic-cv.css` is **not modified**. Old `:root` variables stay defined (classic view + admin internals consume them); only `--font-primary`'s value changes (Inter → Alegreya).
- Git: worktree `../Personal-page-redesign` on branch `redesign/parchment-ink` (created at execution start via superpowers:using-git-worktrees, from `main`). Commit after every task. Commit messages end with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Tasks 13–16 (branch port) run in the MAIN checkout `/Users/busterfranken/Personal-page` on branch `DnD-cv-maker` (it has `.env.local`, `node_modules` for the Next app).

---

### Task 1: Token layer + shared chrome (fonts, desk/sheet, nav band, footer, panel vocabulary)

**Files:**
- Modify: `css/main.css` (full rewrite of D&D-chrome sections; keep old `:root` vars + reset + classic/admin-consumed utilities)
- Modify: `index.html`, `campaigns.html`, `notable.html`, `projects.html`, `contact.html`, `media.html` (font link, `.sheet` wrapper, navbar d20 mark + label changes, footer band)
- Modify: `.gitignore`

**Interfaces:**
- Consumes: existing navbar markup (`#mainNavbar #navbarToggle #navbarMenu`, `.nav-link`, `.campaign-status`, `.rest-btn`, `.view-toggle-btn`), existing `.section-box`/`.section-title` class names.
- Produces (later tasks rely on these exact names): tokens listed in Global Constraints; classes `.sheet`, `.nav-d20`, `.page-head`, `.page-kicker`, `.page-title`, `.page-rule`, `.page-sub`, `.contact-bar` (restyled footer band), `.section-box` (parchment panel), `.section-title` (SC-between-gold-rules), `.chip`, `.chip-red`, `.chip-tag`, `.margin-note`, `.margin-note--red`, `.lift` hover pattern applied via component rules (not a utility class).

- [ ] **Step 1: `.gitignore` — protect handoff folders**

Append:
```
design_handoff_dnd_cv_redesign/
design_handoff_dnd_cv_mobile/
```

- [ ] **Step 2: Swap fonts in all 6 HTML files**

Replace the existing Google Fonts `<link href="https://fonts.googleapis.com/css2?family=Inter...">` line in each page with:
```html
<link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Alegreya+Sans+SC:wght@500;700;800&family=Caveat:wght@400;600&family=Cinzel:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Add `.sheet` wrapper + body class to all 6 pages**

In each page, wrap `<nav class="navbar">…</nav>` **and** the page content container (index: `<div class="dnd-view">…</div>`; other pages: their main content wrapper) in one `<div class="sheet">…</div>`. On index only, add `class="has-classic"` to `<body>` and keep `.classic-view` OUTSIDE `.sheet`. Admin button and modals stay outside `.sheet`.

- [ ] **Step 4: Rewrite `css/main.css` chrome sections**

Keep: old `:root` block (change only `--font-primary: 'Alegreya', Georgia, serif;`), reset, `.editable`, admin-modal base, loading spinner, scrollbar (recolor thumb `#9a7b36`, track `#241a12`). Add the new token block and chrome (complete code):

```css
:root {
  /* Parchment & Ink tokens */
  --desk:#241a12; --parchment:#efe1be; --panel:#f7eed8;
  --panel-border:#c7af7e; --panel-ring:#e0cd9e; --tile-border:#b49254;
  --ink:#2f2114; --body-ink:#4a3a22;
  --oxblood:#58180d; --oxblood-hi:#63200f; --oxblood-lo:#4a130a; --red-hover:#7a2e1d;
  --gold:#9a7b36; --gold-bright:#c9a85c; --gold-pale:#e9cf96; --gold-chip:#d8b878;
  --gold-max:#f4e3b6; --gold-dim:#c8a367; --label:#7a5c25; --dot-rule:#d9c491;
  --note-blue:#3e5a8c; --note-red:#a33b2e;
  --font-body:'Alegreya', Georgia, serif;
  --font-sc:'Alegreya Sans SC', sans-serif;
  --font-note:'Caveat', cursive;
  --grain:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .05 0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E");
}

body {
  font-family: var(--font-body);
  background: radial-gradient(ellipse 100% 60% at 50% -10%, rgba(154,123,54,.18), transparent 60%), var(--desk);
  color: var(--ink);
  padding: 26px 14px 44px;
  display: flex; flex-direction: column; align-items: center;
}
html[data-view="classic"] body.has-classic { background: var(--light-bg); display: block; padding: 0; }

.sheet {
  width: 1220px; min-width: 1220px; position: relative;
  background:
    radial-gradient(ellipse 90% 60% at 50% 0%, rgba(255,248,224,.5), transparent 70%),
    radial-gradient(ellipse 80% 50% at 100% 100%, rgba(120,84,30,.14), transparent 65%),
    var(--grain), var(--parchment);
  border: 3px double var(--gold);
  box-shadow: inset 0 0 70px rgba(120,84,30,.22), 0 10px 40px rgba(0,0,0,.5);
  color: var(--ink);
}
html[data-view="classic"] body.has-classic .sheet {
  width: auto; min-width: 0; background: none; border: none; box-shadow: none;
}

/* Nav band */
.navbar {
  display: flex; align-items: center; gap: 14px;
  background: linear-gradient(180deg, var(--oxblood-hi), var(--oxblood) 60%, var(--oxblood-lo));
  padding: 10px 16px; border-bottom: 2px solid var(--gold); white-space: nowrap;
}
.nav-d20 {
  flex: none; width: 24px; height: 26px;
  clip-path: polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%);
  background: var(--gold-bright); display: flex; align-items: center; justify-content: center;
  font: 700 10px var(--font-display); color: var(--oxblood-lo);
}
.navbar-left { display: flex; gap: 13px; align-items: center; }
.nav-link {
  font: 700 10px var(--font-sc); letter-spacing: .1em; color: var(--gold-chip);
  text-decoration: none; padding-bottom: 2px;
}
.nav-link:hover { color: var(--gold-max); }
.nav-link.active { color: var(--gold-max); border-bottom: 2px solid var(--gold-bright); }
.navbar-right { margin-left: auto; display: flex; align-items: center; gap: 9px; }
.campaign-status { font: 500 9px var(--font-sc); letter-spacing: .08em; color: var(--gold-dim); cursor: pointer; }
.campaign-status .campaign-name { color: var(--gold-max); }
.rest-btn { border: none; cursor: pointer; border-radius: 2px; font: 700 9px var(--font-sc); letter-spacing: .08em; }
.rest-btn.short-rest { color: var(--oxblood-lo); background: var(--gold-chip); padding: 4px 8px; }
.rest-btn.short-rest:hover { background: var(--gold-pale); }
.rest-btn.long-rest { color: var(--gold-chip); background: transparent; border: 1px solid var(--gold); padding: 3px 8px; }
.rest-btn.long-rest:hover { color: var(--gold-max); }
.view-toggle { display: flex; border: 1px solid var(--gold); border-radius: 2px; overflow: hidden; background: none; box-shadow: none; padding: 0; margin-left: 0; }
.view-toggle-btn { font: 700 9px var(--font-sc); letter-spacing: .06em; color: var(--gold-dim); padding: 4px 7px; background: transparent; border: none; border-radius: 0; cursor: pointer; }
.view-toggle-btn:hover { color: var(--gold-max); background: transparent; }
.view-toggle-btn.active { background: var(--gold-bright); color: var(--oxblood-lo); }

/* Footer contact band */
.contact-bar {
  display: flex; justify-content: center; gap: 26px;
  background: linear-gradient(180deg, var(--oxblood-hi), var(--oxblood-lo));
  border-top: 2px solid var(--gold); padding: 9px 20px;
  font: 600 10.5px var(--font-sc); letter-spacing: .12em;
}
.contact-bar a, .contact-bar .contact-item { color: var(--gold-chip); display: inline-flex; gap: 5px; align-items: center; }
.contact-bar a:hover { color: var(--gold-max); }

/* Panel + section title (restyle existing class names) */
.section-box {
  background: var(--panel); border: 1px solid var(--panel-border); border-radius: 0;
  box-shadow: inset 0 0 0 3px var(--panel), inset 0 0 0 4px var(--panel-ring);
  padding: 12px 14px; margin-bottom: 0;
}
.section-title {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
  font: 700 10px var(--font-sc); letter-spacing: .2em; color: var(--oxblood);
  text-transform: none; border-bottom: none; padding-bottom: 0;
}
.section-title::before, .section-title::after { content: ''; flex: 1; height: 1px; background: var(--panel-border); }

/* Page header (content pages) */
.page-head { text-align: center; padding: 30px 26px 6px; }
.page-kicker { font: 700 9.5px var(--font-sc); letter-spacing: .3em; color: var(--label); }
.page-title { font: 700 36px var(--font-display); color: var(--oxblood); text-shadow: 0 1px 0 rgba(255,248,224,.6); margin-top: 4px; }
.page-rule { display: flex; align-items: center; gap: 12px; justify-content: center; margin-top: 8px; color: var(--gold); font-size: 11px; }
.page-rule::before { content: ''; width: 120px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold)); }
.page-rule::after  { content: ''; width: 120px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }
.page-sub { font: 500 14px var(--font-body); font-style: italic; color: var(--body-ink); margin-top: 8px; }

/* Chips */
.chip-tag { font: 500 11.5px var(--font-body); border: 1px solid var(--tile-border); background: var(--parchment); padding: 2px 10px; border-radius: 10px; }
.chip-red { font: 600 11.5px var(--font-body); color: var(--gold-max); background: var(--oxblood); border: 1px solid var(--gold); padding: 2px 10px; border-radius: 10px; }

/* Rotated-square proficiency pip (restyles existing .proficiency-marker) */
.proficiency-marker { width: 7px; height: 7px; border: 1px solid var(--oxblood); border-radius: 0; transform: rotate(45deg); margin-right: 0; }
.proficiency-marker.filled, .proficiency-marker.expertise { background: var(--oxblood); border-color: var(--oxblood); }

/* Margin notes */
.margin-note { position: absolute; font: 600 15px var(--font-note); color: var(--note-blue); white-space: nowrap; pointer-events: none; z-index: 5; }
.margin-note--red { color: var(--note-red); }

/* Rollable: parchment highlight instead of emoji */
.rollable { cursor: pointer; padding: 0 4px; border-radius: 3px; }
.rollable:hover { background: var(--parchment); color: inherit; transform: none; }
.rollable::after { content: none; }

/* Admin button: glyph + parchment */
.admin-login-btn { background: var(--panel); border: 1px solid var(--panel-border); color: var(--label); font-size: 14px; }
```

- [ ] **Step 5: Update navbar + footer markup in all 6 pages**

Navbar: insert `<div class="nav-d20">20</div>` as first child of `.navbar` (before the toggle button); change button labels to `✦ Short Rest`, `☾ Long Rest` (index only — they're `dnd-only`), toggle labels to `◆ D&D View` and `Classic CV` (remove 🎲/📄); change admin button text `⚙️` → `◆`. Add `Create Yours ↗` arrow to the external nav link text. Footer: replace each page's existing footer with the shared band (keep index's `.contact-bar` classes; ADD this footer to the 5 content pages before `</div>` closing `.sheet`):
```html
<footer class="contact-bar">
  <a href="mailto:busterfranken@gmail.com" class="contact-item">✉ busterfranken@gmail.com</a>
  <a href="tel:+31624877967" class="contact-item">❖ +31 6 2487 7967</a>
  <a href="https://linkedin.com/in/buster-franken" target="_blank" class="contact-item">❖ LinkedIn</a>
  <a href="https://github.com/BusterFranken" target="_blank" class="contact-item">❖ GitHub</a>
  <span class="contact-item location">❖ Amsterdam, Netherlands</span>
</footer>
```
(Index: rewrite its existing `.contact-bar` inner markup to this glyph form.)

- [ ] **Step 6: Serve + verify**

Run both servers (see Global Constraints). Open `http://localhost:8099/index.html` and `http://localhost:8098/design_handoff_dnd_cv_redesign/Character%20Sheet.dc.html`. Verify: desk background, 1220px double-gold sheet, red nav band with gold d20 + SC links + gold rest chips + segmented toggle, red footer band. Old inner content will still look unstyled — expected at this stage. Check all 6 pages load; hamburger still toggles (resize < 740px); view toggle on index still switches to Classic (light bg, classic content, unchanged layout); ESC/refresh persistence works.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "redesign: token layer + shared parchment chrome (nav band, footer, panels)"
```

---

### Task 2: index.html desktop — character header, HP, ability & combat tiles, defenses/conditions

**Files:**
- Modify: `index.html` (header block, lines ~62–184), `css/character-sheet.css` (rewrite header/tiles/HP/defenses sections)

**Interfaces:**
- Consumes: Task 1 tokens/classes; existing ids/classes/`data-*` in the header block (`.character-header`, `.character-avatar`, `.character-name`, `.character-class`, `.class-item`, `.background`, `.alignment`, `.ability-score`, `.ability-modifier`, `.ability-value`, `.ability-name`, `.combat-stats`, `.stat-box` variants, `.hit-points`, `.defenses-box`, `.conditions-box`, `.dc-item`).
- Produces: classes `.level-banner`, `.char-details-sep` (❖ separators are text), combat tile clip-path classes `.stat-box.armor-class` (shield) / `.stat-box.initiative` (hexagon) with two-layer `::before`/`::after` technique; margin notes `#note-hp`, `#note-alignment`, `#note-cha`, `#note-conditions`.

- [ ] **Step 1: Header markup adjustments (index.html)**

Keep every element/id/data-attr; changes only: add `<span class="level-banner">Level 7</span>` inside `.character-avatar`; replace `•` separators in `.character-details` with `❖`; add margin notes:
```html
<span class="margin-note" id="note-alignment">← "chaotic" is generous —B</span>
<span class="margin-note margin-note--red" id="note-hp">still full HP!</span>
<span class="margin-note" id="note-cha">the money-maker</span>
<span class="margin-note" id="note-conditions">always, tbh</span>
```
(anchor each inside the positioned parent: alignment note after `.character-details`, hp note inside `.hit-points-container`, cha note inside the CHA `.ability-score`, conditions note inside `.conditions-box`).

- [ ] **Step 2: CSS — portrait, name block, HP box** (`css/character-sheet.css`)

```css
.character-header { padding: 22px 26px 8px; background: none; border: none; }
.character-header-content { display: flex; gap: 20px; align-items: center; }
.character-avatar { position: relative; flex: none; }
.character-avatar img {
  width: 104px; height: 104px; border-radius: 50%; object-fit: cover;
  filter: sepia(.28) contrast(1.04); border: 3px solid var(--oxblood);
  box-shadow: 0 0 0 2px var(--parchment), 0 0 0 4px var(--gold), 0 3px 8px rgba(60,35,10,.35);
}
.level-banner {
  position: absolute; bottom: -7px; left: 50%; transform: translateX(-50%);
  background: var(--oxblood); color: var(--gold-pale);
  font: 700 8.5px var(--font-sc); letter-spacing: .16em; padding: 2px 9px;
  border: 1px solid var(--gold); border-radius: 2px; white-space: nowrap;
}
.character-name { font: 700 34px/1 var(--font-display); color: var(--oxblood); text-shadow: 0 1px 0 rgba(255,248,224,.6); }
.character-class { font: 500 14.5px var(--font-body); font-style: italic; color: var(--body-ink); margin-top: 5px; }
.character-class:hover { color: var(--oxblood); }
.character-details { font: 700 10px var(--font-sc); letter-spacing: .16em; color: var(--label); margin-top: 5px; position: relative; }
.character-details .clickable { border-bottom: 1px dotted var(--gold); }
.character-details .clickable:hover { color: var(--oxblood); opacity: 1; }
.hit-points-container { position: relative; margin-left: auto; }
.hit-points {
  text-align: center; background: var(--panel); border: 1px solid var(--panel-border);
  box-shadow: inset 0 0 0 3px var(--panel), inset 0 0 0 4px var(--panel-border), 0 1px 3px rgba(60,35,10,.15);
  padding: 12px 22px 10px; cursor: pointer; transition: transform 150ms ease, box-shadow 150ms ease;
}
.hit-points:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 3px var(--panel), inset 0 0 0 4px var(--panel-border), 0 4px 10px rgba(60,35,10,.3); }
.hp-label { font: 700 8px var(--font-sc); letter-spacing: .18em; color: var(--label); }
.hp-values { font: 700 30px var(--font-display); color: var(--oxblood); }
.hp-separator { color: var(--gold); }
.hp-title { font: 700 9px var(--font-sc); letter-spacing: .22em; color: var(--label); margin-top: 2px; }
.hp-meaning { font: 500 11px var(--font-body); font-style: italic; color: var(--oxblood); }
#note-hp { right: 8px; top: -16px; transform: rotate(5deg); font-size: 16px; }
```
Reconcile the exact HP numeral size/paddings against the prototype during Step 5 (the prototype is authoritative; adjust to match its rendering).

- [ ] **Step 3: CSS — ability tiles + combat tiles**

```css
.core-stats-row { display: flex; gap: 10px; align-items: stretch; padding: 14px 26px 4px; }
.ability-scores { display: flex; gap: 8px; }
.ability-score {
  width: 92px; background: var(--panel); border: 1px solid var(--tile-border);
  box-shadow: inset 0 1px 0 rgba(255,250,235,.8), 0 1px 2px rgba(60,35,10,.12);
  text-align: center; padding: 9px 0 7px; position: relative; cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease; border-radius: 0;
}
.ability-score:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(60,35,10,.28); opacity: 1; }
.ability-score::before { content: '✦'; position: absolute; top: 2px; left: 5px; color: var(--panel-border); font-size: 8px; }
.ability-modifier { font: 700 24px var(--font-display); color: var(--oxblood); border-radius: 4px; }
.ability-modifier:hover { background: var(--parchment); }
.ability-value {
  font: 600 13px var(--font-body); color: var(--body-ink); background: var(--parchment);
  border: 1px solid var(--panel-border); border-radius: 9px; width: 34px; margin: 3px auto;
}
.ability-name { font: 700 9.5px var(--font-sc); letter-spacing: .2em; color: var(--label); }
#note-cha { bottom: -18px; left: 50%; transform: translateX(-50%) rotate(-2deg); }

.combat-stats { display: flex; gap: 8px; flex: 1; }
.stat-box {
  flex: 1; background: var(--panel); border: 1px solid var(--tile-border); text-align: center;
  padding: 10px 4px 7px; cursor: pointer; position: relative; transition: transform 150ms ease, box-shadow 150ms ease;
}
.stat-box:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(60,35,10,.28); opacity: 1; }
.stat-value { font: 700 22px var(--font-display); color: var(--ink); }
.stat-value .unit { font-size: 12px; color: var(--label); }
.stat-label { font: 700 8.5px var(--font-sc); letter-spacing: .12em; color: var(--label); margin-top: 4px; }
/* Initiative: gold hexagon, two stacked clip-path layers */
.stat-box.initiative { background: none; border: none; }
.stat-box.initiative::before { content: ''; position: absolute; inset: 0; clip-path: polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%); background: var(--gold); }
.stat-box.initiative::after { content: ''; position: absolute; inset: 2px; clip-path: polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%); background: var(--panel); }
.stat-box.initiative > * { position: relative; z-index: 1; }
.stat-box.initiative .stat-value { color: var(--oxblood); }
/* Armor Class: oxblood shield */
.stat-box.armor-class { background: none; border: none; }
.stat-box.armor-class::before { content: ''; position: absolute; inset: 0; clip-path: polygon(50% 0,100% 14%,93% 62%,50% 100%,7% 62%,0 14%); background: var(--oxblood); }
.stat-box.armor-class::after { content: ''; position: absolute; inset: 2.5px; clip-path: polygon(50% 0,100% 14%,93% 62%,50% 100%,7% 62%,0 14%); background: var(--panel); }
.stat-box.armor-class > * { position: relative; z-index: 1; }
.stat-box.armor-class .stat-value { color: var(--oxblood); padding-top: 1px; }
.stat-box.heroic-inspiration .stat-value { color: var(--gold); }
```

- [ ] **Step 4: CSS — defenses & conditions rows**

```css
.defenses-conditions-row { display: flex; gap: 10px; padding: 10px 26px 12px; }
.defenses-box, .conditions-box { flex: 1; display: flex; align-items: center; gap: 10px; background: none; border: none; padding: 0; position: relative; }
.dc-title { font: 700 9px var(--font-sc); letter-spacing: .18em; color: var(--label); margin: 0; }
.dc-list { display: flex; gap: 6px; flex-wrap: wrap; }
.defenses-box .dc-item { font: 500 11.5px var(--font-body); border: 1px solid var(--tile-border); background: var(--parchment); padding: 2px 10px; border-radius: 10px; }
.conditions-box .dc-item.active { font: 600 11.5px var(--font-body); color: var(--gold-max); background: var(--oxblood); border: 1px solid var(--gold); padding: 2px 10px; border-radius: 10px; }
#note-conditions { right: -8px; top: 50%; transform: translateY(-50%); position: absolute; }
#note-alignment { display: inline; position: static; margin-left: 8px; pointer-events: none; }
```

- [ ] **Step 5: Visual gate (standing rule)**

Compare `http://localhost:8099/index.html` header region vs prototype at 1280px+ width. Match: portrait frame + Level 7 banner, name/class/detail type, HP double-frame, 6 tiles with corner ✦ + score pills, hexagon initiative + shield AC, chips, all four margin notes present and positioned like the prototype. Functional: click portrait-area elements (class line, background, alignment, each ability, each stat box, HP, defenses, conditions) — old-styled overlays open with data (overlay restyle comes in Task 5); ability mods roll dice.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "redesign: index header — portrait frame, HP, ability & combat tiles, chips, margin notes"
```

---

### Task 3: index.html desktop — columns (saves, passives, proficiencies, skills, tab panel) + copy sync

**Files:**
- Modify: `index.html` (main grid area), `css/character-sheet.css` (columns/tabs sections), `js/render.js` (renderSkills + renderActionItem templates), `js/data.js` (attack properties, overlay-visible copy)

**Interfaces:**
- Consumes: Task 1 tokens/`.section-box`/`.section-title`/pips; render targets & classes from Global Constraints.
- Produces: `.main-content` grid `300px 330px 1fr`; skills row grid `[pip|abbr|name|mod]`; `.skill-abbr` span inside `.skill-item` (new, additive — no JS queries it); action rows show `.action-tags` (e.g. `finesse · reach`) and `.action-effect` italic line; `#note-passives`, `#note-languages`, `#note-skills` margin notes; tab bar red-block active style.

- [ ] **Step 1: Grid + left column CSS**

```css
.main-content { display: grid; grid-template-columns: 300px 330px 1fr; gap: 14px; padding: 2px 26px 20px; }
.left-column { display: flex; flex-direction: column; gap: 12px; }
.saves-list { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 14px; }
.save-item { display: flex; align-items: center; gap: 7px; border-bottom: 1px dotted var(--panel-border); padding: 3px 0; }
.save-abbr { font: 700 10px var(--font-sc); letter-spacing: .1em; color: var(--label); }
.save-mod { margin-left: auto; font: 700 13px var(--font-display); color: var(--ink); }
.save-item.proficient .save-mod { color: var(--oxblood); }
.passive-skill { display: flex; align-items: center; gap: 8px; border-bottom: 1px dotted var(--dot-rule); padding: 4px 0; position: relative; }
.passive-value { font: 700 15px var(--font-display); color: var(--oxblood); }
.passive-label { font: 700 9px var(--font-sc); letter-spacing: .14em; color: var(--label); }
.senses { padding-top: 6px; }
.senses-label { font: 700 9px var(--font-sc); letter-spacing: .14em; color: var(--label); }
.senses-value { font: 500 12.5px var(--font-body); font-style: italic; color: var(--body-ink); }
.prof-category { border-bottom: 1px dotted var(--dot-rule); padding: 5px 0; }
.prof-label { display: block; font: 700 9px var(--font-sc); letter-spacing: .18em; color: var(--label); }
.prof-value { font: 500 12.5px/1.45 var(--font-body); color: var(--body-ink); }
```
Reconcile row paddings/exact sub-details against the prototype's left column during Step 7.

- [ ] **Step 2: Languages copy (index.html static)**

`.prof-category` LANGUAGES value becomes exactly: `Common (English · Native), Dwarvish (Dutch · Native), Giant (German · B2)`. Add margin notes in index.html: `<span class="margin-note" id="note-languages">— ja, echt waar</span>` (inside the LANGUAGES `.prof-category`, `position:absolute; right:0; top:-4px; transform:rotate(-2deg)`), `<span class="margin-note" id="note-passives">reads rooms</span>` (inside the passive-insight `.passive-skill`, right-aligned).

- [ ] **Step 3: Skills — render template + CSS**

In `js/render.js` `renderSkills()`, adjust the row template to (keeping `.skill-item clickable`, `data-skill`, `.skill-mod rollable` + `data-mod` exactly as-is; add the abbr span):
```javascript
return `
  <div class="skill-item ${skill.proficient ? 'proficient' : ''} clickable" data-skill="${skillKey}">
    <span class="proficiency-marker ${skill.expertise ? 'expertise' : skill.proficient ? 'filled' : ''}"></span>
    <span class="skill-abbr">${skill.ability.toUpperCase()}</span>
    <span class="skill-name">${skill.name}</span>
    <span class="skill-mod rollable" data-mod="${skill.modifier}" data-skill="${skill.name}">${skill.modifier >= 0 ? '+' : ''}${skill.modifier}</span>
  </div>`;
```
(Adapt to the function's existing variable names — keep its skillKey computation identical.) CSS:
```css
.skills-list { display: block; }
.skill-item { display: grid; grid-template-columns: 14px 32px 1fr auto; align-items: center; gap: 0 9px; }
.skill-abbr { font: 700 8.5px var(--font-sc); color: var(--gold); }
.skill-name { font: 500 12.5px var(--font-body); border-bottom: 1px dotted var(--dot-rule); padding: 2.5px 0; }
.skill-item.proficient .skill-name { font-weight: 600; }
.skill-mod { font: 700 12.5px var(--font-display); color: var(--ink); }
.skill-item.proficient .skill-mod { color: var(--oxblood); }
.skills-section { position: relative; }
#note-skills { position: absolute; right: 10px; bottom: -6px; transform: rotate(-2deg); }
```
Add to index.html inside `.skills-section`: `<span class="margin-note" id="note-skills">+10?! nat 20 energy ↑ (click it!)</span>`.

- [ ] **Step 4: Tab panel CSS + templates**

```css
.tab-nav { display: flex; gap: 2px; border-bottom: 2px solid var(--oxblood); margin-bottom: 10px; flex-wrap: wrap; background: none; }
.tab-btn { font: 700 9.5px var(--font-sc); letter-spacing: .1em; color: var(--label); padding: 5px 10px 4px; background: none; border: none; cursor: pointer; }
.tab-btn.active { background: var(--oxblood); color: var(--gold-max); }
.sub-tabs { display: flex; gap: 6px; margin-bottom: 8px; }
.sub-tab { font: 700 8.5px var(--font-sc); letter-spacing: .12em; color: var(--label); background: none; border: 1px solid var(--panel-border); border-radius: 10px; padding: 2px 10px; cursor: pointer; }
.sub-tab.active { background: var(--oxblood); color: var(--gold-max); border-color: var(--gold); }
.action-tags { font: 700 8.5px var(--font-sc); letter-spacing: .12em; color: var(--gold); }
.action-effect { font: 500 12px var(--font-body); font-style: italic; color: var(--body-ink); }
```
In `js/render.js` `renderActionItem(action)`: keep the existing wrapper (`.action-item clickable` + data attrs + rollable to-hit) and add, under the name line: `<span class="action-tags">${(action.properties||[]).map(p=>p.toLowerCase()).join(' · ')}</span>` and an italic `<div class="action-effect">${action.effect || action.description || ''}</div>`. Restyle actions/spells/inventory/features/background/notes/extras row rules to dotted `var(--dot-rule)` + SC section headers with gold rules (`✦ Attacks`-style headers: `font:700 9px var(--font-sc); letter-spacing:.22em; color:var(--oxblood)` + `::after` gold rule + italic hint `click to-hit to roll`). Match each tab's exact layout to the prototype (open the ACTIONS/SPELLS/INVENTORY/FEATURES/BACKGROUND/NOTES/EXTRAS tabs in the prototype one by one and reconcile). Extras tab: interest chips use `.chip-tag`; append the prototype's closing line `Want a sheet of your own? Create Yours ↗` linking to the existing external creator URL.

- [ ] **Step 5: `js/data.js` copy sync (attacks)**

Set `properties` so tags render exactly as the prototype: Pitch Attack `["Finesse","Reach"]` (already), Network Strike `["Ranged","Unlimited"]` (was `["Ranged"]`), Cold Outreach `["Ranged","Light"]` (already). Verify every action's `effect` text against the prototype's italic effect lines; update `data.js` strings verbatim where they differ.

- [ ] **Step 6: `js/descriptions.js` — no changes** (guard: `getDiceMessage` untouched this task).

- [ ] **Step 7: Visual gate**

Side-by-side with the prototype: saving-throws 2-col grid, passives, proficiencies (languages line + note), 18 skill rows with pips/abbrs/dotted rules, tab bar red active block, each tab's content layout, margin notes. Functional: tabs + sub-tabs switch; skill/save/mod clicks roll; skill rows open overlays; admin edit mode still enters (⚙ button → login modal).

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "redesign: index columns — saves, passives, proficiencies, skills, tab panel; attack tags + effects"
```

---

### Task 4: Dice roller — wax-seal choreography + mobile bottom sheet

**Files:**
- Modify: `css/dice.css` (full rewrite), `js/dice.js` (presentation flow), `index.html` (dice modal inner markup)

**Interfaces:**
- Consumes: `#diceModal #dice #diceResult #diceMessage`, `.dice-title`, `rollDice(checkName, modifier)`, `handleRollClick`, `getDiceMessage(roll, total, skillName)` (unchanged), `isRolling` guard, close-only-when-done behavior.
- Produces: `.dice-card` (shaken wrapper), `.die-hex`, `.die-num`, `.die-d20-label`, `.dice-kicker`, `.result-row`, `.total-stamp`, `.dice-banner--crit/--fumble`, `.dice-hint`; generic mobile pattern `.as-bottom-sheet` media-query treatment reused by Task 5.

- [ ] **Step 1: index.html dice modal markup**

Replace `.dice-content` inner structure with:
```html
<div class="dice-content">
  <div class="dice-card">
    <div class="dice-grabber"></div>
    <div class="dice-kicker">Ability Check</div>
    <div class="dice-title">ROLLING...</div>
    <div class="dice-container">
      <div class="dice" id="dice">
        <div class="die-hex-outer"></div>
        <div class="die-hex-inner"></div>
        <div class="die-hex-text"><span class="dice-face">20</span><span class="die-d20-label">d20</span></div>
      </div>
    </div>
    <div class="dice-tumble-hint">the die tumbles across the table…</div>
    <div class="dice-result" id="diceResult"></div>
    <div class="dice-message" id="diceMessage"></div>
    <div class="dice-hint">click outside the card to close</div>
  </div>
</div>
```
(Keeps ids `diceModal/dice/diceResult/diceMessage` and `.dice-face` so `js/dice.js` queries keep working.)

- [ ] **Step 2: css/dice.css rewrite (complete)**

```css
.dice-modal { background: rgba(20,12,6,.74); }
.dice-content { cursor: pointer; }
.dice-card {
  width: 480px; max-width: 92vw; cursor: default; text-align: center;
  background: var(--grain), var(--parchment);
  border: 3px double var(--gold);
  box-shadow: inset 0 0 50px rgba(120,84,30,.22), 0 24px 70px rgba(0,0,0,.65);
  padding: 22px 26px 18px;
}
.dice-modal.done .dice-card { animation: pi-shake .5s; }
.dice-grabber { display: none; }
.dice-kicker { font: 700 9.5px var(--font-sc); letter-spacing: .26em; color: var(--label); }
.dice-title { font: 700 21px var(--font-display); color: var(--oxblood); margin-top: 2px; text-transform: none; }
.dice-container { width: 130px; height: 130px; margin: 16px auto 6px; position: relative; }
.dice { position: relative; width: 130px; height: 130px; transition: transform .09s linear; }
.die-hex-outer { position: absolute; inset: 0; clip-path: polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%); background: radial-gradient(circle at 38% 30%, #8a2a17, #58180d 60%, #3d0e07); box-shadow: 0 6px 16px rgba(60,20,5,.5); }
.die-hex-inner { position: absolute; inset: 3px; clip-path: polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%); background: radial-gradient(circle at 40% 32%, #7e2413, #4a130a 65%); }
.die-hex-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.dice-face { font: 800 52px var(--font-display); color: var(--gold-pale); text-shadow: 0 2px 2px #3d0e07; background: none; }
.die-d20-label { font: 700 8px var(--font-sc); letter-spacing: .32em; color: var(--gold-dim); margin-top: -4px; }
.dice-tumble-hint { font: 500 14px var(--font-body); font-style: italic; color: var(--label); padding: 8px 0 6px; }
.dice-modal.done .dice-tumble-hint { display: none; }
.dice-result { display: none; }
.dice-result.visible { display: block; animation: pi-fadeup .3s; }
.result-row { display: flex; justify-content: space-between; border-bottom: 1px dotted var(--panel-border); padding: 5px 2px; font: 500 13.5px var(--font-body); color: var(--body-ink); }
.result-row .result-value { font: 700 15px var(--font-display); color: var(--ink); }
.result-total { display: flex; justify-content: space-between; align-items: center; padding: 8px 2px 2px; }
.total-label { font: 700 11px var(--font-sc); letter-spacing: .22em; color: var(--oxblood); }
.total-stamp {
  display: inline-flex; align-items: center; justify-content: center;
  width: 56px; height: 56px; border-radius: 50%;
  background: radial-gradient(circle at 38% 30%, #8a2a17, #58180d 65%);
  color: var(--gold-pale); font: 800 26px var(--font-display);
  box-shadow: 0 3px 8px rgba(60,20,5,.4), inset 0 2px 5px rgba(255,220,160,.3);
  animation: pi-stamp .45s;
}
.dice-banner--crit { font: 700 12px var(--font-sc); letter-spacing: .2em; color: var(--oxblood-lo); background: linear-gradient(90deg, transparent, var(--gold-chip), transparent); padding: 5px 0; margin-top: 10px; }
.dice-banner--fumble { font: 700 12px var(--font-sc); letter-spacing: .2em; color: var(--gold-max); background: linear-gradient(90deg, transparent, var(--oxblood), transparent); padding: 5px 0; margin-top: 10px; }
.dice-message { font: 500 14px var(--font-body); font-style: italic; color: var(--body-ink); border-top: 1px solid var(--panel-border); margin-top: 10px; padding-top: 9px; display: none; }
.dice-message.visible { display: block; }
.dice-hint { font: 500 10.5px var(--font-body); font-style: italic; color: var(--gold); margin-top: 10px; }
@keyframes pi-shake { 0%,100%{transform:translate(0,0) rotate(0)} 15%{transform:translate(-8px,4px) rotate(-.7deg)} 35%{transform:translate(7px,-5px) rotate(.6deg)} 55%{transform:translate(-5px,3px) rotate(-.3deg)} 75%{transform:translate(4px,-2px) rotate(.2deg)} }
@keyframes pi-stamp { 0%{transform:scale(2.4) rotate(-16deg);opacity:0} 55%{transform:scale(.92) rotate(2deg);opacity:1} 100%{transform:scale(1) rotate(0)} }
@keyframes pi-fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
@media (prefers-reduced-motion: reduce) {
  .dice { transition: none; }
  .dice-modal.done .dice-card, .total-stamp, .dice-result.visible { animation: none; }
}
/* Mobile bottom sheet (pattern shared with overlays) */
@media (max-width: 740px) {
  .dice-modal { align-items: flex-end; }
  .dice-card {
    width: 100%; max-width: 100%; border: none; border-top: 3px double var(--gold);
    border-radius: 22px 22px 0 0; box-shadow: 0 -12px 40px rgba(0,0,0,.5);
    padding: 10px 22px 22px; animation: pi-slideup .3s;
  }
  .dice-grabber { display: block; width: 42px; height: 4px; border-radius: 2px; background: var(--panel-border); margin: 0 auto 12px; }
  .dice-container, .dice { width: 110px; height: 110px; }
  .dice-face { font-size: 44px; }
  .dice-hint { display: none; }
  @keyframes pi-slideup { from{transform:translateY(100%)} to{transform:none} }
}
```

- [ ] **Step 3: js/dice.js choreography changes**

Replace the animation section (keep `rollD20`, `handleRollClick`, close handlers, `isRolling`, exports):
```javascript
function rollDice(checkName, modifier) {
  if (isRolling) return;
  isRolling = true;
  diceModal.classList.add('active');
  diceModal.classList.remove('done');
  diceResult.classList.remove('visible');
  diceMessage.classList.remove('visible', 'crit-success', 'crit-fail');
  diceTitle.textContent = checkName;
  document.body.style.overflow = 'hidden';

  const roll = rollD20();
  const total = roll + modifier;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 550 : 1400;
  let rot = 0;

  const iv = setInterval(() => {
    diceFace.textContent = Math.floor(Math.random() * 20) + 1;
    rot += 80 + Math.random() * 160;
    diceElement.style.transform = `rotate(${rot}deg)`;
  }, 85);

  setTimeout(() => {
    clearInterval(iv);
    rot = Math.ceil(rot / 360) * 360;
    diceElement.style.transform = `rotate(${rot}deg)`;
    showResult(roll, modifier, total, checkName);
  }, duration);
}

function showResult(roll, modifier, total, checkName) {
  diceFace.textContent = roll;
  diceModal.classList.add('done');
  diceResult.innerHTML = `
    <div class="result-row"><span>1d20 — the roll</span><span class="result-value">${roll}</span></div>
    <div class="result-row"><span>Modifier</span><span class="result-value">${modifier >= 0 ? '+' : ''}${modifier}</span></div>
    <div class="result-total"><span class="total-label">Total</span><span class="total-stamp">${total}</span></div>
    ${roll === 20 ? '<div class="dice-banner--crit">✦ ✦ ✦ &nbsp;CRITICAL&nbsp; ✦ ✦ ✦</div>' : ''}
    ${roll === 1 ? '<div class="dice-banner--fumble">✕ &nbsp;FUMBLE&nbsp; ✕</div>' : ''}`;
  setTimeout(() => diceResult.classList.add('visible'), 60);
  diceMessage.textContent = getDiceMessage(roll, total, checkName);
  if (roll === 20) diceMessage.classList.add('crit-success');
  if (roll === 1) diceMessage.classList.add('crit-fail');
  setTimeout(() => { diceMessage.classList.add('visible'); isRolling = false; }, 500);
}
```
Add swipe-down close for mobile (append near the existing close handlers):
```javascript
let touchStartY = null;
diceModal?.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
diceModal?.addEventListener('touchmove', (e) => {
  if (touchStartY !== null && e.touches[0].clientY - touchStartY > 60) { touchStartY = null; closeDiceModal(); }
}, { passive: true });
```
Preserve: close only when `.done` (backdrop click + ESC), body scroll lock.

- [ ] **Step 4: Verify**

Desktop: roll from an ability mod, a save, a skill, an attack to-hit, spell attack. Observe: label + check name, hex die tumbling ~1.4s with rotation, settle upright, card shake, rows fade up, total stamps in, message from existing pools; force-check crit/fumble by temporarily hard-coding `roll = 20` then `1` (revert!). Compare against prototype's dice interaction (click a mod in the prototype). 390px viewport: sheet slides from bottom, grabber shows, swipe-down closes, tap-backdrop closes.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "redesign: wax-seal dice roller with tumble/shake/stamp + mobile bottom sheet"
```

---

### Task 5: Overlays — parchment modal, red header band, art plate + rest/admin restyle

**Files:**
- Modify: `css/overlay.css` (full rewrite), `js/overlay.js` (all `get*OverlayContent` templates), `js/main.js` (`getElementOverlayContent`, rest-button overlay templates — glyphs + new structure), `js/descriptions.js` (add `artLabel`/`photoCaption` to `abilityDescriptions`), `js/data.js` (overlay copy sync where the prototype differs), `css/main.css` (admin modal restyle block)

**Interfaces:**
- Consumes: `#overlayModal #overlayBody #overlayClose`, `openOverlay(content)`, `characterData`, `abilityDescriptions`, `skillDescriptions`, `rollFromOverlay`; Task 1 tokens; Task 4's bottom-sheet media pattern.
- Produces: overlay template classes `.ov-head`, `.ov-title`, `.ov-sub`, `.ov-badge`, `.ov-close-x`, `.ov-body`, `.ov-plate`, `.ov-plate-caption`, `.ov-blurb`, `.ov-evidence-title`, `.ov-evidence-row`, `.ov-roll-btn`; `abilityDescriptions[k].artLabel` (string) and `.photoCaption` (CHA only) consumed by branch Task 14.

- [ ] **Step 1: css/overlay.css rewrite** — modal backdrop `rgba(20,12,6,.74)`; `.overlay-content`: width 640px, max-width 94vw, `var(--grain), var(--parchment)` bg, `3px double var(--gold)`, `inset 0 0 50px rgba(120,84,30,.22), 0 24px 70px rgba(0,0,0,.65)` shadow, `animation: pi-fadeup .25s`, padding 0. Header band: flex baseline, `linear-gradient(180deg,var(--oxblood-hi),var(--oxblood-lo))`, `padding: 11px 18px`, `border-bottom: 2px solid var(--gold)`; `.ov-title` `700 19px var(--font-display) var(--gold-max)`; `.ov-sub` `500 11px var(--font-sc) ls .14em var(--gold-dim)`; `.ov-badge` `800 17px var(--font-display) var(--gold-pale); border:1px solid var(--gold); padding:1px 10px; margin-left:auto`. Body `display:flex; gap:16px; padding:16px 18px`. Plate: 150px col; photo `150×180 object-fit:cover; filter:sepia(.55) contrast(1.05); border:1px solid var(--tile-border); box-shadow:0 0 0 4px var(--parchment),0 0 0 5px var(--gold)`; placeholder `1px dashed var(--gold); background:repeating-linear-gradient(45deg,rgba(154,123,54,.1) 0 8px,transparent 8px 16px)`; caption `500 10.5px italic var(--label)`. Blurb `500 13.5px/1.5 italic var(--font-body); border-left:3px solid var(--gold); padding-left:10px; color:var(--body-ink)`. Evidence title `700 9px var(--font-sc) ls .22em var(--oxblood)`; rows `500 12.5px/1.45; padding:4px 0; border-bottom:1px dotted var(--dot-rule)` prefixed `◆ `. Vouch/calculation sections restyled with the same SC titles + dotted rows. `.ov-roll-btn`: `700 10.5px var(--font-sc) ls .14em; color:var(--gold-max); background:var(--oxblood); border:1px solid var(--gold); padding:9px 18px; border-radius:2px; hover background:#6b2413`. `.overlay-close` → `.ov-close-x` gold ✕ in the band (`color:var(--gold-dim); hover var(--gold-max)`). Mobile ≤740px: same bottom-sheet treatment as Task 4 (align-items flex-end, full width, radius 22px 22px 0 0, grabber, slide-up).

- [ ] **Step 2: js/overlay.js template rewrite** — every `get*OverlayContent` returns the new structure. Canonical (ability variant):
```javascript
function getAbilityOverlayContent(abilityKey) {
  const ability = characterData.abilities[abilityKey];
  const desc = abilityDescriptions[abilityKey];
  const plate = desc.photoCaption
    ? `<div class="ov-plate"><img src="assets/images/buster.jpg" alt="${ability.name}">
       <div class="ov-plate-caption">${desc.photoCaption}</div></div>`
    : `<div class="ov-plate"><div class="ov-plate-art"><span>${desc.artLabel || 'commissioned art'}</span></div>
       <div class="ov-plate-caption">your AI art drops in here</div></div>`;
  return `
    <div class="ov-head">
      <span class="ov-title">${ability.name}</span>
      <span class="ov-sub">Score ${ability.score} · ${ability.cvMeaning}</span>
      <span class="ov-badge rollable" data-mod="${ability.modifier}" data-ability="${abilityKey}">${ability.modifier >= 0 ? '+' : ''}${ability.modifier}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      ${plate}
      <div class="ov-main">
        <div class="ov-blurb">${ability.cvDescription}</div>
        <div class="ov-evidence-title">Key Evidence</div>
        ${ability.evidence.map(e => `<div class="ov-evidence-row">◆ ${e}</div>`).join('')}
        ${ability.vouch ? `<div class="ov-evidence-title">Vouch</div><div class="ov-blurb">"${ability.vouch.text}" — ${ability.vouch.author}, ${ability.vouch.role}</div>` : ''}
        <button class="ov-roll-btn" onclick="rollFromOverlay('${ability.abbr}', ${ability.modifier})">✦ Roll ${ability.abbr} Check</button>
      </div>
    </div>`;
}
```
Apply the same head/body pattern to skills, classes, alignment, combat stats, saving throws, spells, actions, defenses, inspiration, conditions, campaign (no plate for non-ability overlays — `.ov-body` without plate). Keep every data source and `rollFromOverlay` calls. The `#overlayClose` button in index.html can be hidden via CSS (band ✕ replaces it) but keep the element + handler.

- [ ] **Step 3: descriptions.js art fields** — add to `abilityDescriptions`: str `artLabel:'commissioned art — "impact force"'`, dex `'…"the pivot dance"'`, con `'…"the long march"'`, int `'…"the scholar of three schools"'`, wis `'…"the counsel of elders"'`, cha `photoCaption:'The Face of the Party'`.

- [ ] **Step 4: Copy sync from prototype OV data** — the prototype's script block (in `Character Sheet.dc.html`, `const OV={…}`) holds final overlay copy (blurbs `d`, evidence `k`, subtitles `s`) for str/dex/con/int/wis/cha/conditions/defenses/hp/initiative/ac/speed/prof/inspiration/alignment/background/classes/passives/campaign. Diff each against `data.js`/`descriptions.js` and update the data files verbatim where they differ (e.g. STR evidence "Closed €45M in deals with major organizations", alignment blurb ending "— ask Tata Steel.").

- [ ] **Step 5: Rest overlays + admin restyle (js/main.js, css/main.css)** — Short/Long Rest overlay content: swap emoji bullets to glyphs (🎉→✦, 🧖→❖, 🏔️→◆, 🎵→◇, 🎨→✦, 🧘→☾, 📧→✉, 💼→❖, 📄→❖, ⚡→✦, 🌙→☾), replace inline `style="…var(--primary-red)…"` button styling with `.ov-roll-btn` (solid red) and a new `.ov-outline-btn` (gold outline, defined in overlay.css) — content text unchanged. Admin modal: parchment panel, `700 19px var(--font-display)` heading, input with `1px solid var(--panel-border)` parchment bg, submit as `.ov-roll-btn`. ADMIN MODE banner: oxblood bg, gold text.

- [ ] **Step 6: Verify** — click through EVERY overlay: 6 abilities (CHA shows sepia photo + caption; others hatched plate + artLabel), class line, background, alignment, HP, all 5 stat boxes, defenses, conditions, campaign status, a skill, a save, a spell, an action, Short Rest, Long Rest. Compare vs prototype overlays (click same elements in prototype). Roll buttons work from overlays; ✕ and backdrop and ESC close. Admin login modal opens/styled; login flow unaffected. Mobile 390px: overlays present as bottom sheets.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "redesign: parchment overlays with art plates; rest & admin modals restyled"
```

---

### Task 6: index.html mobile layer (≤740px) — vitals stack, ability strip, accordions, quick bar

**Files:**
- Modify: `css/character-sheet.css` (mobile media block — replace ALL existing `@media` mobile rules for the sheet), `css/main.css` (mobile nav dropdown), `index.html` (accordion headers + quick bar markup), `js/main.js` (accordion logic + quick bar wiring)

**Interfaces:**
- Consumes: Tasks 1–5 classes; existing `#navbarToggle` dropdown behavior; `characterData` for preview lines; `#shortRestBtn`, `#longRestBtn`, `.view-toggle-btn[data-view]`.
- Produces: `.acc-head` (injected accordion headers), `.acc-open` state class, `.quick-bar` fixed footer, `.abilities-caption`, section-to-accordion mapping (used verbatim by branch Task 14): Saving Throws → `.saving-throws`; Proficiencies & Senses → `.passive-skills` + `.proficiencies` (one accordion, two panels); Skills → `.skills-section`; Actions → `#actions-panel`; Spells → `#spells-panel`; Inventory → `#inventory-panel`; Features, Background & Notes → `#features-panel + #background-panel + #notes-panel + #extras-panel`.

- [ ] **Step 1: Mobile nav (css/main.css)** — ≤740px: `.navbar` = red top bar; `.navbar-toggle` hamburger gold bars (17×2px, third 11px); page-title center: add `<span class="navbar-page-title">Character Sheet</span>` (per page, its own name) shown only ≤740px, `700 11px var(--font-sc) ls .22em var(--gold-max)`; `.nav-d20` right (order via flex). Open menu (`#navbarMenu` existing toggle class): stacked gold SC links on the red band; `.campaign-status`, rest buttons and view toggle move into the dropdown (CSS `order`/full-width rows). Preserve existing open/close JS untouched.

- [ ] **Step 2: Mobile header/vitals CSS (character-sheet.css, one `@media (max-width:740px)` block replacing old mobile rules)** — Delete the existing mobile media queries for the sheet (the old reflow). New block: `.sheet { width:100%; min-width:0; border-width:2px; }` body padding 0; header card: portrait 72px (border 2.5px, rings 2px/3.5px, Level banner 7.5px), name `700 23px/1.05`, class line `500 11.5px`, details `700 8px`; HP: full-width banner under header (flex row, values `700 26px`, meaning right-aligned italic 11px, HP margin note visible `right:8px; top:-13px; rotate(4deg); font-size:14px`); ALL other margin notes `display:none`. Vitals: `.combat-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; padding:10px 16px 0; }` order AC, Initiative, Speed, Proficiency (CSS `order`); AC tile ≤740 uses simple border style `1px solid var(--oxblood)` + inner ring (per mobile frame — reconcile with frame 1a), Initiative hexagon `polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)` gold; values `700 17px`; labels `6.5px ls .1em`; `.stat-box.heroic-inspiration { display:none; }` (frame shows 4 tiles — deliberate; inspiration stays reachable on desktop only). Abilities strip: `.ability-scores { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:8px; padding:0 16px; } .ability-score { flex:none; width:84px; scroll-snap-align:start; }` + right-edge fade `.core-stats-row::after` (`position:absolute; right:0; width:44px; linear-gradient(90deg,transparent,var(--parchment)); pointer-events:none`) + caption line under strip: add `<div class="abilities-caption">swipe · tap to roll</div>` in index.html (`500 10px italic var(--label)`, hidden >740px). `.core-stats-row { display:block; position:relative; }` `.defenses-conditions-row { display:block; padding:10px 16px 0; }` conditions chips wrap.

- [ ] **Step 3: Accordion markup (index.html)** — Inside each mapped container (see Interfaces), add as first child a header button (hidden >740px):
```html
<button class="acc-head" type="button" aria-expanded="false">
  <span class="acc-title">Saving Throws</span>
  <span class="acc-preview"></span>
  <span class="acc-chevron">▸</span>
</button>
```
Titles: `Saving Throws`, `Proficiencies & Senses`, `Skills`, `Actions`, `Spells`, `Inventory`, `Features, Background & Notes`. For the merged last accordion, wrap the four tab panels in `<div class="acc-group" id="miscGroup">` (inside `.tab-content`, panels keep their ids — desktop tab JS unaffected since it toggles `.active` on panels).

- [ ] **Step 4: Accordion CSS** — ≤740px: `.main-content { display:flex; flex-direction:column; gap:8px; padding:12px 16px 76px; }` (bottom padding clears quick bar); hide `.tab-nav`, hide desktop-only `.section-title` where an `.acc-head` exists (`.section-box > .section-title { display:none }` in mobile block); `.acc-head { display:flex; align-items:center; gap:10px; width:100%; background:none; border:none; padding:0 0 4px; cursor:pointer; } .acc-title { font:700 10px var(--font-sc); letter-spacing:.2em; color:var(--oxblood); } .acc-preview { font:500 10.5px var(--font-body); font-style:italic; color:var(--label); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; text-align:left; } .acc-chevron { font:700 12px var(--font-display); color:var(--gold); }` Collapsed: section content hidden (`.section-box.collapsed > :not(.acc-head) { display:none }`); open: `.acc-open` shows content with `animation: pi-fadeup .25s`, chevron ▾, header underline `border-bottom:1px solid var(--panel-border)`, Skills gets hint `tap a value to roll` (small span in the header, shown when open). Skill rows ≤740: `grid-template-columns:14px 32px 1fr auto; .skill-name { font-size:13.5px; padding:9px 0; } .skill-mod { font:700 14px var(--font-display); background:var(--parchment); border:1px solid var(--panel-border); border-radius:9px; padding:6px 13px; }` (44px target). Sub-tabs inside open Actions: horizontal chip row (already chips from Task 3). Above 740px: `.acc-head { display:none }` and all sections visible (desktop untouched).

- [ ] **Step 5: Accordion + quick bar JS (js/main.js)** — add `setupMobileAccordions()` called from `init()`:
```javascript
function setupMobileAccordions() {
  const mq = window.matchMedia('(max-width: 740px)');
  const heads = document.querySelectorAll('.acc-head');
  if (!heads.length) return;
  function apply() {
    heads.forEach(h => {
      const box = h.parentElement;
      if (mq.matches) { box.classList.add('collapsed'); box.classList.remove('acc-open'); h.setAttribute('aria-expanded','false'); h.querySelector('.acc-chevron').textContent = '▸'; }
      else { box.classList.remove('collapsed','acc-open'); }
    });
    if (mq.matches) fillAccordionPreviews();
  }
  heads.forEach(h => h.addEventListener('click', () => {
    if (!mq.matches) return;
    const box = h.parentElement, wasOpen = box.classList.contains('acc-open');
    heads.forEach(o => { o.parentElement.classList.add('collapsed'); o.parentElement.classList.remove('acc-open'); o.setAttribute('aria-expanded','false'); o.querySelector('.acc-chevron').textContent = '▸'; });
    if (!wasOpen) { box.classList.remove('collapsed'); box.classList.add('acc-open'); h.setAttribute('aria-expanded','true'); h.querySelector('.acc-chevron').textContent = '▾'; }
  }));
  mq.addEventListener('change', apply);
  apply();
}
function fillAccordionPreviews() {
  const d = typeof characterData !== 'undefined' ? characterData : null;
  if (!d) return;
  const set = (title, text) => {
    document.querySelectorAll('.acc-head').forEach(h => {
      if (h.querySelector('.acc-title').textContent === title) h.querySelector('.acc-preview').textContent = text;
    });
  };
  const profSaves = Object.values(d.abilities).filter(a => a.saveProficient)
    .map(a => `${a.abbr} +${a.modifier + d.coreStats.proficiencyBonus}`).join(' · ');
  set('Saving Throws', profSaves);
  const topSkills = [...d.skills].sort((a,b) => b.modifier - a.modifier).slice(0,2)
    .map(s => `${s.name} +${s.modifier}`).join(' · ') + ' …';
  set('Skills', topSkills);
  const attacks = d.actions.filter(a => a.attackBonus != null);
  const others = d.actions.length - attacks.length;
  if (attacks.length) set('Actions', `${attacks[0].name} +${attacks[0].attackBonus} · ${attacks.length} attacks, ${others} moves`);
  set('Spells', `${d.spells.length} spells · save DC ${d.coreStats.spellSaveDC ?? 15}`);
  set('Inventory', `${d.inventory.length} items`);
}
```
(Adjust property names to the actual `data.js` shapes — check `d.actions`/`d.spells`/`d.inventory` field names while implementing; previews are display-only.) Quick bar — add before `</body>`-level end of `.dnd-view` in index.html:
```html
<div class="quick-bar dnd-only">
  <button type="button" id="qbShort">✦ Short Rest</button>
  <button type="button" id="qbLong">☾ Long Rest</button>
  <button type="button" id="qbClassic">❖ Classic CV</button>
</div>
```
CSS: hidden >740px; ≤740px `position:fixed; bottom:0; left:0; right:0; display:flex; background:linear-gradient(180deg,var(--oxblood-hi),var(--oxblood-lo)); border-top:2px solid var(--gold); z-index:900;` buttons `flex:1; padding:15px 0; font:700 9.5px var(--font-sc); letter-spacing:.14em; color:var(--gold-chip); background:none; border:none;` first child color `var(--gold-max)`; 1px gold dividers (`box-shadow` or borders). JS wiring in `setupRestButtons()` area: `qbShort→shortRestBtn.click()`, `qbLong→longRestBtn.click()`, `qbClassic→document.querySelector('.view-toggle-btn[data-view="classic"]').click()`.

- [ ] **Step 6: Visual gate vs frames 1a/1b (390px)** — order: top bar → header card → HP banner (+red note) → 4 vitals → swipe strip (snaps, fade edge, caption) → conditions → 7 accordion bars with previews → quick bar. Open Skills: pill mods, 44px rows, hint, one-at-a-time. Compare against `http://localhost:8098/design_handoff_dnd_cv_mobile/Mobile%20Views.dc.html` frames 1a/1b. Note deliberate deviations to report at review: 7 bars (frame shows 6 — Proficiencies & Senses added so no data is lost), inspiration tile hidden ≤740px. Desktop >740px: NOTHING changed (verify side-by-side vs Task 3 state). Dice + overlays open as bottom sheets (from Tasks 4–5). Functional: previews correct vs data.js values, quick bar buttons trigger rest overlays/classic toggle.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "redesign: mobile character sheet — vitals stack, ability strip, accordions, quick bar"
```

---

### Task 7: campaigns.html (desktop + mobile) + campaign copy changes

**Files:**
- Modify: `campaigns.html` (page header, panel structure adjustments, copy), `css/campaigns.css` (rewrite)

**Interfaces:**
- Consumes: Task 1 chrome (`.page-head` etc., `.section-box`, chips); existing inline accordion script (`.campaign-card`, `.campaign-header`, `data-campaign`) — behavior preserved.
- Produces: `.campaign-initial` (44px letter tile), `.campaign-status-chip`, `.adventure` (gold-left-border block), `.milestone` / `.milestone--notable`, `.side-quests-grid`.

- [ ] **Step 1: Page header** — replace current header with `.page-head`: kicker `The Chronicles of a Founder`, title `Campaign Journal`, `.page-rule` with ❖, subtitle italic (carry the prototype's exact subtitle: `Professional adventures, from early quests to epic boss battles. Click a campaign to unfold it.`).
- [ ] **Step 2: Panels** — each `.campaign-card` (F/A/Z/O = FruitPunch/Academic/Zindi/Early years): `.section-box` look; header row: 44px initial tile (`border:1px solid var(--gold); background:var(--parchment); font:700 22px var(--font-display); color:var(--oxblood); box-shadow:inset 0 0 0 2px var(--panel),inset 0 0 0 3px var(--panel-border)`), title `700 20px var(--font-display) var(--oxblood)`, meta italic `500 12px var(--label)`, status chip (`.chip-red` style pill e.g. `✓ Acquired by Zindi`), chevron `700 13px var(--font-display) var(--gold)` ▸/▾ (swap glyph in the existing inline toggle script or via CSS class). Hover header `background:#f2e7cc`. Body: description, Party Members chip row (`.chip-tag`), adventures with `border-left` gold rule, milestones: notable `background:var(--parchment); border-left:3px solid var(--gold-bright); padding:5px 10px` + `✦` gold prefix; normal `◆` red prefix, `padding:3px 10px`.
- [ ] **Step 3: Copy changes (verbatim from `Campaigns.dc.html`)** — "The 200+ Pitches" (was 50+), add Adventure "Building the Platform" (2019–2020), add "The Dropout Decision" milestone, Zindi "all 80+ partnerships handed over intact", The Watch "graveyard shifts included", fundraise "two hundred doors knocked, the right ones opened." — plus carry ALL other campaign copy verbatim from the prototype (open it and transcribe; it contains the full final text of every campaign, adventure, milestone and side quest).
- [ ] **Step 4: Side Quests** — 3-col card grid (`.section-box` cards). Mobile ≤740px: horizontal swipe rail (`overflow-x:auto`, 200px `flex:none` cards, right-edge fade); campaign meta compressed to one italic line; initial tiles 34px; milestones/adventures 12px; header `.page-title` 25px, kicker 8px.
- [ ] **Step 5: Visual gate** — desktop vs `Campaigns.dc.html` (all four panels open one by one — chevrons/hover/animation `pi-fadeup .25s`); 390px vs frame 1d. Functional: expand/collapse works exactly as before (inline script untouched or minimally adapted for chevron glyph only).
- [ ] **Step 6: Commit** — `git add -A && git commit -m "redesign: campaign journal — parchment panels, milestones, side-quest rail; copy upgrades"`

---

### Task 8: notable.html (desktop + mobile)

**Files:** Modify `notable.html`, `css/notable.css` (rewrite).

**Interfaces:** Consumes Task 1 chrome. Produces `.ribbon` + `.ribbon--legendary/--epic/--rare` (clip-path pennant `polygon(0 0,100% 0,100% 100%,50% 78%,0 100%)`), `.ledger-row` (year-ledger), reused by media/contact tasks.

- [ ] **Step 1: Page header** — kicker `Deeds Worthy of the Bards`, title `Hall of Fame`, rule + ❖, subtitle verbatim from prototype.
- [ ] **Step 2: Achievement cards** — section rule `Notable Adventures` (`.section-title` style, 12px ls .26em); 3-col grid, `.section-box` cards with `border:1px solid var(--gold-bright)`; ribbon top-right: `position:absolute; top:-1px; right:12px; font:700 8.5px var(--font-sc); letter-spacing:.2em; padding:3px 10px 4px; clip-path:polygon(0 0,100% 0,100% 100%,50% 78%,0 100%);` legendary `background:linear-gradient(180deg,var(--gold-pale),var(--gold-bright)); color:var(--oxblood-lo)`; epic `background:linear-gradient(180deg,#7a2e1d,var(--oxblood)); color:var(--gold-max)`; rare `background:linear-gradient(180deg,#54749f,var(--note-blue)); color:#fff` (reconcile exact epic/rare gradients against the prototype); title `700 16px var(--font-display) var(--oxblood); padding-right:70px`; body `500 12.5px/1.5`; stat footer `border-top:1px dotted var(--panel-border); font:700 9px var(--font-sc) ls .12em var(--label)` with red values.
- [ ] **Step 3: Key Encounters ledger** — 2-col grid; row: year `700 15px var(--font-display) var(--gold)` + `◆` red + one-liner, dotted rules. Carry all copy verbatim from prototype.
- [ ] **Step 4: Mobile (frame 1f)** — cards 1/row, ledger single-column with 36px year gutter, header sizes per frame.
- [ ] **Step 5: Visual gate** — vs `Notable.dc.html` and frame 1f. Then commit: `git add -A && git commit -m "redesign: hall of fame — rarity ribbons + year ledger"`

---

### Task 9: projects.html (desktop + mobile)

**Files:** Modify `projects.html`, `css/projects.css` (rewrite), `js/render.js` (`renderProjects` card template + `getCategoryEmoji` → glyph).

**Interfaces:** Consumes Task 1 chrome; existing filter JS (`.filter-btn[data-filter]`, `.project-card[data-category]`) and `#projectsGrid`/`aiForGoodProjects` contract. Produces `.partners-strip`, `.quest-stats` strip.

- [ ] **Step 1: Page header** — kicker `Posted at the Guild Hall`, title `Quest Board`, subtitle verbatim from prototype.
- [ ] **Step 2: Filter chips** — restyle `.filter-btn`: SC chip, active = red pill (`background:var(--oxblood); color:var(--gold-max); border:1px solid var(--gold)`); labels: carry from prototype (drop emoji: `Wildlife`, `Earth`, …). Filtering JS untouched.
- [ ] **Step 3: Partners strip** — text names separated by gold ✦ (`font:600 12px var(--font-body)`, ✦ `color:var(--gold-bright); font-size:8px`) — names verbatim from prototype (NXP, Philips, TU/e, United Nations, + the rest in the prototype strip). NO logos.
- [ ] **Step 4: Quest cards** — in `renderProjects()` template: `.section-box` card, image div `height:150px; border:1px solid var(--tile-border)` (keep existing `project.image` + onerror fallback — fallback glyph `❖` instead of emoji: change `getCategoryEmoji` to return glyphs `✦ ❖ ◆ ◇`), kicker = category SC gold, title `700 15px var(--font-display) var(--oxblood)`, blurb, `View quest details →` italic dotted-underline link (same hrefs). 3-col grid.
- [ ] **Step 5: Stats strip** — `€45M / 4500+ / 50+ / 80+` numbers `var(--font-display)` red with SC labels (exact numbers/labels from prototype).
- [ ] **Step 6: Mobile (frame 1e)** — filter chips horizontal scroll strip 44px tall; cards 1/row; stats 2×2 grid.
- [ ] **Step 7: Visual gate** vs `Projects.dc.html` + frame 1e; filters still filter. Commit: `git add -A && git commit -m "redesign: quest board — filter chips, partners strip, quest cards, stats"`

---

### Task 10: contact.html (desktop + mobile)

**Files:** Modify `contact.html`, `css/network.css` only if its widget is visibly broken by tokens (otherwise untouched); rewrite contact styles (in `contact.html`'s linked css — `css/main.css` page section or dedicated block in `css/notable.css`? No: contact styles live inline in `contact.html`? Check at implementation — contact.html links main/character-sheet CSS; add a `css/contact.css` file if none exists and link it).

**Interfaces:** Consumes Task 1 chrome + Task 8 `.ledger-row`. Produces `.scroll-card`, `.cta-panel`, `.ov-outline-btn` reuse.

- [ ] **Step 1: Page header** — kicker `Allies, Guilds & Ravens`, title + subtitle verbatim from prototype (`Contact.dc.html`).
- [ ] **Step 2: Contact scroll cards** — 4 cards (email/phone/LinkedIn/GitHub): `.section-box`, glyphs ✉/❖, label SC + value; email card `border:1px solid var(--gold-bright)`. Keep hrefs.
- [ ] **Step 3: Home Base + Guilds** (left) beside 4 **Letters of Recommendation** quote cards (right): italic quote, author line SC; carry all quotes verbatim from prototype.
- [ ] **Step 4: CTA panel** — `Ready to Start a New Quest?` (`700 22px var(--font-display) var(--oxblood)`), subtitle italic, buttons: `✦ Start a Quest` (`.ov-roll-btn` pattern: red solid, mailto with `?subject=New Quest Inquiry`) + `❖ Download CV` (`.ov-outline-btn`: `color:var(--oxblood); border:1px solid var(--gold); padding:9px 18px; hover background:var(--panel)`, href `Resume-Buster-short.pdf`).
- [ ] **Step 5: Mobile (frame 1g)** — scrolls as full-width rows (glyph · label+value · →), stacked cards, CTAs stacked full-width ≥48px.
- [ ] **Step 6: Visual gate** vs `Contact.dc.html` + frame 1g. Commit: `git add -A && git commit -m "redesign: adventurer's guild — scroll cards, letters, CTA"`

---

### Task 11: media.html (desktop + mobile)

**Files:** Modify `media.html`, rewrite its styles (media styles live in page-linked CSS — same approach as Task 10; create `css/media.css` if none exists).

**Interfaces:** Consumes Task 1 chrome, Task 8 ribbon + ledger patterns.

- [ ] **Step 1: Page header** — kicker `As Told Around the Fire`, title `Tavern Tales & Chronicles` (title verbatim from prototype), subtitle.
- [ ] **Step 2: Featured podcast card** — full-width `.section-box` with `border-color:var(--gold-bright)` + gold `Featured` ribbon (Task 8 pennant), kicker SC gold (`Impact Innovators at the Fireside · January 2025`), title `700 18px var(--font-display)`, blurb, source italic — all copy/links verbatim from prototype.
- [ ] **Step 3: Podcast cards (3-col) + video cards (2)** — `.section-box` cards, hover lift; keep existing hrefs/embeds (restyle frames around any iframes).
- [ ] **Step 4: Press Chronicles** — 2-col year-ledger, source names `color:var(--oxblood)`; **Key Numbers** strip like projects stats. Copy verbatim.
- [ ] **Step 5: Mobile (frame 1f patterns)** — card stack + single-column ledger.
- [ ] **Step 6: Visual gate** vs `Media.dc.html` + mobile frame. Commit: `git add -A && git commit -m "redesign: tavern tales — featured card, chronicles ledger, key numbers"`

---

### Task 12: Sweep + full-site verification (main site done gate)

**Files:** Possibly touch any `css/js/html` from Tasks 1–11 (fixes only); `js/render.js`, `js/main.js` (leftover emoji).

- [ ] **Step 1: Emoji sweep** — Run:
```bash
grep -rnoP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{FE0F}]' index.html campaigns.html notable.html projects.html contact.html media.html js/*.js css/*.css | grep -v 'favicon' | grep -vP '✦|❖|◆|◇|☾|✉|✕|▾|▸|→|↗'
```
Expected: no output (favicon line excepted). Fix any hits (replace with glyph set).
- [ ] **Step 2: Copy checklist vs desktop README §Copy changes** — attack tags ✓(T3), effect lines ✓(T3), 200+ Pitches ✓(T7), Building the Platform + Dropout Decision ✓(T7), Zindi 80+ intact ✓(T7), graveyard shifts ✓(T7), two hundred doors ✓(T7), languages D&D form ✓(T3), 5 kickers ✓(T7–T11). Verify each renders on the page.
- [ ] **Step 3: Full visual pass** — all 6 pages, desktop width AND 390px, against all 6 desktop prototypes + all 7 mobile frames. Fix all diffs. (This is the final reconciliation — be pedantic: spacing, font sizes, colors, glyphs, hover states.)
- [ ] **Step 4: Full functional checklist** — dice (ability/save/skill/attack/spell + crit/fumble styling), every overlay type, tabs + sub-tabs, campaign accordions, quest filters, Short/Long Rest (navbar + quick bar), Classic CV toggle (classic layout unchanged except body font Alegreya; print button works), admin login + edit mode + save flow, navbar hamburger, mobile accordions/strip/bottom sheets/quick bar, Create Yours link present, footer links.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "redesign: final sweep — emoji purge, copy checklist, full visual/functional pass"`. Then STOP: user previews (`http://localhost:8099`), then PR `redesign/parchment-ink` → `main` (superpowers:finishing-a-development-branch decides merge mechanics with the user).

---

### Task 13: Branch merge + mechanical sync (`DnD-cv-maker`)

**Location:** MAIN checkout `/Users/busterfranken/Personal-page`.

**Files:** Branch `DnD-cv-maker`: merge commit; `public/css/*` (copied), `public/js/dice.js`, `public/js/descriptions.js`, `public/js/admin.js` (copied); `public/css/character-sheet.css` (re-add restyled `.back-to-owner`).

- [ ] **Step 1:** `git checkout DnD-cv-maker && git pull origin DnD-cv-maker`. Merge the redesign: `git merge main` (after the PR merged; if not yet merged, `git merge redesign/parchment-ink`). Resolve conflicts favoring: redesign for root files, branch logic for `app/`, `lib/`, `public/` (public/ gets synced next step).
- [ ] **Step 2:** Sync shared files root → public:
```bash
for f in main.css character-sheet.css dice.css overlay.css campaigns.css notable.css projects.css classic-cv.css network.css contact.css media.css; do [ -f css/$f ] && cp css/$f public/css/$f; done
for f in dice.js descriptions.js admin.js data.js; do cp js/$f public/js/$f; done
```
(`data.js` is safe to copy: branch delta was +2 lines — inspect `git diff main:js/data.js DnD-cv-maker:public/js/data.js` first and re-apply those 2 lines if they're branch-specific.) Re-add to `public/css/character-sheet.css` the branch's `.nav-link.back-to-owner` block, restyled:
```css
.nav-link.back-to-owner { color: var(--oxblood-lo); background: var(--gold-chip); padding: 4px 8px; border-radius: 2px; margin-right: 4px; font-weight: 700; }
.nav-link.back-to-owner:hover { background: var(--gold-pale); }
```
- [ ] **Step 3:** `npm run dev` → open `http://localhost:3000/index.html` (owner sheet): chrome + tiles + dice + overlays styled. Note what's still old-styled (page HTML + main.js/render.js/overlay.js — next task).
- [ ] **Step 4:** Commit on branch: `git add -A && git commit -m "port: merge parchment redesign + sync shared css/js into public/"`

---

### Task 14: Branch surgical port (diverged JS + page skeletons)

**Files:** `public/js/main.js`, `public/js/render.js`, `public/js/overlay.js`, `public/*.html` (index/campaigns/notable/projects/contact/media), `public/js/load-app-data.js` (only if it injects styled markup — inspect).

- [ ] **Step 1:** For each diverged file, generate the redesign delta on root and re-apply to the branch version: `git diff <merge-base-before-redesign> main -- js/overlay.js` (the redesign changes) applied function-by-function onto `public/js/overlay.js` (which has extra slug/dynamic logic — keep ALL of it; replace only template bodies and add the new functions/fields from Tasks 5–6). Same for `main.js` (accordions, quick bar, rest templates, nav additions) and `render.js` (skills/action templates, glyph fallbacks) — the branch's extended render functions (dynamic campaigns/notable/contact/media renderers) must emit the SAME classes the new CSS styles (`.campaign-card` structure, `.ribbon--*`, `.ledger-row`, `.scroll-card`, `.chip-tag`…): update their template strings to the Task 7–11 markup patterns.
- [ ] **Step 2:** Page HTML: apply the Task 1 chrome changes (font link, `.sheet` wrapper, nav d20 + labels, footer band) + Task 2/3/6 index changes + Task 7–11 static structures onto the branch's `public/*.html` skeletons, PRESERVING branch-specific elements: slug nav propagation attributes, example-page banner, hidden Classic CV toggle on generated pages, Back to Buster link.
- [ ] **Step 3:** Overlay art-plate fallback for generated sheets: in `public/js/overlay.js`, when `abilityDescriptions[k].artLabel/photoCaption` are absent (generated data), render the hatched placeholder with caption `commissioned art` (generic) — verify no `undefined` appears in the overlay.
- [ ] **Step 4:** Verify with `npm run dev`: owner pages (`/index.html`, `/campaigns.html`, …) match the main-site rendering pixel-for-pixel (open `localhost:3000` vs `localhost:8099` side by side); example sheet page (`/index.html?slug=<example>` — find the example slug via `/api/sheets` or the repo's example data) renders fully styled with dynamic data; mobile 390px works incl. accordions.
- [ ] **Step 5:** Commit: `git add -A && git commit -m "port: surgical redesign port to branch dynamic renderers + page skeletons"`

---

### Task 15: creator.html + creator.css restyle (extrapolated)

**Files:** `public/creator.html`, `public/css/creator.css` (rewrite). `public/js/creator.js` NOT modified (verify ids it queries stay: `dropzone`, `fileInput`, upload/generate buttons, progress and past-sheets containers — read creator.js first and list them).

- [ ] **Step 1:** Read `public/js/creator.js`; write down every id/class it queries. These are contracts.
- [ ] **Step 2:** Restyle `creator.html`: Task 1 chrome (fonts, `.sheet`, nav band with `MODE: Character Creator` chip, footer band); `.page-head` with kicker `Forge Your Own Legend` (extrapolated — flag for user review), existing title/subtitle text kept; upload card = `.section-box`; dropzone: `border:1px dashed var(--gold); background:repeating-linear-gradient(45deg,rgba(154,123,54,.1) 0 8px,transparent 8px 16px)`, glyph `❖` (replaces 📜), SC hint lines; file chips `.chip-tag`; primary button `✦ Create My Character Sheet` = `.ov-roll-btn` red (keep existing button TEXT if different — copy stays); progress/status area: parchment panel + `.ledger-row` steps; "your past sheets" = dotted `.ledger-row` list with red ◆. Mobile ≤740px: single column stack, ≥48px targets.
- [ ] **Step 3:** Verify: `npm run dev` → `/creator.html` styled; drag-drop targets respond (drop a file: chip appears); nothing in creator.js errors (console clean).
- [ ] **Step 4:** Commit: `git add -A && git commit -m "port: creator page restyled to parchment & ink (extrapolated design)"`

---

### Task 16: Branch e2e + final gate

- [ ] **Step 1:** `npm run dev` with `.env.local` present (OpenAI key + local DB). Upload `test-cv-s/CV-2026-01-23.pdf` on `/creator.html`, run full generation (background job polling), open the generated slug URL.
- [ ] **Step 2:** Generated sheet checklist: parchment chrome; tiles/skills/tabs render from generated data; dice roll works; overlays open (generic art placeholder, no `undefined`); campaigns/notable/contact/media dynamic pages styled; slug propagates across nav; Back to Buster chip styled; Classic CV toggle hidden (branch behavior); example banner styled; past-sheets list shows the new sheet; mobile 390px spot-check (accordions + bottom sheets on generated sheet).
- [ ] **Step 3:** Emoji sweep on branch `public/` (same grep as Task 12 Step 1, path `public/`). Expected: favicon only.
- [ ] **Step 4:** Commit any fixes; report done. Push (`git push origin DnD-cv-maker`) ONLY with user approval; user redeploys Amplify + decides the Create Yours URL (spec: unchanged unless user provides a new one).

---

## Plan Self-Review (completed)

1. **Spec coverage:** tokens/chrome→T1; index desktop→T2–T3; dice→T4; overlays+rest+admin→T5; index mobile (frames 1a–1c)→T4–T6; content pages desktop+mobile (frames 1d–1g)→T7–T11; copy changes→T3/T5/T7 + T12 checklist; emoji purge→T1/T5/T9 + T12 sweep; branch merge/sync→T13; diverged port→T14; creator→T15; branch e2e incl. real generation→T16; standing prototype rule→every task's visual gate. Margin notes: T2 (4 notes) + T3 (3 notes) = all 7 from the prototype.
2. **Placeholders:** none — every step has code, exact values, or an exact prototype location to transcribe from (transcription of final copy is data transfer, not deferred design).
3. **Type consistency:** token names, `.acc-head`/`.quick-bar`/`.ov-*`/`.ribbon--*`/`.chip-*`/`.ledger-row`/`.scroll-card` used consistently across T1→T15; dice ids unchanged from current code; accordion mapping in T6 Interfaces matches T14's port instructions.

**Known deliberate interpretations to surface at user review:** (a) 7 mobile accordions vs 6 in frame 1a (adds "Proficiencies & Senses" so no data is lost); (b) heroic-inspiration tile hidden ≤740px (frame shows 4 vitals); (c) creator kicker "Forge Your Own Legend" (no prototype exists); (d) overlay keeps vouch/calculation/roll-button sections (data-preserving) restyled to tokens though the prototype's overlays don't show them.
