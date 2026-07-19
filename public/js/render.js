/* ============================================
   RENDER - Dynamic Content Rendering
   ============================================ */

// Short quest blurbs, keyed by project.link (stable across the occasional
// title rewording — a couple of prototype card titles are shortened
// versions of data.js's `name`, so matching on link is unambiguous).
// Verbatim from the prototype (localhost:8098 .../Projects.dc.html) for the
// handful of projects it explicitly mocks up; condensed from that project's
// own real page's <meta name="description"> for the rest (the prototype
// only shows 7 of the 24 real projects, captioned "...and 40+ more quests in
// the guild archive" — a partial preview, not the full data set). One
// deviation from the prototype's own text: its "AI Against Oil Spills" card
// (matched here by link) says "satellite imagery"; the real post it links to
// is about drone-based cleanup, not satellite detection, so that one line
// was re-derived from the real source instead of copied verbatim. See
// task-9-report.md.
const projectBlurbs = {
  '/fruitpunch/blog/ai-powered-wildlife-conservation-in-africa/': "Autonomous drones with thermal cameras detecting poachers in South Africa's reserves.",
  '/fruitpunch/blog/listening-to-the-giants-protecting-forest-elephants-through-audio-monitoring/': 'Acoustic monitoring models that hear forest elephants — and poachers — in rainforest audio.',
  '/fruitpunch/blog/tracking-turtles-how-ai-helps-conservationists-to-re-identify-sea-turtles/': 'Computer vision that identifies and tracks sea turtles across survey footage.',
  '/fruitpunch/blog/the-bear-necessity-of-ai-in-conservation/': 'Advanced computer vision for monitoring and identifying bears in the wild.',
  '/fruitpunch/blog/flying-high-with-ai-counting-pelican-breeding-pairs-in-the-danube-delta/': 'Computer vision models count pelican breeding pairs from aerial photographs of the Danube Delta.',
  '/fruitpunch/blog/from-pixels-to-preservation-how-ai-gives-rise-to-a-birdwatching-revolution/': 'A machine-learning pipeline built with SLU to assess eagle behavior, species and age.',
  '/fruitpunch/blog/understanding-seals-with-ai/': 'Improving the SealNet facial-recognition model for studying and monitoring marine mammals.',
  '/fruitpunch/blog/solving-automated-wildlife-taxonomy-with-ai/': 'An AI solution to analyze the flood of data captured by camera traps across European wildlife reserves.',
  '/fruitpunch/blog/model-optimization-and-pruning-of-poacher-detecting-yolov5/': 'Optimizing a YOLOv5 model for NVIDIA Jetson Nano to boost inference speed and cut memory footprint.',
  '/fruitpunch/challenges/ai-for-coral-reefs/': 'Reef-health mapping with Indonesian marine biologists — later an accredited TU/e course.',
  '/fruitpunch/blog/how-we-detect-oil-spills/': 'Computer vision and segmentation help response-team drones clean up oil spills faster, using fewer chemicals.',
  '/fruitpunch/blog/ai-against-oil-spills-going-inland-to-clean-oil-spills-with-ai/': 'Calculating oil-spill volume with segmentation models like SAM and Mask-RCNN.',
  '/fruitpunch/blog/ai-based-early-warning-system-for-river-floods/': 'Forecasting flash floods with LSTM, ARIMA and Prophet on hydrological sensor data from French rivers.',
  '/fruitpunch/blog/the-pains-of-classifying-flooded-forests-in-satellite-data/': 'Training CNNs on satellite infrared bands to detect flooded forests — a deceptively tricky use case.',
  '/fruitpunch/blog/can-ai-track-reforestation-projects-using-drone-and-satellite-data/': 'Satellite and drone data monitor tree coverage of re-greening projects in Tanzania and Kenya.',
  '/fruitpunch/blog/how-to-use-vehicle-sensors-to-make-cities-more-sustainable/': 'Vegetation monitoring and traffic-density detection to help make cities greener.',
  '/fruitpunch/blog/leveraging-large-language-models-to-make-businesses-around-the-world-more-sustainable/': 'NLP models classify product descriptions to estimate their environmental impact.',
  '/fruitpunch/blog/can-ai-detect-heart-failure-from-electrocardiograms/': 'Can AI detect heart failure from electrocardiograms? With European medical centers.',
  '/fruitpunch/blog/how-we-applied-ai-to-prevent-sepsis-in-preterm-babies/': 'XGBoost time-series forecasting predicts sepsis onset in preterm infants up to 12 hours early.',
  '/fruitpunch/blog/prioritizing-essential-care-with-ai/': 'Advancing neonatal care: how IMPALA and AI improve early diagnosis and treatment.',
  '/fruitpunch/blog/autonomous-flight-and-the-landing-of-a-fixed-wing-uav/': 'Autonomous UAV landing compared across GPS-beacon guidance and reinforcement learning.',
  '/fruitpunch/blog/user-friendly-wilderness-proof-mlops/': 'A CI/CD pipeline that auto-retrains and redeploys the poacher-detecting model straight to the drone.',
  '/fruitpunch/blog/ai-and-visualisations-a-data-driven-all-rounded-approach-for-road-safety/': 'Uncovering accident triggers through exploratory data analysis of a collision-avoidance dataset.',
  '/fruitpunch/blog/fruitpunch-ai-2-0-community-driven/': "The next step toward a community of 1M people willing and able to solve humanity's greatest challenges by 2030."
};

// Render Projects Grid
function renderProjects() {
  const projectsGrid = document.getElementById('projectsGrid');
  if (!projectsGrid || typeof aiForGoodProjects === 'undefined') return;

  // Map category names to filter categories
  const categoryMap = {
    'Wildlife': 'wildlife',
    'Earth': 'earth',
    'Health': 'health',
    'Autonomous': 'autonomous',
    'MLOps': 'mlops',
    'Safety': 'safety',
    'Community': 'community'
  };

  projectsGrid.innerHTML = aiForGoodProjects.map(project => {
    const filterCategory = categoryMap[project.category] || 'other';
    const linkPath = project.link.startsWith('/') ? project.link.substring(1) : project.link;
    const fullLink = linkPath.endsWith('/') ? linkPath + 'index.html' : linkPath;
    const blurb = projectBlurbs[project.link] || 'An AI for Good initiative delivered through FruitPunch AI.';

    return `
      <article class="section-box project-card" data-category="${filterCategory}">
        <div class="project-image">
          <img src="${project.image}" alt="${project.name}" class="project-banner" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="project-emoji" style="display:none;">${getCategoryEmoji(project.category)}</div>
        </div>
        <div class="project-content">
          <span class="project-category">${project.category}</span>
          <h3 class="project-title">${project.name}</h3>
          <p class="project-desc">${blurb}</p>
          <a href="${fullLink}" class="project-link">View quest details →</a>
        </div>
      </article>
    `;
  }).join('');
}

// Helper function to get glyph for category (image onerror fallback)
function getCategoryEmoji(category) {
  const glyphMap = {
    'Wildlife': '✦',
    'Earth': '❖',
    'Health': '◆',
    'Autonomous': '◇',
    'MLOps': '✦',
    'Safety': '❖',
    'Community': '◆'
  };
  return glyphMap[category] || '❖';
}

// Render Skills List
function renderSkills() {
  const skillsList = document.getElementById('skillsList');
  if (!skillsList) return;

  skillsList.innerHTML = (characterData.skills || []).map(skill => {
    const skillKey = (skill.name || '').toLowerCase().replace(/\s+/g, '');
    const mod = skill.modifier != null ? skill.modifier : 0;

    return `
      <div class="skill-item ${skill.proficient ? 'proficient' : ''} clickable" data-skill="${skillKey}">
        <span class="proficiency-marker ${skill.expertise ? 'expertise' : skill.proficient ? 'filled' : ''}"></span>
        <span class="skill-abbr">${(skill.ability || '').toUpperCase()}</span>
        <span class="skill-name">${skill.name || ''}</span>
        <span class="skill-mod rollable" data-mod="${mod}" data-skill="${skill.name}">${mod >= 0 ? '+' : ''}${mod}</span>
      </div>`;
  }).join('');
}

// Render Actions
function renderActions() {
  const actionsList = document.getElementById('actionsList');
  if (!actionsList) return;
  
  const actionsByType = {
    'Attack': [],
    'Action': [],
    'Bonus Action': [],
    'Reaction': []
  };
  
  (characterData.actions || []).forEach(action => {
    const type = action.type;
    if (actionsByType[type]) {
      actionsByType[type].push(action);
    }
  });
  
  // Category header: "✦ Label" text, a flexible gold divider, and (Attacks only) the
  // "click to-hit to roll" hint — all as explicit DOM children so the hint can sit after
  // the divider, matching the prototype's structure (finding 8: hint attaches to the
  // Attacks header specifically, not the whole tab).
  const categoryTitle = (label, hint) =>
    `<div class="action-category-title">✦ ${label}<span class="category-divider"></span>${hint ? `<span class="category-hint">${hint}</span>` : ''}</div>`;

  let html = '';

  // Attacks first
  if (actionsByType['Attack'].length) {
    html += `<div class="action-category">${categoryTitle('Attacks', 'click to-hit to roll')}`;
    html += actionsByType['Attack'].map(action => renderActionItem(action)).join('');
    html += '</div>';
  }

  // Actions
  if (actionsByType['Action'].length) {
    html += `<div class="action-category">${categoryTitle('Actions')}`;
    html += actionsByType['Action'].map(action => renderActionItem(action)).join('');
    html += '</div>';
  }

  // Bonus Actions
  if (actionsByType['Bonus Action'].length) {
    html += `<div class="action-category">${categoryTitle('Bonus Actions')}`;
    html += actionsByType['Bonus Action'].map(action => renderActionItem(action)).join('');
    html += '</div>';
  }

  // Reactions
  if (actionsByType['Reaction'].length) {
    html += `<div class="action-category">${categoryTitle('Reactions')}`;
    html += actionsByType['Reaction'].map(action => renderActionItem(action)).join('');
    html += '</div>';
  }

  actionsList.innerHTML = html;
}

function renderActionItem(action) {
  // Branch guard: sanitize generated-data field values ("/", "N/A", "none" → empty)
  function _v(v) { const s = v == null ? '' : String(v).trim(); return (s === '' || s === '/' || s === 'N/A' || s === 'null' || s === 'none') ? '' : s; }
  const hasAttack = action.attackBonus != null;
  const hasDamage = _v(action.damage) !== '' && _v(action.damageType) !== '';
  const tags = (action.properties || []).map(p => p.toLowerCase()).join(' · ');

  return `
    <div class="action-item clickable${hasAttack ? ' attack' : ''}" data-action="${action.name}">
      <span class="action-name">${action.name}</span>
      ${tags ? `<span class="action-tags">${tags}</span>` : ''}
      ${!hasAttack ? `<div class="action-effect">${_v(action.effect) || _v(action.description) || ''}</div>` : ''}
      ${hasAttack ? `
        <span class="action-attack rollable" data-mod="${action.attackBonus}" data-skill="${action.name}">+${action.attackBonus} to hit</span>
        ${hasDamage ? `<span class="action-damage">${_v(action.damage)} ${_v(action.damageType)}</span>` : ''}
      ` : `<span class="action-type">${_v(action.uses)}</span>`}
    </div>
  `;
}

// Render Spells
function renderSpells() {
  const spellsList = document.getElementById('spellsList');
  if (!spellsList) return;

  const spells = characterData.spells;
  if (!spells) return;

  // Flat list, no level-group headers (finding 3): each row is name + a descriptive
  // blurb (existing cvMeaning field, copy-synced to the prototype) + a level-badge
  // column ("Cantrip" / "1st ·4" style). ordinal labels are structural, not copy.
  const groups = [
    { ordinal: null, list: spells.cantrips },
    { ordinal: '1st', list: spells.level1 },
    { ordinal: '2nd', list: spells.level2 },
    { ordinal: '3rd', list: spells.level3 }
  ];

  let html = '';
  groups.forEach(group => {
    (group.list || []).forEach(spell => {
      // Generated sheets may lack slots — badge degrades to the bare ordinal.
      const badge = group.ordinal ? (spell.slots != null ? `${group.ordinal} ·${spell.slots}` : group.ordinal) : 'Cantrip';
      // spell.featured (optional flag, data.js) → oxblood badge + name, matching the
      // prototype's one highlighted spell ("Recruit"). .spell-item's own contract
      // (clickable, data-spell) is unchanged; this only appends a modifier class.
      // Generated sheets may lack cvMeaning — fall back to castTime • range.
      const meta = spell.cvMeaning || [spell.castTime, spell.range].filter(Boolean).join(' • ');
      html += `
        <div class="spell-item clickable${spell.featured ? ' spell-item--featured' : ''}" data-spell="${spell.name}">
          <span class="spell-level-badge">${badge}</span>
          <span class="spell-name">${spell.name}</span>
          <span class="spell-meta">${meta}</span>
        </div>
      `;
    });
  });

  // Branch fallback: sheet with no spells at all
  if (!html) {
    html = '<div class="no-spells">No spells known</div>';
  }

  spellsList.innerHTML = html;
}

// Render Inventory
function renderInventory() {
  const inventoryList = document.getElementById('inventoryList');
  if (!inventoryList) return;
  
  // qty fuses into the name string (e.g. "Customer Interview Notes ×500") — no separate
  // flex-ordered qty element (finding 4); row order is name, notes, value, per prototype.
  inventoryList.innerHTML = (characterData.inventory || []).map(item => `
    <div class="inventory-item clickable" data-item="${item.name}">
      <span class="inventory-active ${item.active ? 'equipped' : ''}"></span>
      <span class="inventory-name">${item.name || ''}${item.qty > 1 ? ` ×${item.qty}` : ''}</span>
      <span class="inventory-notes">${item.notes || ''}</span>
      <span class="inventory-value">${item.value || ''}</span>
    </div>
  `).join('');
}

// Render Features
function renderFeatures() {
  const featuresList = document.getElementById('featuresList');
  if (!featuresList) return;

  const features = characterData.features || {};
  // Background Feature folds into the SAME "Class Features" list (no second header),
  // distinguished only by its oxblood name color (finding 2). Identity (`===`) picks
  // out that one entry after the arrays are combined. Generated sheets may lack
  // either array — both spreads guarded.
  const allClassFeatures = [...(features.classFeatures || []), ...(features.backgroundFeature ? [features.backgroundFeature] : [])];

  // Each feature is ONE inline line: "Name — Source · Description" (.feature-source and
  // .feature-desc are both `display:inline` and CSS-prepend their own "— "/" · " glyphs).
  const classFeaturesHtml = allClassFeatures.map(f => {
    const isBackgroundFeature = f === features.backgroundFeature;
    return `
        <div class="feature-item clickable" data-feature="${f.name}"><span class="feature-name${isBackgroundFeature ? ' feature-name--highlight' : ''}">${f.name || ''}</span>${f.source ? `<span class="feature-source">${f.source}</span>` : ''}${f.description ? `<span class="feature-desc">${f.description}</span>` : ''}</div>
      `;
  }).join('');

  // Achievements: curated to the items carrying the optional `rarity` field (Legendary/
  // Epic tier), rendered as a badge pill + name + optional short description — matches
  // the prototype's 3-item curated subset while the full 8-item list stays in data.js.
  const achievementsHtml = (features.achievements || []).filter(a => a.rarity).map(a => `
        <div class="feature-item clickable" data-feature="${a.name}">${a.rarity ? `<span class="feature-badge feature-badge--${a.rarity.toLowerCase()}">${a.rarity}</span>` : ''} <span class="feature-name">${a.name}</span>${a.description ? `<span class="feature-source">${a.description}</span>` : ''}</div>
      `).join('');

  featuresList.innerHTML = `
    ${classFeaturesHtml ? `
    <div class="feature-category">
      <div class="feature-category-title">✦ Class Features</div>
      ${classFeaturesHtml}
    </div>` : ''}

    ${achievementsHtml ? `
    <div class="feature-category">
      <div class="feature-category-title">✦ Achievements</div>
      ${achievementsHtml}
    </div>` : ''}
  `;
}

// Render Background
function renderBackground() {
  const backgroundContent = document.getElementById('backgroundContent');
  if (!backgroundContent) return;

  const bg = characterData.background || {};
  const chars = bg.characteristics || {};

  // Ideals: only the entries carrying the optional `featured` rank are joined into the
  // single "Ideals" characteristics line (curated + ordered per the prototype); the
  // un-featured Interdependence ideal stays in data.js, untouched. Generated sheets
  // usually carry no `featured` flags — those fall back to all ideals.
  const idealsList = bg.ideals || [];
  const pickedIdeals = idealsList.some(i => i.featured)
    ? idealsList.filter(i => i.featured).sort((a, b) => a.featured - b.featured)
    : idealsList;
  const featuredIdeals = pickedIdeals
    .map(i => `${i.name || ''}${i.description ? ` — ${i.description.charAt(0).toLowerCase()}${i.description.slice(1)}` : ''}`)
    .join(' ');

  // Exactly 2 sections (finding 5): "Origin Story" (one flowing narrative paragraph —
  // backgroundStory, now the merged prototype copy) and "Characteristics" (5 single
  // curated label:value lines — first entry of each traits array, per existing order).
  // Each characteristics line renders only when its data exists (generated
  // sheets may lack any of them); owner data carries all five.
  const traitLines = [
    (bg.personalityTraits && bg.personalityTraits[0]) ? `<div class="trait-item"><span class="trait-label">Personality </span><em>"${bg.personalityTraits[0]}"</em></div>` : '',
    featuredIdeals ? `<div class="trait-item"><span class="trait-label">Ideals </span><em>${featuredIdeals}</em></div>` : '',
    (bg.bonds && bg.bonds[0]) ? `<div class="trait-item"><span class="trait-label">Bond </span><em>${bg.bonds[0]}</em></div>` : '',
    (bg.flaws && bg.flaws[0]) ? `<div class="trait-item"><span class="trait-label">Flaw </span><em>${bg.flaws[0]}</em></div>` : '',
    chars.faith ? `<div class="trait-item"><span class="trait-label">Faith </span><em>${chars.faith}</em></div>` : ''
  ].filter(Boolean).join('\n      ');

  backgroundContent.innerHTML = `
    ${chars.backgroundStory ? `
    <div class="background-section">
      <div class="background-section-title">✦ Origin Story</div>
      <div class="trait-item origin-story">${chars.backgroundStory}</div>
    </div>` : ''}

    ${traitLines ? `
    <div class="background-section">
      <div class="background-section-title">✦ Characteristics</div>
      ${traitLines}
    </div>` : ''}
  `;
}

// Render Notes (Vouches & Organizations)
function renderNotes() {
  const notesContent = document.getElementById('notesContent');
  if (!notesContent) return;

  // Vouches may live top-level (redesign data.js) or be absent on generated
  // sheets; organizations without `featured` flags (generated) all show.
  const vouches = characterData.vouches || (characterData.notes && characterData.notes.vouches) || [];
  const allOrgs = characterData.organizations || [];
  const orgChips = allOrgs.some(o => o.featured) ? allOrgs.filter(o => o.featured) : allOrgs;

  notesContent.innerHTML = `
    ${vouches.length ? `
    <div class="background-section">
      <div class="background-section-title">✦ Vouches</div>
      ${vouches.map(v => `
        <div class="vouch-item">
          <div class="vouch-text">"${v.text || ''}"</div>
          <div class="vouch-author">${v.author || ''}</div>${v.role ? `<div class="vouch-role">${v.role}</div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${orgChips.length ? `
    <div class="background-section">
      <div class="background-section-title">✦ Guilds & Orgs</div>
      <div class="org-chips">
        ${orgChips.map(o => `<span class="chip-tag">${o.name}</span>`).join('')}
      </div>
    </div>` : ''}
  `;
}

// Render Extras
function renderExtras() {
  const extrasContent = document.getElementById('extrasContent');
  if (!extrasContent) return;

  const extras = characterData.extras || {};
  const personal = characterData.personal || {};
  const funFacts = extras.funFacts || [];
  const interests = extras.interests || [];
  const isDefaultData = window.__appDataSource === 'default';
  const campaignName = personal.currentCampaignName || personal.currentCampaign || '';

  // "✦ Current Campaign" highlighted block + two CTA buttons come BEFORE the Fun
  // Facts/Interests content (finding 7). Fun Facts/Interests keep their own explicit
  // modifier classes (not :nth-of-type) so inserting this block ahead of them can't
  // shift which one gets bullets vs. chip styling. Both sections are wrapped in
  // .extras-columns, matching the prototype's 2-col grid DOM structure exactly.
  // Campaign block, CTA row and both columns are all conditional so generated
  // sheets missing any field never print "undefined". The Classic-CV download
  // is the owner's PDF — offered on the default page only.
  extrasContent.innerHTML = `
    ${campaignName ? `
    <div class="extras-campaign">
      <div class="extras-title">✦ Current Campaign</div>
      <div class="campaign-card">
        <div class="campaign-card-name">${campaignName}</div>
        ${(personal.currentCampaignName && personal.currentCampaign) || personal.currentStatus ? `<div class="campaign-card-desc">${personal.currentCampaignName && personal.currentCampaign ? personal.currentCampaign + ' ' : ''}${personal.currentStatus ? `Status: <span class="campaign-card-status">${personal.currentStatus}</span>` : ''}</div>` : ''}
      </div>
      ${personal.email || isDefaultData ? `
      <div class="extras-cta-row">
        ${personal.email ? `<a href="mailto:${personal.email}?subject=New Quest Inquiry" class="extras-cta-btn extras-cta-btn--solid">✦ Start a Quest</a>` : ''}
        ${isDefaultData ? `<a href="Resume-Buster-short.pdf" target="_blank" class="extras-cta-btn extras-cta-btn--outline">❖ Download Classic CV</a>` : ''}
      </div>` : ''}
    </div>` : ''}

    <div class="extras-columns">
      ${funFacts.length ? `
      <div class="extras-section extras-section--facts">
        <div class="extras-title">Fun Facts</div>
        <div class="extras-list">
          ${funFacts.map(f => `<span class="extras-item">${f}</span>`).join('')}
        </div>
      </div>` : ''}

      ${interests.length ? `
      <div class="extras-section extras-section--interests">
        <div class="extras-title">Interests</div>
        <div class="extras-list">
          ${interests.map(i => `<span class="extras-item">${i}</span>`).join('')}
        </div>
      </div>` : ''}
    </div>
  `;
}

// Render Classic CV View — fully dynamic from characterData + campaignsData
// Only rendered for default (Buster's) page, not generated pages
function renderClassicCV() {
  // Skip for generated pages - Classic CV is only for Buster's page
  if (window.__appDataSource !== 'default') return;
  
  const container = document.getElementById('classicCvContainer');
  if (!container) return;
  
  const data = characterData;
  if (!data || !data.personal) return;

  // Build contact links dynamically
  const contactParts = [];
  if (data.personal.email) contactParts.push(`<a href="mailto:${data.personal.email}">${data.personal.email}</a>`);
  if (data.personal.phone) contactParts.push(`<a href="tel:${data.personal.phone}">${data.personal.phone}</a>`);
  if (data.personal.linkedin) contactParts.push(`<a href="${data.personal.linkedin}" target="_blank">LinkedIn</a>`);
  if (data.personal.github) contactParts.push(`<a href="${data.personal.github}" target="_blank">GitHub</a>`);
  if (data.personal.location) contactParts.push(`<span>${data.personal.location}</span>`);

  // Build skills section from characterData.skills
  const proficientSkills = (data.skills || []).filter(s => s.proficient || s.expertise);
  const toolsAndLangs = (data.proficiencies && data.proficiencies.tools) || [];

  container.innerHTML = `
    <header class="classic-header">
      <h1 class="classic-name">${data.personal.name}</h1>
      <div class="classic-title">${data.personal.title}</div>
      <div class="classic-contact">
        ${contactParts.join('<span>•</span>')}
      </div>
    </header>
    
    <section class="classic-section">
      <h2 class="classic-section-title">Summary</h2>
      <p class="classic-summary">${data.personal.summary}</p>
    </section>
    
    <section class="classic-section">
      <h2 class="classic-section-title">Work Experience</h2>
      ${renderClassicExperience()}
    </section>
    
    <section class="classic-section">
      <h2 class="classic-section-title">Skills</h2>
      <div class="classic-skills-grid">
        ${proficientSkills.length ? `
          <div class="classic-skill-category">
            <div class="classic-skill-category-title">Key Proficiencies</div>
            <div class="classic-skill-list">${proficientSkills.map(s => s.cvMeaning || s.name).join(', ')}</div>
          </div>
        ` : ''}
        ${toolsAndLangs.length ? `
          <div class="classic-skill-category">
            <div class="classic-skill-category-title">Tools & Technologies</div>
            <div class="classic-skill-list">${toolsAndLangs.join(', ')}</div>
          </div>
        ` : ''}
      </div>
    </section>
    
    ${(data.vouches && data.vouches.length) ? `
      <section class="classic-section">
        <h2 class="classic-section-title">Testimonials</h2>
        ${data.vouches.map(v => `
          <div class="classic-testimonial">
            <div class="classic-testimonial-text">"${v.text}"</div>
            <div class="classic-testimonial-author">– ${v.author}, ${v.role}</div>
          </div>
        `).join('')}
      </section>
    ` : ''}
    
    ${(data.proficiencies && data.proficiencies.languages && data.proficiencies.languages.length) ? `
      <section class="classic-section">
        <h2 class="classic-section-title">Languages</h2>
        <div class="classic-languages">
          ${data.proficiencies.languages.map(l => `
            <div class="classic-language">
              <span class="classic-language-name">${(l.native && l.native.length > 3) ? l.native : l.name}</span>
              <span class="classic-language-level">(${l.proficiency})</span>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}
  `;
}

// Render work experience from campaignsData (dynamic)
function renderClassicExperience() {
  const campaigns = typeof campaignsData !== 'undefined' ? campaignsData : [];
  if (!campaigns.length) return '<p>No work experience data available.</p>';

  let html = '';
  campaigns.forEach(campaign => {
    // Each adventure within a campaign is a specific role/job
    if (campaign.adventures && campaign.adventures.length) {
      campaign.adventures.forEach(adv => {
        const achievements = (adv.encounters || []).map(enc => enc.description);
        html += `
          <div class="classic-experience-item">
            <div class="classic-exp-header">
              <div>
                <div class="classic-exp-title">${adv.role || adv.name}</div>
                <div class="classic-exp-company">${adv.organization || campaign.name}</div>
              </div>
              <div>
                <div class="classic-exp-dates">${adv.dates}</div>
              </div>
            </div>
            <div class="classic-exp-description">${adv.summary}</div>
            ${achievements.length ? `
              <ul class="classic-exp-achievements">
                ${achievements.map(a => `<li>${a}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `;
      });
    } else {
      // Campaign without adventures — show the campaign itself
      html += `
        <div class="classic-experience-item">
          <div class="classic-exp-header">
            <div>
              <div class="classic-exp-title">${campaign.name}</div>
            </div>
            <div>
              <div class="classic-exp-dates">${campaign.dates}</div>
              <div class="classic-exp-location">${campaign.duration}</div>
            </div>
          </div>
          <div class="classic-exp-description">${campaign.summary}</div>
        </div>
      `;
    }
  });
  return html;
}

// Initialize all renders
function initRender() {
  renderSkills();
  renderActions();
  renderSpells();
  renderInventory();
  renderFeatures();
  renderBackground();
  renderNotes();
  renderExtras();
  renderClassicCV();
}

// ============================================
// CAMPAIGNS PAGE — Render from campaignsData + sideQuests
// ============================================
function renderCampaignsPage() {
  const container = document.getElementById('campaignsContainer');
  if (!container) return;
  if (typeof campaignsData === 'undefined' || !campaignsData.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--body-ink);padding:40px;">No campaigns data available.</p>';
    return;
  }

  const sq = typeof sideQuests !== 'undefined' ? sideQuests : [];
  const isURL = v => v && /^https?:\/\/.{4}/.test(v);
  // Placeholder filter — generated sheets use "/" for absent values.
  const pv = v => {
    if (v == null) return '';
    const t = String(v).trim();
    return (t === '' || t === '/' || t === 'N/A' || t === 'null' || t === 'none') ? '' : t;
  };

  let html = '';

  // Main campaigns — redesign .campaign-card structure (initial tile, meta
  // line, status chip, chip-row party members, .adventure/.milestone lists).
  campaignsData.forEach((campaign, idx) => {
    const expanded = idx === 0;
    const initial = String(pv(campaign.name) || '?').trim().charAt(0).toUpperCase();
    const meta = [pv(campaign.dates), pv(campaign.duration)].filter(Boolean).join(' · ');
    const outcome = pv(campaign.outcome);
    const chip = outcome
      ? `<span class="campaign-status-chip success">✓ ${outcome}</span>`
      : '';
    const partners = campaign.partners && campaign.partners.length
      ? `<div class="chip-row"><span class="chip-row-label">Party Members</span>${campaign.partners.map(p => `<span class="chip-tag">${p}</span>`).join('')}</div>`
      : '';

    let adventuresHtml = '';
    if (campaign.adventures && campaign.adventures.length) {
      adventuresHtml = '<div class="adventures-list">' + campaign.adventures.map(adv => {
        const roleOrg = [pv(adv.role), pv(adv.organization)].filter(Boolean).join(' at ');
        let milestones = '';
        if (adv.encounters && adv.encounters.length) {
          milestones = '<div class="milestones">' + adv.encounters.map(enc => {
            const cls = enc.notable ? ' milestone--notable' : '';
            const icon = enc.notable ? '✦' : '◆';
            const link = isURL(enc.link) ? ` <a href="${enc.link}" target="_blank" class="milestone-link">read more →</a>` : '';
            return `<div class="milestone${cls}"><span class="milestone-icon">${icon}</span> <span class="milestone-name">${enc.name || ''}</span>${enc.description ? ' — ' + enc.description : ''}${link}</div>`;
          }).join('') + '</div>';
        }
        return `
          <div class="adventure">
            <div class="adventure-head">
              <span class="adventure-title">${adv.name ? 'Adventure: ' + adv.name : 'Adventure'}</span>
              ${adv.dates ? `<span class="adventure-dates">${adv.dates}</span>` : ''}
            </div>
            ${roleOrg ? `<div class="adventure-summary">${roleOrg}</div>` : ''}
            ${adv.summary ? `<div class="adventure-summary">${adv.summary}</div>` : ''}
            ${milestones}
          </div>`;
      }).join('') + '</div>';
    }

    html += `
      <section class="campaign-card${expanded ? ' expanded' : ''}" data-campaign="${campaign.id || idx}">
        <div class="campaign-header">
          <div class="campaign-initial">${initial}</div>
          <div class="campaign-info">
            <h2 class="campaign-title">${campaign.name || ''}</h2>
            ${meta ? `<div class="campaign-meta">${meta}</div>` : ''}
          </div>
          ${chip}
          <button class="campaign-toggle">${expanded ? '▾' : '▸'}</button>
        </div>
        <div class="campaign-body"${expanded ? '' : ' style="display: none;"'}>
          ${campaign.summary ? `<p class="campaign-summary">${campaign.summary}</p>` : ''}
          ${partners}
          ${adventuresHtml}
        </div>
      </section>`;
  });

  // Side Quests — redesign .side-quests rail of .section-box cards.
  // Rendered as a SIBLING after the container (matching the static page's
  // structure — .side-quests carries its own outer padding).
  let sqHtml = '';
  if (sq.length) {
    sqHtml = `
      <section class="side-quests">
        <h2 class="section-title">Side Quests</h2>
        <p class="side-quests-sub">Volunteer &amp; board positions<span class="side-quests-hint"> — swipe</span></p>
        <div class="side-quests-rail">
          <div class="side-quests-grid">
            ${sq.map(s => `
              <div class="section-box">
                <div class="sq-name">${s.name || ''}</div>
                ${[s.role, s.dates].filter(Boolean).length ? `<div class="sq-meta">${[s.role, s.dates].filter(Boolean).join(' · ')}</div>` : ''}
                ${s.description ? `<p class="sq-desc">${s.description}</p>` : ''}
                ${isURL(s.url) ? `<a href="${s.url}" target="_blank" class="milestone-link">visit →</a>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </section>`;
  }

  // Replace the owner page's static side-quests section (it lives outside
  // the container) before injecting the generated sheet's own content.
  document.querySelectorAll('.campaigns-page .side-quests, .side-quests').forEach(el => el.remove());
  container.innerHTML = html;
  if (sqHtml) container.insertAdjacentHTML('afterend', sqHtml);

  // Toggle behavior — same pattern as the static site's inline script
  // (chevron swap + display toggle + .expanded class).
  container.querySelectorAll('.campaign-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.campaign-card');
      const body = card.querySelector('.campaign-body');
      const isExpanded = body.style.display !== 'none';
      body.style.display = isExpanded ? 'none' : 'block';
      btn.textContent = isExpanded ? '▸' : '▾';
      card.classList.toggle('expanded', !isExpanded);
    });
  });
  container.querySelectorAll('.campaign-header').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.classList.contains('campaign-toggle')) return;
      header.querySelector('.campaign-toggle')?.click();
    });
    header.style.cursor = 'pointer';
  });
}

// ============================================
// NOTABLE PAGE — Render from notableAdventures + notableEncounters
// ============================================
function renderNotablePage() {
  const container = document.getElementById('notableContainer');
  if (!container) return;

  const adventures = typeof notableAdventures !== 'undefined' ? notableAdventures : [];
  const encounters = typeof notableEncounters !== 'undefined' ? notableEncounters : [];

  if (!adventures.length && !encounters.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--body-ink);padding:40px;">No notable achievements data available.</p>';
    return;
  }

  // Branch behavior kept: rarity assigned positionally (top entries most
  // prestigious). An explicit a.rarity field wins when the generated data
  // carries one; unknown values fall back to an unribboned card.
  function rarityOf(a, idx) {
    const r = String(a.rarity || '').toLowerCase();
    if (['legendary', 'epic', 'rare'].includes(r)) return r;
    if (a.rarity) return null; // unknown rarity value → no ribbon
    if (idx < 2) return 'legendary';
    if (idx < 5) return 'epic';
    return 'rare';
  }
  const isURL = v => v && /^https?:\/\/.{4}/.test(v);
  const pv = v => {
    if (v == null) return '';
    const t = String(v).trim();
    return (t === '' || t === '/' || t === 'N/A' || t === 'null' || t === 'none') ? '' : t;
  };
  const yearOf = d => {
    const clean = pv(d);
    const match = clean.match(/\d{4}/);
    return match ? match[0] : (clean || '—');
  };

  let html = '';

  // Notable Adventures — redesign .achievement-grid with ribbons.
  if (adventures.length) {
    html += `
      <section class="achievements">
        <h2 class="rule-title">Notable Adventures</h2>
        <div class="achievement-grid">
          ${adventures.map((a, i) => {
            const rarity = rarityOf(a, i);
            const linked = isURL(a.link);
            const aDate = pv(a.date);
            const aCat = pv(a.category);
            const stats = [
              aDate ? `<span>Date · <span class="achievement-stat-value">${aDate}</span></span>` : '',
              aCat ? `<span>Field · <span class="achievement-stat-value">${aCat}</span></span>` : '',
              linked ? `<a href="${a.link}" target="_blank" class="achievement-link">coverage →</a>` : ''
            ].filter(Boolean).join('');
            return `
              <article class="section-box achievement-card${rarity === 'legendary' ? ' achievement-card--legendary' : ''}">
                ${rarity ? `<span class="ribbon ribbon--${rarity}">${rarity.charAt(0).toUpperCase() + rarity.slice(1)}</span>` : ''}
                <h3 class="achievement-title">${a.name || ''}</h3>
                ${a.description ? `<p class="achievement-desc">${a.description}</p>` : ''}
                ${stats ? `<div class="achievement-stats${linked ? ' achievement-stats--linked' : ''}">${stats}</div>` : ''}
              </article>`;
          }).join('')}
        </div>
      </section>`;
  }

  // Key Encounters — redesign chronological .ledger.
  if (encounters.length) {
    html += `
      <section class="encounters">
        <h2 class="rule-title encounters-rule">Key Encounters</h2>
        <p class="encounters-sub">Pivotal moments that changed the trajectory.</p>
        <div class="ledger">
          ${encounters.map(e => `
            <div class="ledger-row">
              <span class="ledger-year">${yearOf(e.date)}</span>
              <span class="ledger-mark">◆</span>
              <span class="ledger-text"><strong>${e.name || ''}</strong>${e.description ? ' — ' + e.description : ''}</span>
            </div>
          `).join('')}
        </div>
      </section>`;
  }

  container.innerHTML = html;
}

// ============================================
// CONTACT PAGE — Render from characterData.personal + organizations
// ============================================
function renderContactPage() {
  const container = document.getElementById('contactContainer');
  if (!container || typeof characterData === 'undefined') return;

  const p = characterData.personal || {};
  const orgs = characterData.organizations || [];

  // Only show a contact field if it contains a real value (not a placeholder or "/")
  function isRealContact(v) {
    if (!v) return false;
    const s = String(v).trim().toLowerCase();
    return s !== '' && s !== '/' && s !== 'null' && s !== 'n/a' && s !== 'none' &&
      !s.startsWith('linkedin profile') && !s.startsWith('github profile') &&
      !s.startsWith('http://example') && !s.startsWith('https://example');
  }
  function isRealURL(v) {
    return isRealContact(v) && /^https?:\/\/.{4}/.test(v);
  }
  const bare = u => String(u).replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Contact Scrolls — redesign .scroll-card rows (email highlighted).
  let scrollCards = '';
  if (isRealContact(p.email)) scrollCards += `
    <a href="mailto:${p.email}" class="section-box scroll-card scroll-card--email">
      <span class="scroll-glyph-lg">✉</span>
      <span class="scroll-body">
        <span class="scroll-label"><span class="scroll-glyph-sm">✉</span> Email</span>
        <span class="scroll-value">${p.email}</span>
        <span class="scroll-note">Best for detailed inquiries</span>
      </span>
      <span class="scroll-arrow">→</span>
    </a>`;
  if (isRealContact(p.phone)) scrollCards += `
    <a href="tel:${String(p.phone).replace(/\s+/g, '')}" class="section-box scroll-card">
      <span class="scroll-glyph-lg">❖</span>
      <span class="scroll-body">
        <span class="scroll-label"><span class="scroll-glyph-sm">❖</span> Phone</span>
        <span class="scroll-value">${p.phone}</span>
        <span class="scroll-note">Voice &amp; messages</span>
      </span>
      <span class="scroll-arrow">→</span>
    </a>`;
  if (isRealURL(p.linkedin)) scrollCards += `
    <a href="${p.linkedin}" target="_blank" class="section-box scroll-card">
      <span class="scroll-glyph-lg">❖</span>
      <span class="scroll-body">
        <span class="scroll-label"><span class="scroll-glyph-sm">❖</span> LinkedIn</span>
        <span class="scroll-value">${bare(p.linkedin)}</span>
        <span class="scroll-note">Professional network</span>
      </span>
      <span class="scroll-arrow">→</span>
    </a>`;
  if (isRealURL(p.github)) scrollCards += `
    <a href="${p.github}" target="_blank" class="section-box scroll-card">
      <span class="scroll-glyph-lg">❖</span>
      <span class="scroll-body">
        <span class="scroll-label"><span class="scroll-glyph-sm">❖</span> GitHub</span>
        <span class="scroll-value">${bare(p.github)}</span>
        <span class="scroll-note">Code &amp; projects</span>
      </span>
      <span class="scroll-arrow">→</span>
    </a>`;

  // Home Base — redesign .location-card (status chip + campaign note inside).
  let homeBase = '';
  if (isRealContact(p.location) || p.currentStatus) {
    homeBase = `
      <section class="home-base">
        <h2 class="rule-title">Home Base</h2>
        <div class="section-box location-card">
          ${isRealContact(p.location) ? `<h3 class="location-city">${p.location}</h3>` : ''}
          ${isRealContact(p.address) ? `<p class="location-address">${p.address}</p>` : ''}
          ${p.currentStatus ? `<div class="location-status-row"><span class="status-chip">✦ ${p.currentStatus}</span></div>` : ''}
          ${p.currentCampaign ? `<p class="location-note">${p.currentCampaign}</p>` : ''}
        </div>
      </section>`;
  }

  // Guilds & Factions — organizations as redesign .guild-row entries.
  let guilds = '';
  if (orgs.length) {
    guilds = `
      <section class="guilds">
        <h2 class="rule-title guilds-rule">Guilds &amp; Factions</h2>
        <div class="guild-list">
          ${orgs.map(o => {
            const inner = `<span class="guild-name">${o.name || ''}</span><span class="guild-role">${o.role || ''}</span>`;
            return isRealURL(o.url)
              ? `<a href="${o.url}" target="_blank" class="guild-row">${inner}</a>`
              : `<div class="guild-row">${inner}</div>`;
          }).join('')}
        </div>
      </section>`;
  }

  // CTA — redesign .cta-panel (email-driven; only when a real email exists).
  const cta = isRealContact(p.email) ? `
    <section class="cta-panel">
      <h2 class="cta-title">Ready to Start a New Quest?</h2>
      ${p.currentStatus ? `<p class="cta-subtitle">${p.currentStatus}</p>` : ''}
      <div class="cta-buttons">
        <a href="mailto:${p.email}?subject=New Quest Inquiry" class="ov-roll-btn">✦ Start a Quest</a>
      </div>
    </section>` : '';

  const columns = (homeBase || guilds) ? `
    <div class="contact-columns">
      <div class="contact-col-left">${homeBase}</div>
      <div class="contact-col-right">${guilds}</div>
    </div>` : '';

  container.innerHTML = `
    <section class="contact-scrolls">
      <h2 class="rule-title">Contact Scrolls</h2>
      <div class="scroll-grid">${scrollCards || '<p style="color:var(--body-ink);">No contact information listed.</p>'}</div>
    </section>
    ${columns}
    ${cta}
  `;
}

// ============================================
// MEDIA PAGE — Render from mediaMentions
// ============================================
function renderMediaPage() {
  const container = document.getElementById('mediaContainer');
  if (!container) return;

  const media = typeof mediaMentions !== 'undefined' ? mediaMentions : {};
  const podcasts = media.podcasts || [];
  const press = media.press || [];
  const profiles = media.profiles || [];

  if (!podcasts.length && !press.length && !profiles.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--body-ink);padding:40px;">No media mentions data available.</p>';
    return;
  }

  const isURL = v => v && /^https?:\/\/.{4}/.test(v);
  const pv = v => {
    if (v == null) return '';
    const t = String(v).trim();
    return (t === '' || t === '/' || t === 'N/A' || t === 'null' || t === 'none') ? '' : t;
  };
  const yearOf = d => {
    const match = pv(d).match(/\d{4}/);
    return match ? match[0] : '✦';
  };

  let html = '';

  // Podcasts — redesign .podcast-grid of .podcast-card entries.
  if (podcasts.length) {
    html += `
      <section class="podcasts">
        <h2 class="rule-title">Podcast Appearances</h2>
        <div class="podcast-grid">
          ${podcasts.map(item => {
            const kicker = [pv(item.name), pv(item.date)].filter(Boolean).join(' · ');
            const inner = `
              ${kicker ? `<div class="card-kicker">${kicker}</div>` : ''}
              <h3 class="card-title">${pv(item.title) || pv(item.name)}</h3>
              ${pv(item.description) ? `<p class="card-desc">${pv(item.description)}</p>` : ''}
              ${pv(item.platform) ? `<div class="card-source">${pv(item.platform)}</div>` : ''}`;
            return isURL(item.url)
              ? `<a href="${item.url}" target="_blank" class="section-box podcast-card">${inner}</a>`
              : `<div class="section-box podcast-card">${inner}</div>`;
          }).join('')}
        </div>
      </section>`;
  }

  // Press — redesign .ledger rows (year + source — title).
  if (press.length || profiles.length) {
    const pressRows = press.map(item => {
      const text = `<span class="ledger-text">${pv(item.name) ? `<span class="ledger-source">${pv(item.name)}</span> — ` : ''}${pv(item.title) || pv(item.description)}</span>`;
      const year = `<span class="ledger-year">${yearOf(item.date)}</span>`;
      return isURL(item.url)
        ? `<a href="${item.url}" target="_blank" class="ledger-row">${year}${text}</a>`
        : `<div class="ledger-row">${year}${text}</div>`;
    }).join('');

    const profileLinks = profiles
      .map(item => isURL(item.url)
        ? `<a href="${item.url}" target="_blank">${item.name || item.title || 'Profile'}</a>`
        : (item.name || item.title || ''))
      .filter(Boolean)
      .join(' · ');
    const profilesRow = profileLinks ? `
      <div class="ledger-row ledger-row--profiles">
        <span class="ledger-year">✦</span>
        <span class="ledger-text ledger-text--profiles">Profiles: ${profileLinks}</span>
      </div>` : '';

    html += `
      <section class="press">
        <h2 class="rule-title">Press Chronicles</h2>
        <div class="ledger">
          ${pressRows}
          ${profilesRow}
        </div>
      </section>`;
  }

  container.innerHTML = html;
}

// Initialize all renders
function initRender() {
  renderSkills();
  renderActions();
  renderSpells();
  renderInventory();
  renderFeatures();
  renderBackground();
  renderNotes();
  renderExtras();
  renderClassicCV();
}

// Initialize page-specific renders (called after data is loaded)
// Initialize page-specific renders (called after data is loaded).
// The owner pages (no ?slug=) ship the redesign's static content in their
// HTML — identical to the static site — so the dynamic page builders only
// run for externally loaded (generated) sheets. The character sheet page
// and projects grid render from data on every load, exactly like the
// static site does.
function initPageRenders() {
  // Character sheet page
  if (document.getElementById('skillsList')) initRender();
  // Projects page
  if (document.getElementById('projectsGrid')) renderProjects();
  // Data-driven pages: only re-render when showing a generated sheet
  if (window.__appDataSource !== 'default') {
    if (document.getElementById('campaignsContainer')) renderCampaignsPage();
    if (document.getElementById('notableContainer')) renderNotablePage();
    if (document.getElementById('contactContainer')) renderContactPage();
    if (document.getElementById('mediaContainer')) renderMediaPage();
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initRender, initPageRenders, renderProjects, renderCampaignsPage, renderNotablePage, renderContactPage, renderMediaPage };
}
