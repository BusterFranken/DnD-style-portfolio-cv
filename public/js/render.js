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
    const profClass = skill.expertise ? 'expertise' : (skill.proficient ? 'proficient' : '');
    const markerClass = skill.expertise ? 'expertise' : (skill.proficient ? 'filled' : '');
    const modSign = skill.modifier >= 0 ? '+' : '';
    
    return `
      <div class="skill-item ${profClass} clickable" data-skill="${skill.name.toLowerCase().replace(/\s+/g, '')}">
        <span class="proficiency-marker ${markerClass}"></span>
        <span class="skill-ability">${skill.ability.toUpperCase()}</span>
        <span class="skill-name">${skill.name}</span>
        <span class="skill-mod rollable" data-mod="${skill.modifier}" data-skill="${skill.name}">${modSign}${skill.modifier}</span>
      </div>
    `;
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
  const hasAttack = action.attackBonus != null && action.attackBonus !== undefined;
  const hasDamage = action.damage != null && action.damageType != null;
  const icon = action.type === 'Attack' ? '⚔️' : 
               action.type === 'Bonus Action' ? '⚡' : 
               action.type === 'Reaction' ? '🔄' : '🎬';
  
  return `
    <div class="action-item clickable" data-action="${action.name}">
      <span class="action-icon">${icon}</span>
      <div class="action-details">
        <div class="action-name">${action.name}</div>
        <div class="action-type">${action.type}${action.uses ? ` • ${action.uses}` : ''}</div>
      </div>
      ${hasAttack || hasDamage ? `
        <div class="action-stats">
          ${hasAttack ? `<div class="action-attack rollable" data-mod="${action.attackBonus}">+${action.attackBonus} to hit</div>` : ''}
          ${hasDamage ? `<div class="action-damage">${action.damage} ${action.damageType}</div>` : ''}
        </div>
      ` : ''}
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

// Render Classic CV View — fully dynamic from characterData + campaignsData
function renderClassicCV() {
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
    container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">No campaigns data available.</p>';
    return;
  }

  const sq = typeof sideQuests !== 'undefined' ? sideQuests : [];

  let html = '';

  // Main campaigns
  campaignsData.forEach((campaign, idx) => {
    const outcomeHtml = campaign.outcome
      ? `<span class="campaign-outcome success">&check; ${campaign.outcome}</span>`
      : '';
    const partnersHtml = campaign.partners && campaign.partners.length
      ? `<div class="partner-logos"><span class="partners-label">Party Members:</span><div class="logo-scroll">${campaign.partners.map(p => `<span class="partner-badge">${p}</span>`).join('')}</div></div>`
      : '';

    let adventuresHtml = '';
    if (campaign.adventures && campaign.adventures.length) {
      adventuresHtml = '<div class="adventures-list">' + campaign.adventures.map(adv => {
        let encountersHtml = '';
        if (adv.encounters && adv.encounters.length) {
          encountersHtml = '<div class="encounters-list">' + adv.encounters.map(enc => {
            const iconClass = enc.notable ? 'notable' : '';
            const icon = enc.notable ? '&#11088;' : '&#9876;&#65039;';
            const linkHtml = enc.link ? ` <a href="${enc.link}" target="_blank" class="encounter-link">Read more &rarr;</a>` : '';
            return `<div class="encounter-item ${iconClass}"><span class="encounter-icon">${icon}</span><div class="encounter-content"><strong>${enc.name}</strong><p>${enc.description}${linkHtml}</p></div></div>`;
          }).join('') + '</div>';
        }

        const roleOrg = [adv.role, adv.organization].filter(Boolean).join(' at ');
        const roleHtml = roleOrg ? `<div class="adventure-role">${roleOrg}</div>` : '';

        return `
          <div class="adventure-card" data-adventure="${adv.id}">
            <div class="adventure-header">
              <span class="adventure-icon">&#9876;&#65039;</span>
              <div class="adventure-info">
                <h3 class="adventure-title">Adventure: ${adv.name}</h3>
                <span class="adventure-dates">${adv.dates}</span>
                ${roleHtml}
              </div>
            </div>
            <p class="adventure-summary">${adv.summary}</p>
            ${encountersHtml}
          </div>`;
      }).join('') + '</div>';
    }

    html += `
      <section class="campaign-card ${idx === 0 ? 'expanded' : ''}" data-campaign="${campaign.id}">
        <div class="campaign-header">
          <div class="campaign-icon">&#128220;</div>
          <div class="campaign-info">
            <h2 class="campaign-title">${campaign.name}</h2>
            <div class="campaign-meta">
              <span class="campaign-dates">${campaign.dates}</span>
              <span class="campaign-duration">${campaign.duration}</span>
              ${outcomeHtml}
            </div>
          </div>
          <button class="campaign-toggle">&#9660;</button>
        </div>
        <div class="campaign-body">
          <p class="campaign-summary">${campaign.summary}</p>
          ${partnersHtml}
          ${adventuresHtml}
        </div>
      </section>`;
  });

  // Side Quests
  if (sq.length) {
    html += `
      <section class="campaign-card" data-campaign="side-quests">
        <div class="campaign-header">
          <div class="campaign-icon">&#127942;</div>
          <div class="campaign-info">
            <h2 class="campaign-title">Side Quests</h2>
            <div class="campaign-meta">
              <span class="campaign-dates">Various</span>
            </div>
          </div>
          <button class="campaign-toggle">&#9660;</button>
        </div>
        <div class="campaign-body">
          <div class="adventures-list">
            ${sq.map(s => `
              <div class="adventure-card">
                <div class="adventure-header">
                  <span class="adventure-icon">&#127775;</span>
                  <div class="adventure-info">
                    <h3 class="adventure-title">${s.name}</h3>
                    <span class="adventure-dates">${s.dates}</span>
                    <div class="adventure-role">${s.role}</div>
                  </div>
                </div>
                <p class="adventure-summary">${s.description}</p>
                ${s.url && /^https?:\/\/.{4}/.test(s.url) ? `<a href="${s.url}" target="_blank" class="encounter-link">Visit &rarr;</a>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </section>`;
  }

  container.innerHTML = html;

  // Re-attach campaign toggle listeners
  container.querySelectorAll('.campaign-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.campaign-card');
      card.classList.toggle('expanded');
    });
  });
  container.querySelectorAll('.campaign-header').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('.campaign-toggle')) return;
      const card = header.closest('.campaign-card');
      card.classList.toggle('expanded');
    });
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
    container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">No notable achievements data available.</p>';
    return;
  }

  function rarityClass(idx) {
    if (idx < 2) return 'legendary';
    if (idx < 5) return 'epic';
    return 'rare';
  }

  function rarityLabel(idx) {
    if (idx < 2) return 'LEGENDARY';
    if (idx < 5) return 'EPIC';
    return 'RARE';
  }

  let html = '';

  // Notable Adventures
  if (adventures.length) {
    html += `
      <section class="notable-section">
        <h2 class="section-header">&#127942; Notable Adventures</h2>
        <p class="section-desc">Major campaigns and story arcs that defined career progression.</p>
        <div class="notable-grid">
          ${adventures.map((a, i) => `
            <div class="notable-card ${rarityClass(i)}">
              <div class="card-badge">${rarityLabel(i)}</div>
              <div class="card-icon">&#128142;</div>
              <h3 class="card-title">${a.name}</h3>
              <p class="card-desc">${a.description}</p>
              <div class="card-stats">
                <span>${a.date}</span>
                <span>${a.category}</span>
              </div>
              ${a.link ? `<a href="${a.link}" target="_blank" class="card-link">Read coverage &rarr;</a>` : ''}
            </div>
          `).join('')}
        </div>
      </section>`;
  }

  // Notable Encounters
  if (encounters.length) {
    html += `
      <section class="notable-section">
        <h2 class="section-header">&#9876;&#65039; Key Encounters</h2>
        <p class="section-desc">Pivotal moments and decisive encounters along the journey.</p>
        <div class="encounters-timeline">
          ${encounters.map(e => `
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-date">${e.date}</div>
                <h3 class="timeline-title">${e.name}</h3>
                <p class="timeline-desc">${e.description}</p>
                <span class="timeline-category">${e.category}</span>
              </div>
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

  let contactCards = '';
  if (p.email) contactCards += `<a href="mailto:${p.email}" class="contact-card primary"><span class="contact-icon">&#128231;</span><div class="contact-info"><h3>Email</h3><p>${p.email}</p><span class="contact-note">Best for detailed inquiries</span></div></a>`;
  if (p.phone) contactCards += `<a href="tel:${p.phone}" class="contact-card"><span class="contact-icon">&#128241;</span><div class="contact-info"><h3>Phone</h3><p>${p.phone}</p><span class="contact-note">Available during business hours</span></div></a>`;
  if (p.linkedin) contactCards += `<a href="${p.linkedin}" target="_blank" class="contact-card"><span class="contact-icon">&#128188;</span><div class="contact-info"><h3>LinkedIn</h3><p>LinkedIn Profile</p><span class="contact-note">Professional network</span></div></a>`;
  if (p.github) contactCards += `<a href="${p.github}" target="_blank" class="contact-card"><span class="contact-icon">&#128187;</span><div class="contact-info"><h3>GitHub</h3><p>GitHub Profile</p><span class="contact-note">Code &amp; projects</span></div></a>`;
  if (p.location) contactCards += `<div class="contact-card"><span class="contact-icon">&#128205;</span><div class="contact-info"><h3>Location</h3><p>${p.location}</p>${p.address ? `<span class="contact-note">${p.address}</span>` : ''}</div></div>`;

  let orgsHtml = '';
  if (orgs.length) {
    orgsHtml = `
      <section class="contact-section">
        <h2 class="section-title">&#127760; Guild Memberships</h2>
        <p class="section-desc">Organizations and communities.</p>
        <div class="org-grid">
          ${orgs.map(o => `
            <div class="org-card">
              <div class="org-header-card">
                <h3>${o.name}</h3>
                <span class="org-role-badge">${o.role}</span>
              </div>
              <div class="org-dates">${o.dates}</div>
              <p class="org-desc">${o.description}</p>
              ${o.url ? `<a href="${o.url}" target="_blank" class="org-link">Visit &rarr;</a>` : ''}
            </div>
          `).join('')}
        </div>
      </section>`;
  }

  let statusHtml = '';
  if (p.currentStatus || p.currentCampaign) {
    statusHtml = `
      <section class="contact-section">
        <h2 class="section-title">&#9889; Current Status</h2>
        <div class="status-card">
          ${p.currentStatus ? `<div class="status-badge">${p.currentStatus}</div>` : ''}
          ${p.currentCampaign ? `<p class="status-desc">${p.currentCampaign}</p>` : ''}
        </div>
      </section>`;
  }

  container.innerHTML = `
    <section class="contact-section">
      <h2 class="section-title">&#128236; Contact Scrolls</h2>
      <p class="section-desc">Ways to reach me for new quests and collaborations.</p>
      <div class="contact-grid">${contactCards}</div>
    </section>
    ${statusHtml}
    ${orgsHtml}
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
    container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">No media mentions data available.</p>';
    return;
  }

  function mediaCard(item, icon) {
    return `
      <a href="${item.url || '#'}" target="_blank" class="media-card">
        <div class="media-header">
          <span class="media-icon">${icon}</span>
          <div class="media-info">
            <div class="media-source">${item.name || ''}</div>
            <h3 class="media-title">${item.title || item.name || ''}</h3>
          </div>
        </div>
        <p class="media-desc">${item.description || ''}</p>
        <div class="media-footer">
          ${item.date ? `<span class="media-date">${item.date}</span>` : ''}
          ${item.platform ? `<span class="media-platform">${item.platform}</span>` : ''}
        </div>
      </a>`;
  }

  let html = '';

  if (podcasts.length) {
    html += `
      <section class="media-section">
        <h2 class="section-header">&#127897;&#65039; Podcasts</h2>
        <div class="media-grid">${podcasts.map(p => mediaCard(p, '&#127897;&#65039;')).join('')}</div>
      </section>`;
  }

  if (press.length) {
    html += `
      <section class="media-section">
        <h2 class="section-header">&#128240; Press Coverage</h2>
        <div class="media-grid">${press.map(p => mediaCard(p, '&#128240;')).join('')}</div>
      </section>`;
  }

  if (profiles.length) {
    html += `
      <section class="media-section">
        <h2 class="section-header">&#128100; Profiles</h2>
        <div class="media-grid">${profiles.map(p => mediaCard(p, '&#128100;')).join('')}</div>
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
function initPageRenders() {
  // Character sheet page
  if (document.getElementById('skillsList')) initRender();
  // Projects page
  if (document.getElementById('projectsGrid')) renderProjects();
  // Campaigns page
  if (document.getElementById('campaignsContainer')) renderCampaignsPage();
  // Notable page
  if (document.getElementById('notableContainer')) renderNotablePage();
  // Contact page
  if (document.getElementById('contactContainer')) renderContactPage();
  // Media page
  if (document.getElementById('mediaContainer')) renderMediaPage();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initRender, initPageRenders, renderProjects, renderCampaignsPage, renderNotablePage, renderContactPage, renderMediaPage };
}
