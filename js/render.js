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

  skillsList.innerHTML = characterData.skills.map(skill => {
    const skillKey = skill.name.toLowerCase().replace(/\s+/g, '');

    return `
      <div class="skill-item ${skill.proficient ? 'proficient' : ''} clickable" data-skill="${skillKey}">
        <span class="proficiency-marker ${skill.expertise ? 'expertise' : skill.proficient ? 'filled' : ''}"></span>
        <span class="skill-abbr">${skill.ability.toUpperCase()}</span>
        <span class="skill-name">${skill.name}</span>
        <span class="skill-mod rollable" data-mod="${skill.modifier}" data-skill="${skill.name}">${skill.modifier >= 0 ? '+' : ''}${skill.modifier}</span>
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
  
  characterData.actions.forEach(action => {
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
  const hasAttack = action.attackBonus !== undefined;
  const tags = (action.properties || []).map(p => p.toLowerCase()).join(' · ');

  return `
    <div class="action-item clickable${hasAttack ? ' attack' : ''}" data-action="${action.name}">
      <span class="action-name">${action.name}</span>
      ${tags ? `<span class="action-tags">${tags}</span>` : ''}
      ${!hasAttack ? `<div class="action-effect">${action.effect || action.description || ''}</div>` : ''}
      ${hasAttack ? `
        <span class="action-attack rollable" data-mod="${action.attackBonus}" data-skill="${action.name}">+${action.attackBonus} to hit</span>
        <span class="action-damage">${action.damage} ${action.damageType}</span>
      ` : `<span class="action-type">${action.uses || ''}</span>`}
    </div>
  `;
}

// Render Spells
function renderSpells() {
  const spellsList = document.getElementById('spellsList');
  if (!spellsList) return;

  const spells = characterData.spells;

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
      const badge = group.ordinal ? `${group.ordinal} ·${spell.slots}` : 'Cantrip';
      // spell.featured (optional flag, data.js) → oxblood badge + name, matching the
      // prototype's one highlighted spell ("Recruit"). .spell-item's own contract
      // (clickable, data-spell) is unchanged; this only appends a modifier class.
      html += `
        <div class="spell-item clickable${spell.featured ? ' spell-item--featured' : ''}" data-spell="${spell.name}">
          <span class="spell-level-badge">${badge}</span>
          <span class="spell-name">${spell.name}</span>
          <span class="spell-meta">${spell.cvMeaning}</span>
        </div>
      `;
    });
  });

  spellsList.innerHTML = html;
}

// Render Inventory
function renderInventory() {
  const inventoryList = document.getElementById('inventoryList');
  if (!inventoryList) return;
  
  // qty fuses into the name string (e.g. "Customer Interview Notes ×500") — no separate
  // flex-ordered qty element (finding 4); row order is name, notes, value, per prototype.
  inventoryList.innerHTML = characterData.inventory.map(item => `
    <div class="inventory-item clickable" data-item="${item.name}">
      <span class="inventory-active ${item.active ? 'equipped' : ''}"></span>
      <span class="inventory-name">${item.name}${item.qty > 1 ? ` ×${item.qty}` : ''}</span>
      <span class="inventory-notes">${item.notes}</span>
      <span class="inventory-value">${item.value}</span>
    </div>
  `).join('');
}

// Render Features
function renderFeatures() {
  const featuresList = document.getElementById('featuresList');
  if (!featuresList) return;

  const features = characterData.features;
  // Background Feature folds into the SAME "Class Features" list (no second header),
  // distinguished only by its oxblood name color (finding 2). Identity (`===`) picks
  // out that one entry after the arrays are combined.
  const allClassFeatures = [...features.classFeatures, features.backgroundFeature];

  // Each feature is ONE inline line: "Name — Source · Description" (.feature-source and
  // .feature-desc are both `display:inline` and CSS-prepend their own "— "/" · " glyphs).
  const classFeaturesHtml = allClassFeatures.map(f => {
    const isBackgroundFeature = f === features.backgroundFeature;
    return `
        <div class="feature-item clickable" data-feature="${f.name}"><span class="feature-name${isBackgroundFeature ? ' feature-name--highlight' : ''}">${f.name}</span><span class="feature-source">${f.source}</span>${f.description ? `<span class="feature-desc">${f.description}</span>` : ''}</div>
      `;
  }).join('');

  // Achievements: curated to the items carrying the optional `rarity` field (Legendary/
  // Epic tier), rendered as a badge pill + name + optional short description — matches
  // the prototype's 3-item curated subset while the full 8-item list stays in data.js.
  const achievementsHtml = features.achievements.filter(a => a.rarity).map(a => `
        <div class="feature-item clickable" data-feature="${a.name}">${a.rarity ? `<span class="feature-badge feature-badge--${a.rarity.toLowerCase()}">${a.rarity}</span>` : ''} <span class="feature-name">${a.name}</span>${a.description ? `<span class="feature-source">${a.description}</span>` : ''}</div>
      `).join('');

  featuresList.innerHTML = `
    <div class="feature-category">
      <div class="feature-category-title">✦ Class Features</div>
      ${classFeaturesHtml}
    </div>

    <div class="feature-category">
      <div class="feature-category-title">✦ Achievements</div>
      ${achievementsHtml}
    </div>
  `;
}

// Render Background
function renderBackground() {
  const backgroundContent = document.getElementById('backgroundContent');
  if (!backgroundContent) return;

  const bg = characterData.background;

  // Ideals: only the entries carrying the optional `featured` rank are joined into the
  // single "Ideals" characteristics line (curated + ordered per the prototype); the
  // un-featured Interdependence ideal stays in data.js, untouched.
  const featuredIdeals = bg.ideals
    .filter(i => i.featured)
    .sort((a, b) => a.featured - b.featured)
    .map(i => `${i.name} — ${i.description.charAt(0).toLowerCase()}${i.description.slice(1)}`)
    .join(' ');

  // Exactly 2 sections (finding 5): "Origin Story" (one flowing narrative paragraph —
  // backgroundStory, now the merged prototype copy) and "Characteristics" (5 single
  // curated label:value lines — first entry of each traits array, per existing order).
  backgroundContent.innerHTML = `
    <div class="background-section">
      <div class="background-section-title">✦ Origin Story</div>
      <div class="trait-item origin-story">${bg.characteristics.backgroundStory}</div>
    </div>

    <div class="background-section">
      <div class="background-section-title">✦ Characteristics</div>
      <div class="trait-item"><span class="trait-label">Personality </span><em>"${bg.personalityTraits[0]}"</em></div>
      <div class="trait-item"><span class="trait-label">Ideals </span><em>${featuredIdeals}</em></div>
      <div class="trait-item"><span class="trait-label">Bond </span><em>${bg.bonds[0]}</em></div>
      <div class="trait-item"><span class="trait-label">Flaw </span><em>${bg.flaws[0]}</em></div>
      <div class="trait-item"><span class="trait-label">Faith </span><em>${bg.characteristics.faith}</em></div>
    </div>
  `;
}

// Render Notes (Vouches & Organizations)
function renderNotes() {
  const notesContent = document.getElementById('notesContent');
  if (!notesContent) return;

  notesContent.innerHTML = `
    <div class="background-section">
      <div class="background-section-title">✦ Vouches</div>
      ${characterData.vouches.map(v => `
        <div class="vouch-item">
          <div class="vouch-text">"${v.text}"</div>
          <div class="vouch-author">${v.author}</div><div class="vouch-role">${v.role}</div>
        </div>
      `).join('')}
    </div>

    <div class="background-section">
      <div class="background-section-title">✦ Guilds & Orgs</div>
      <div class="org-chips">
        ${characterData.organizations.filter(o => o.featured).map(o => `<span class="chip-tag">${o.name}</span>`).join('')}
      </div>
    </div>
  `;
}

// Render Extras
function renderExtras() {
  const extrasContent = document.getElementById('extrasContent');
  if (!extrasContent) return;

  const extras = characterData.extras;
  const personal = characterData.personal;

  // "✦ Current Campaign" highlighted block + two CTA buttons come BEFORE the Fun
  // Facts/Interests content (finding 7). Fun Facts/Interests keep their own explicit
  // modifier classes (not :nth-of-type) so inserting this block ahead of them can't
  // shift which one gets bullets vs. chip styling. Both sections are wrapped in
  // .extras-columns, matching the prototype's 2-col grid DOM structure exactly.
  extrasContent.innerHTML = `
    <div class="extras-campaign">
      <div class="extras-title">✦ Current Campaign</div>
      <div class="campaign-card">
        <div class="campaign-card-name">${personal.currentCampaignName}</div>
        <div class="campaign-card-desc">${personal.currentCampaign} Status: <span class="campaign-card-status">${personal.currentStatus}</span></div>
      </div>
      <div class="extras-cta-row">
        <a href="mailto:${personal.email}?subject=New Quest Inquiry" class="extras-cta-btn extras-cta-btn--solid">✦ Start a Quest</a>
        <a href="Resume-Buster-short.pdf" target="_blank" class="extras-cta-btn extras-cta-btn--outline">❖ Download Classic CV</a>
      </div>
    </div>

    <div class="extras-columns">
      <div class="extras-section extras-section--facts">
        <div class="extras-title">Fun Facts</div>
        <div class="extras-list">
          ${extras.funFacts.map(f => `<span class="extras-item">${f}</span>`).join('')}
        </div>
      </div>

      <div class="extras-section extras-section--interests">
        <div class="extras-title">Interests</div>
        <div class="extras-list">
          ${extras.interests.map(i => `<span class="extras-item">${i}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

// Render Classic CV View
function renderClassicCV() {
  const container = document.getElementById('classicCvContainer');
  if (!container) return;
  
  const data = characterData;
  
  container.innerHTML = `
    <header class="classic-header">
      <h1 class="classic-name">${data.personal.name}</h1>
      <div class="classic-title">${data.personal.title}</div>
      <div class="classic-contact">
        <a href="mailto:${data.personal.email}">${data.personal.email}</a>
        <span>•</span>
        <a href="tel:${data.personal.phone}">${data.personal.phone}</a>
        <span>•</span>
        <a href="${data.personal.linkedin}" target="_blank">LinkedIn</a>
        <span>•</span>
        <a href="${data.personal.github}" target="_blank">GitHub</a>
        <span>•</span>
        <span>${data.personal.location}</span>
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
      <h2 class="classic-section-title">Education</h2>
      ${renderClassicEducation()}
    </section>
    
    <section class="classic-section">
      <h2 class="classic-section-title">Skills</h2>
      <div class="classic-skills-grid">
        <div class="classic-skill-category">
          <div class="classic-skill-category-title">Core Competencies</div>
          <div class="classic-skill-list">Sales & Partnership Building, Community Building, Fundraising, Operations, Presenting/Marketing, Product Management</div>
        </div>
        <div class="classic-skill-category">
          <div class="classic-skill-category-title">Technical</div>
          <div class="classic-skill-list">AI/ML, Data Science, Python, Web Development, User Research, A/B Testing</div>
        </div>
      </div>
    </section>
    
    <section class="classic-section">
      <h2 class="classic-section-title">Testimonials</h2>
      ${data.vouches.map(v => `
        <div class="classic-testimonial">
          <div class="classic-testimonial-text">"${v.text}"</div>
          <div class="classic-testimonial-author">– ${v.author}, ${v.role}</div>
        </div>
      `).join('')}
    </section>
    
    <section class="classic-section">
      <h2 class="classic-section-title">Languages</h2>
      <div class="classic-languages">
        ${data.proficiencies.languages.map(l => `
          <div class="classic-language">
            <span class="classic-language-name">${l.native}</span>
            <span class="classic-language-level">(${l.proficiency})</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderClassicExperience() {
  const experiences = [
    {
      title: 'VP of Partnerships',
      company: 'Zindi',
      dates: 'May 2025 - Oct 2025',
      location: 'Delaware, United States',
      description: 'Post-acquisition role ensuring smooth transition of FruitPunch AI.',
      achievements: ['Transferred all 80+ partnerships', 'Migrated 4500+ community members']
    },
    {
      title: 'Founder & CEO',
      company: 'FruitPunch AI',
      dates: 'Sep 2018 - May 2025',
      location: 'The Netherlands',
      description: 'Built a platform for AI engineers to train their skills by crowdsourcing solutions for impact organizations. Made all key product decisions: user interviews, experience design, and experiments.',
      achievements: [
        '€45M in AI engineering crowdsourced for impact organizations',
        '€1M in VC funding raised from Thomas Wolf (Hugging Face) and LUMO Labs',
        '4500+ AI engineers on platform, 80+ partner organizations',
        'AI against Toxic Clouds caused €4.1M in fines for Tata Steel',
        'Partnerships with Stanford, ESA, Greenpeace, WWF, NXP, Huawei',
        'Acquired by Zindi (2025)'
      ]
    },
    {
      title: 'AI Program Manager',
      company: 'Eindhoven University of Technology (EAISI)',
      dates: 'May 2019 - Dec 2022',
      location: 'Eindhoven, The Netherlands',
      description: 'Founding team member of the Eindhoven AI Systems Institute.',
      achievements: [
        'Built experience room with 6 physical AI demos',
        'Helped recruit AI professors to build the institute',
        'Launched accredited AI course for 135 CS students'
      ]
    }
  ];
  
  return experiences.map(exp => `
    <div class="classic-experience-item">
      <div class="classic-exp-header">
        <div>
          <div class="classic-exp-title">${exp.title}</div>
          <div class="classic-exp-company">${exp.company}</div>
        </div>
        <div>
          <div class="classic-exp-dates">${exp.dates}</div>
          <div class="classic-exp-location">${exp.location}</div>
        </div>
      </div>
      <div class="classic-exp-description">${exp.description}</div>
      <ul class="classic-exp-achievements">
        ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderClassicEducation() {
  return `
    <div class="classic-education-item">
      <div class="classic-edu-degree">Bachelor of Science: Mechanical Engineering & Neuroscience</div>
      <div class="classic-edu-school">Eindhoven University of Technology</div>
      <div class="classic-edu-dates">2014 - 2018</div>
      <div class="classic-edu-notes">10/10 for Brain Computer Interfacing research: showed functional brain organoids can be grown on a chip. Extended studies with 60 ECTS in Data Science courses.</div>
    </div>
  `;
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

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initRender, renderProjects };
}
