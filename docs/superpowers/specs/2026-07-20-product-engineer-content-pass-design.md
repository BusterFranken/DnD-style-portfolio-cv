# Content pass: Product Engineer + "The Forge" chapter

**Date:** 2026-07-20
**Goal:** Rename the "Growth Hacker" class to "Product Engineer", represent the last six months of product/agentic engineering across the character sheet (secondary, not dominant), add a new "The Forge" campaign, and replace the alignment margin note.

## Decisions (user-approved)

- **Class:** rename `Growth Hacker` → `Product Engineer`, **hybrid** (building-led, retain 2 growth/experiment bullets). Level stays 7.
- **Title:** `personal.title` `Founder & AI Executive` → `Founder · Product Engineer`.
- **Reach:** light touch **plus** new Actions, Bonus Action, Spells, Tools referencing real builds.
- **Margin note:** → `← allergic to rules, not to plans —B`.
- **Campaign name:** **The Forge**. **Vouch:** keep Arjé Cahn's on the class.
- **Links:** reference real live URLs where they resolve; GitHub repo otherwise.

## Architecture notes (why edits land where they do)

- `index.html` header (name / class line / alignment / margin note) + `<title>` + meta are **static HTML**.
- Sheet-body tabs (skills, actions, spells, features, inventory, background, notes, extras) are **data-driven** from `js/data.js` via `js/render.js` → data edits render automatically.
- Class click-overlay reads `characterData.classes.find(c => c.id === classKey)` where `classKey` = `data-class` attr → rename the id **and** the one `data-class` reference.
- **`campaignsData` in `data.js` is unused** (no JS reads it). The campaigns page is **static** (`campaigns.html`) → The Forge is authored there. (Also update the `campaignsData` object for record parity.)

## Change set

### 1. Class rename → Product Engineer (`index.html` + `js/data.js`)
- `index.html:6` `<title>` … `/ Growth Hacker 2` → `/ Product Engineer 2`
- `index.html:7` meta description: `Founder & AI Executive` → `Founder · Product Engineer`
- `index.html:81` `data-class="growth-hacker"` → `data-class="product-engineer"`, text `Growth Hacker 2` → `Product Engineer 2`
- `js/data.js` class object: `id: product-engineer`, `name: Product Engineer`, `primaryAbility: INT/CHA`
  - description: "Hands-on builders who turn ideas into shipped software. Prototype, ship, and iterate fast — increasingly by directing AI agents to build alongside them."
  - dndStyle: "INT/CHA hybrid. Specializes in rapid prototyping, full-stack shipping, and directing AI agents to build production software solo."
  - features: Lv1 **Rapid Prototyping** ("idea → working, deployed prototype in days, not quarters"); Lv2 **Subclass: Agent Wrangler** ("direct AI coding agents to build, test and ship alongside you")
  - evidence (4 building + 2 growth):
    1. "Shipped 15+ products in six months — AI-native web apps, native macOS/iOS (Swift), and CLI tools"
    2. "Built agentic software — two production WhatsApp agents (a paid-client shift-filler; a personal read-only assistant), a voice interrogation game with out-of-model state, a Claude Code plan-conflict CLI"
    3. "Full-stack across TypeScript, React/Next, Vite, Supabase and Python"
    4. "Directs AI coding agents to build, test and ship production software"
    5. *(growth)* "Ran dozens of experiments to validate what works — data over opinions"
    6. *(growth)* "€45M in AI engineering crowdsourced for impact through experiment-driven growth (FruitPunch)"
  - vouch: keep Arjé Cahn.

### 2. Title (`js/data.js:11`)
`personal.title` → `Founder · Product Engineer`.

### 3. Woven touches (all `js/data.js`, except 3h)
- **3a Arcana skill:** add evidence "Shipped 15+ full-stack & AI apps in six months (React/Next, Swift, Python)"; cvMeaning → "AI/ML & Product Engineering".
- **3b INT ability:** add evidence "Ships production software solo — 15+ projects in six months"; cvDescription gains "hands-on product engineering."
- **3c features.classFeatures:** update `Experiment-Driven` source `Growth Hacker`→`Product Engineer`; add **Ship Velocity** (source Product Engineer) + **Agent Wrangler** (source Product Engineer).
- **3d proficiencies.tools:** add `TypeScript / React / Next.js`, `Swift`, `Supabase`, `Claude Code (agentic dev)`.
- **3e Action:** **Ship a Prototype** — "Turn a raw idea into a working, deployed prototype." · at will · "idea → shipped product in days".
- **3f Bonus Action:** **Summon Agent** — "Direct an AI coding agent to build, test or refactor alongside you." · at will · "an AI agent builds alongside you".
- **3g Spells:** Lv1 **Find Familiar** (dndEquivalent Find Familiar) → "Summon an AI agent familiar that builds, tests and ships alongside you." / cvMeaning "agentic development"; Lv3 **Fabricate** (dndEquivalent Fabricate) → "Convert raw materials — an idea and a weekend — into finished, deployed software." / cvMeaning "idea → shipped product".
- **3h overlay `js/overlay.js:444`:** "Product & Growth roles — Product Owner or Growth role…" → include **Product Engineer**.

### 4. The Forge campaign (`campaigns.html`, new Campaign 1, `expanded`; + `campaignsData` parity)
- Header: initial `⚒` (verify render; fallback letter); title **The Forge**; meta `2026 – Present · Ongoing · Independent`; chip `◆ In Progress` (no `success`).
- Summary: "After the FruitPunch exit, I went heads-down building — 15+ products in six months, from AI-native apps and agentic tools to native and web. The through-line: learning to ship production software solo by directing AI agents."
- Party Members chips: Claude Code · Next.js · Supabase · Swift · TypeScript · Vercel
- Adventures (project = milestone; **name links** to live URL preferred, else GitHub; ✦ = notable):
  - **Agentic Systems:** ✦ GastroExclusive (repo) · ✦ jdog (repo) · file-tracker (repo)
  - **AI Apps:** ✦ casefile (repo) · tarot-card-reader (https://tarotread.help) · pawnshop (repo)
  - **Full-Stack & Native:** Weemoed (repo) · ClaudeUsageBar (repo) · Workout (repo)
  - **Civic & Experiments:** ✦ mpoftheweek (https://mpoftheweek.com) · hush (https://busterfranken.github.io/hush/) · kafka-form (https://busterfranken.github.io/kafka-form/) · CRPG (repo)

### 5. Margin note (`index.html:87`)
`← "chaotic" is generous —B` → `← allergic to rules, not to plans —B`

### 6. CSS (`css/campaigns.css`)
Add `.milestone-name a { color: var(--oxblood); text-decoration: none; border-bottom: 1px solid var(--gold); }` + `:hover { color: var(--red-hover); }` so project links stay on-theme.

## Verified live links (HTTP 200)
tarotread.help · mpoftheweek.com · busterfranken.github.io/hush/ · busterfranken.github.io/kafka-form/. All others → `github.com/BusterFranken/<repo>`.

## Out of scope
- Navbar active campaign stays `Energy Hardtech Exploration` (unchanged).
- No commit/push/deploy without explicit go (push = deploy on this repo).
