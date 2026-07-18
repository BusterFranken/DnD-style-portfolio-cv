/* ============================================
   RENDER - Dynamic Content Rendering
   ============================================ */

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
    
    return `
      <article class="project-card" data-category="${filterCategory}">
        <div class="project-image">
          <img src="${project.image}" alt="${project.name}" class="project-banner" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="project-emoji" style="display:none;">${getCategoryEmoji(project.category)}</div>
        </div>
        <div class="project-content">
          <span class="project-category">${project.category}</span>
          <h3 class="project-title">${project.name}</h3>
          <div class="project-meta">
            <span class="project-tech">AI for Good</span>
          </div>
          <a href="${fullLink}" class="project-link">View Quest Details →</a>
        </div>
      </article>
    `;
  }).join('');
}

// Helper function to get emoji for category (fallback)
function getCategoryEmoji(category) {
  const emojiMap = {
    'Wildlife': '🦁',
    'Earth': '🌍',
    'Health': '❤️',
    'Autonomous': '🚁',
    'MLOps': '⚙️',
    'Safety': '🛡️',
    'Community': '👥'
  };
  return emojiMap[category] || '🎯';
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
  
  let html = '';
  
  // Attacks first
  if (actionsByType['Attack'].length) {
    html += '<div class="action-category"><div class="action-category-title">⚔️ Attacks</div>';
    html += actionsByType['Attack'].map(action => renderActionItem(action)).join('');
    html += '</div>';
  }
  
  // Actions
  if (actionsByType['Action'].length) {
    html += '<div class="action-category"><div class="action-category-title">🎬 Actions</div>';
    html += actionsByType['Action'].map(action => renderActionItem(action)).join('');
    html += '</div>';
  }
  
  // Bonus Actions
  if (actionsByType['Bonus Action'].length) {
    html += '<div class="action-category"><div class="action-category-title">⚡ Bonus Actions</div>';
    html += actionsByType['Bonus Action'].map(action => renderActionItem(action)).join('');
    html += '</div>';
  }
  
  // Reactions
  if (actionsByType['Reaction'].length) {
    html += '<div class="action-category"><div class="action-category-title">🔄 Reactions</div>';
    html += actionsByType['Reaction'].map(action => renderActionItem(action)).join('');
    html += '</div>';
  }
  
  actionsList.innerHTML = html;
}

function renderActionItem(action) {
  const hasAttack = action.attackBonus !== undefined;
  const tags = (action.properties || []).map(p => p.toLowerCase()).join(' · ');

  return `
    <div class="action-item clickable" data-action="${action.name}">
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
  
  let html = `
    <div class="spell-level-group">
      <div class="spell-level-title">Cantrips (At Will)</div>
      ${spells.cantrips.map(spell => `
        <div class="spell-item clickable" data-spell="${spell.name}">
          <span class="spell-name">${spell.name}</span>
          <span class="spell-meta">${spell.castTime} • ${spell.range}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  if (spells.level1) {
    html += `
      <div class="spell-level-group">
        <div class="spell-level-title">1st Level (${spells.level1[0]?.slots || 4} slots)</div>
        ${spells.level1.map(spell => `
          <div class="spell-item clickable" data-spell="${spell.name}">
            <span class="spell-name">${spell.name}</span>
            <span class="spell-meta">${spell.castTime} • ${spell.range}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  if (spells.level2) {
    html += `
      <div class="spell-level-group">
        <div class="spell-level-title">2nd Level (${spells.level2[0]?.slots || 3} slots)</div>
        ${spells.level2.map(spell => `
          <div class="spell-item clickable" data-spell="${spell.name}">
            <span class="spell-name">${spell.name}</span>
            <span class="spell-meta">${spell.castTime} • ${spell.range}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  if (spells.level3) {
    html += `
      <div class="spell-level-group">
        <div class="spell-level-title">3rd Level (${spells.level3[0]?.slots || 2} slots)</div>
        ${spells.level3.map(spell => `
          <div class="spell-item clickable" data-spell="${spell.name}">
            <span class="spell-name">${spell.name}</span>
            <span class="spell-meta">${spell.castTime} • ${spell.range}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  spellsList.innerHTML = html;
}

// Render Inventory
function renderInventory() {
  const inventoryList = document.getElementById('inventoryList');
  if (!inventoryList) return;
  
  inventoryList.innerHTML = characterData.inventory.map(item => `
    <div class="inventory-item clickable" data-item="${item.name}">
      <span class="inventory-active ${item.active ? 'equipped' : ''}"></span>
      <span class="inventory-name">${item.name}</span>
      <span class="inventory-qty">${item.qty > 1 ? `×${item.qty}` : ''}</span>
      <span class="inventory-value">${item.value}</span>
      <span class="inventory-notes">${item.notes}</span>
    </div>
  `).join('');
}

// Render Features
function renderFeatures() {
  const featuresList = document.getElementById('featuresList');
  if (!featuresList) return;
  
  const features = characterData.features;
  
  let html = `
    <div class="feature-category">
      <div class="feature-category-title">Class Features & Feats</div>
      ${features.classFeatures.map(f => `
        <div class="feature-item clickable" data-feature="${f.name}">
          <div class="feature-name">${f.name}</div>
          <div class="feature-source">${f.source}</div>
          <div class="feature-desc">${f.description}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="feature-category">
      <div class="feature-category-title">Background Feature</div>
      <div class="feature-item clickable" data-feature="${features.backgroundFeature.name}">
        <div class="feature-name">${features.backgroundFeature.name}</div>
        <div class="feature-source">${features.backgroundFeature.source}</div>
        <div class="feature-desc">${features.backgroundFeature.description}</div>
      </div>
    </div>
    
    <div class="feature-category">
      <div class="feature-category-title">Achievements</div>
      ${features.achievements.map(a => `
        <div class="feature-item clickable" data-feature="${a.name}">
          <div class="feature-name">🏆 ${a.name}${a.date ? ` <span class="feature-date">(${a.date})</span>` : ''}</div>
          <div class="feature-desc">${a.description}</div>
          ${a.link ? `<a href="${a.link}" target="_blank" class="feature-link">Read more →</a>` : ''}
        </div>
      `).join('')}
    </div>
  `;
  
  featuresList.innerHTML = html;
}

// Render Background
function renderBackground() {
  const backgroundContent = document.getElementById('backgroundContent');
  if (!backgroundContent) return;
  
  const bg = characterData.background;
  
  backgroundContent.innerHTML = `
    <div class="background-section">
      <div class="background-section-title">Background: ${bg.name}</div>
      <div class="trait-item">
        <span class="trait-label">Skill Proficiencies:</span> ${bg.skillProficiencies.join(', ')}
      </div>
      <div class="trait-item">
        <span class="trait-label">Tool Proficiencies:</span> ${bg.toolProficiencies.join(', ')}
      </div>
    </div>
    
    <div class="background-section">
      <div class="background-section-title">Origin Story</div>
      <div class="trait-item origin-story">${bg.characteristics.backgroundStory}</div>
      <div class="trait-item">
        <span class="trait-label">Origin:</span> ${bg.characteristics.origin}
      </div>
      <div class="trait-item">
        <span class="trait-label">Former Life:</span> ${bg.characteristics.formerLife}
      </div>
      <div class="trait-item">
        <span class="trait-label">First Gig:</span> ${bg.characteristics.firstGig}
      </div>
      <div class="trait-item">
        <span class="trait-label">Transition:</span> ${bg.characteristics.artToEngineering}
      </div>
    </div>
    
    <div class="background-section">
      <div class="background-section-title">Personality Traits</div>
      ${bg.personalityTraits.map(t => `<div class="trait-item">"${t}"</div>`).join('')}
    </div>
    
    <div class="background-section">
      <div class="background-section-title">Ideals</div>
      ${bg.ideals.map(i => `
        <div class="trait-item">
          <span class="trait-label">${i.name}:</span> ${i.description} <em>(${i.alignment})</em>
        </div>
      `).join('')}
    </div>
    
    <div class="background-section">
      <div class="background-section-title">Bonds</div>
      ${bg.bonds.map(b => `<div class="trait-item">${b}</div>`).join('')}
    </div>
    
    <div class="background-section">
      <div class="background-section-title">Flaws</div>
      ${bg.flaws.map(f => `<div class="trait-item">${f}</div>`).join('')}
    </div>
    
    <div class="background-section">
      <div class="background-section-title">Faith & Philosophy</div>
      <div class="trait-item"><span class="trait-label">Faith:</span> ${bg.characteristics.faith}</div>
    </div>
  `;
}

// Render Notes (Vouches & Organizations)
function renderNotes() {
  const notesContent = document.getElementById('notesContent');
  if (!notesContent) return;
  
  notesContent.innerHTML = `
    <div class="background-section">
      <div class="background-section-title">Vouches (Testimonials)</div>
      ${characterData.vouches.map(v => `
        <div class="vouch-item">
          <div class="vouch-text">"${v.text}"</div>
          <div class="vouch-author">– ${v.author}</div>
          <div class="vouch-role">${v.role}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="background-section">
      <div class="background-section-title">Organizations</div>
      ${characterData.organizations.map(o => `
        <div class="org-item clickable" data-org="${o.name}">
          <div class="org-header">
            <span class="org-name">${o.name}</span>
            <span class="org-role">${o.role}</span>
          </div>
          <div class="org-dates">${o.dates}</div>
          <div class="org-description">${o.description}</div>
          ${o.url ? `<a href="${o.url}" target="_blank" class="org-link">Visit website →</a>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

// Render Extras
function renderExtras() {
  const extrasContent = document.getElementById('extrasContent');
  if (!extrasContent) return;
  
  const extras = characterData.extras;
  
  extrasContent.innerHTML = `
    <div class="extras-section">
      <div class="extras-title">Fun Facts</div>
      <div class="extras-list">
        ${extras.funFacts.map(f => `<span class="extras-item">${f}</span>`).join('')}
      </div>
    </div>
    
    <div class="extras-section">
      <div class="extras-title">Interests</div>
      <div class="extras-list">
        ${extras.interests.map(i => `<span class="extras-item">${i}</span>`).join('')}
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
