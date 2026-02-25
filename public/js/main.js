/* ============================================
   MAIN - Initialization and Event Handling
   ============================================ */

// Wait for DOM
document.addEventListener('DOMContentLoaded', async function() {
  // Load app data from URL slug, localStorage, or defaults
  if (typeof loadAppData === 'function') {
    await loadAppData();
  }
  // Legacy: also load any admin-saved data (merges on top)
  if (typeof loadSavedData === 'function') {
    loadSavedData();
  }
  init();
});

function init() {
  // Render all dynamic content using the unified render function
  if (typeof initPageRenders === 'function') {
    initPageRenders();
  } else if (typeof initRender === 'function') {
    initRender();
  }

  // Update dynamic header elements from characterData
  updateHeaderFromData();
  
  // Setup event handlers
  setupNavbarMobile();
  setupViewToggle();
  setupTabNavigation();
  setupClickableElements();
  setupRollableElements();
  setupRestButtons();
  
  // Set fixed height for right column to match left column (one-time calculation)
  // Only runs on character sheet page (index.html) where .left-column exists
  // Height is set once and never recalculated to prevent issues when switching pages
  setTimeout(() => {
    const leftColumn = document.querySelector('.left-column');
    const rightColumnSectionBox = document.querySelector('.right-column .section-box.tabbed-content');
    
    // Only set height if we're on the character sheet page and height hasn't been set
    if (leftColumn && rightColumnSectionBox && !rightColumnSectionBox.dataset.heightSet) {
      // Wait a bit longer to ensure all content is rendered
      setTimeout(() => {
        // Measure left column height once
        const leftHeight = leftColumn.offsetHeight;
        
        if (leftHeight > 0) {
          // Set as fixed CSS custom property for consistent use
          document.documentElement.style.setProperty('--left-column-height', `${leftHeight}px`);
          
          // Set fixed height on right column section box
          rightColumnSectionBox.style.height = `${leftHeight}px`;
          rightColumnSectionBox.style.minHeight = `${leftHeight}px`;
          rightColumnSectionBox.style.maxHeight = `${leftHeight}px`;
          
          // Mark as set to prevent recalculation
          rightColumnSectionBox.dataset.heightSet = 'true';
        }
      }, 200);
    }
  }, 100);
  
  console.log('🎲 Character sheet initialized!');
}

// ============================================
// NAVBAR MOBILE (hamburger menu)
// ============================================
function setupNavbarMobile() {
  const navbar = document.getElementById('mainNavbar');
  const toggle = document.getElementById('navbarToggle');
  const menu = document.getElementById('navbarMenu');

  if (!navbar || !toggle || !menu) return;

  function closeMenu() {
    navbar.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    navbar.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', () => {
    if (navbar.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking a nav link (e.g. navigating away or same-page)
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('is-open') && !navbar.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ============================================
// VIEW TOGGLE
// ============================================
function setupViewToggle() {
  const toggleBtns = document.querySelectorAll('.view-toggle-btn');
  const dndView = document.querySelector('.dnd-view');
  const classicView = document.querySelector('.classic-view');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      // Update active state
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Toggle views
      if (view === 'dnd') {
        if (dndView) dndView.style.display = 'block';
        if (classicView) classicView.style.display = 'none';
        document.documentElement.dataset.view = 'dnd';
      } else {
        if (dndView) dndView.style.display = 'none';
        if (classicView) classicView.style.display = 'block';
        document.documentElement.dataset.view = 'classic';
      }
      
      // Save preference
      localStorage.setItem('preferredView', view);
    });
  });
  
  // Load saved preference
  const savedView = localStorage.getItem('preferredView');
  if (savedView) {
    const btn = document.querySelector(`.view-toggle-btn[data-view="${savedView}"]`);
    if (btn) btn.click();
  }
}

// ============================================
// TAB NAVIGATION
// ============================================
function setupTabNavigation() {
  // Main tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      
      // Update active states
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${tabId}-panel`) {
          panel.classList.add('active');
        }
      });
    });
  });
  
  // Sub tabs
  document.querySelectorAll('.sub-tabs').forEach(subTabContainer => {
    const subTabs = subTabContainer.querySelectorAll('.sub-tab');
    subTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        subTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Could add filtering logic here
      });
    });
  });
}

// ============================================
// CLICKABLE ELEMENTS (Overlays)
// ============================================
function setupClickableElements() {
  // Ability scores
  document.querySelectorAll('.ability-score.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      // Don't trigger if clicking on rollable modifier
      if (e.target.classList.contains('rollable')) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const ability = el.dataset.ability;
      openOverlay(getAbilityOverlayContent(ability));
    }, true); // Use capture phase
  });
  
  // Skills
  document.querySelectorAll('.skill-item.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('rollable')) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const skill = el.dataset.skill;
      openOverlay(getSkillOverlayContent(skill));
    }, true); // Use capture phase
  });
  
  // Classes
  document.querySelectorAll('.class-item').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const classId = el.dataset.class;
      openOverlay(getClassOverlayContent(classId));
    }, true); // Use capture phase
  });
  
  // Passive skills
  document.querySelectorAll('.passive-skill.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const skill = el.dataset.skill;
      openOverlay(getSkillOverlayContent(skill));
    }, true); // Use capture phase
  });
  
  // Saving throws (clicking on the row, not the modifier)
  document.querySelectorAll('.save-item.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('rollable')) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const save = el.dataset.save;
      if (typeof getSavingThrowOverlayContent === 'function') {
        openOverlay(getSavingThrowOverlayContent(save));
      }
    }, true); // Use capture phase
  });
  
  // Alignment
  document.querySelectorAll('.alignment.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (typeof getAlignmentOverlayContent === 'function') {
        openOverlay(getAlignmentOverlayContent());
      }
    }, true); // Use capture phase
  });
  
  // Combat stats (proficiency, initiative, ac, speed)
  document.querySelectorAll('.stat-box.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('rollable')) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const element = el.dataset.element;
      if (element === 'heroic-inspiration' && typeof getHeroicInspirationOverlayContent === 'function') {
        openOverlay(getHeroicInspirationOverlayContent());
      } else if (typeof getCombatStatOverlayContent === 'function') {
        openOverlay(getCombatStatOverlayContent(element));
      } else {
        openOverlay(getElementOverlayContent(element));
      }
    }, true); // Use capture phase
  });
  
  // Hit Points
  document.querySelectorAll('.hit-points.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (typeof getCombatStatOverlayContent === 'function') {
        openOverlay(getCombatStatOverlayContent('hp'));
      } else {
        openOverlay(getElementOverlayContent('hp'));
      }
    }, true); // Use capture phase
  });
  
  // Defenses
  document.querySelectorAll('.defenses-box.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (typeof getDefensesOverlayContent === 'function') {
        openOverlay(getDefensesOverlayContent());
      }
    }, true); // Use capture phase
  });
  
  // Conditions
  document.querySelectorAll('.conditions-box.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (typeof getConditionsOverlayContent === 'function') {
        openOverlay(getConditionsOverlayContent());
      }
    }, true); // Use capture phase
  });
  
  // Spells (after render)
  setupSpellClickables();
  
  // Actions (after render)
  setupActionClickables();
  
  // Campaign Status - handle first to prevent generic handler
  document.querySelectorAll('.campaign-status.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // Use the specific campaign status overlay function
      if (typeof getCampaignStatusOverlayContent === 'function') {
        const content = getCampaignStatusOverlayContent();
        openOverlay(content);
      } else {
        // Dynamic fallback using characterData
        const p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
        const contactLinks = [];
        if (p.email) contactLinks.push(`<a href="mailto:${p.email}" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--primary-red); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">📧 Email</a>`);
        if (p.linkedin) contactLinks.push(`<a href="${p.linkedin}" target="_blank" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--accent-blue); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">💼 LinkedIn</a>`);

        openOverlay(`
          <div class="overlay-header">
            <h2>🎯 ${p.currentCampaign ? `Current Campaign: ${p.currentCampaign}` : 'Current Status'}</h2>
          </div>
          <div class="overlay-body">
            <div class="overlay-section">
              <h3>About ${p.name || 'This Character'}</h3>
              <p>${p.summary || ''}</p>
              ${p.currentStatus ? `<p><strong>Status:</strong> ${p.currentStatus}</p>` : ''}
            </div>
            ${contactLinks.length ? `
              <div class="overlay-section" style="background: var(--light-bg); padding: var(--spacing-md); border-radius: var(--radius-md); margin-top: var(--spacing-lg);">
                <h3 style="margin-top: 0;">Get In Touch</h3>
                <div class="contact-options" style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; margin-top: var(--spacing-md);">
                  ${contactLinks.join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `);
      }
    }, true); // Use capture phase to ensure it runs first
  });
  
  // Other clickable elements with generic overlay
  document.querySelectorAll('[data-element]').forEach(el => {
    // Skip if already handled by specific handlers
    if (el.classList.contains('stat-box') || 
        el.classList.contains('hit-points') || 
        el.classList.contains('campaign-status') ||
        el.classList.contains('defenses-box') ||
        el.classList.contains('conditions-box') ||
        el.classList.contains('alignment')) return;
    
    el.addEventListener('click', () => {
      const element = el.dataset.element;
      openOverlay(getElementOverlayContent(element));
    });
  });
}

// Setup spell click handlers (called after render)
function setupSpellClickables() {
  document.querySelectorAll('.spell-item.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const spell = el.dataset.spell;
      if (typeof getSpellOverlayContent === 'function') {
        openOverlay(getSpellOverlayContent(spell));
      }
    }, true); // Use capture phase
  });
}

// Setup action click handlers (called after render)
function setupActionClickables() {
  document.querySelectorAll('.action-item.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('rollable')) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const action = el.dataset.action;
      if (typeof getActionOverlayContent === 'function') {
        openOverlay(getActionOverlayContent(action));
      }
    }, true); // Use capture phase
  });
}

// Generic element overlay content — dynamically built from characterData
function getElementOverlayContent(element) {
  const cs = (typeof characterData !== 'undefined' && characterData.coreStats) ? characterData.coreStats : {};
  const p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
  const bg = (typeof characterData !== 'undefined' && characterData.background) ? characterData.background : {};
  const defs = (typeof characterData !== 'undefined' && characterData.defenses) ? characterData.defenses : [];
  const conds = (typeof characterData !== 'undefined' && characterData.conditions) ? characterData.conditions : [];

  const elementInfo = {
    'hp': {
      title: 'Hit Points',
      icon: '❤️',
      description: 'Your life force in D&D represents your ability to withstand damage.',
      cvMeaning: cs.hitPoints ? cs.hitPoints.meaning : 'Resilience',
      evidence: [
        cs.hitPoints ? `Current: ${cs.hitPoints.current} / Max: ${cs.hitPoints.max}` : '',
        'Capacity to absorb challenges and keep going',
        cs.hitDice ? `Hit Dice: ${cs.hitDice}` : ''
      ].filter(Boolean)
    },
    'ac': {
      title: 'Armor Class',
      icon: '🛡️',
      description: 'How hard you are to hit in combat. Represents your defenses.',
      cvMeaning: 'Professional Defense',
      evidence: [
        cs.armorClass ? `AC ${cs.armorClass}` : '',
        'Professional network and experience provide protection',
      ].filter(Boolean)
    },
    'initiative': {
      title: 'Initiative',
      icon: '⚡',
      description: 'How quickly you can react and act in combat situations.',
      cvMeaning: 'Responsiveness',
      evidence: [
        cs.initiative !== undefined ? `+${cs.initiative} initiative modifier` : '',
        cs.initiativeBreakdown || 'How quickly you respond to opportunities',
      ].filter(Boolean)
    },
    'speed': {
      title: 'Speed',
      icon: '🏃',
      description: 'How far you can move in a single turn.',
      cvMeaning: 'Execution Velocity',
      evidence: [
        cs.speed ? `Speed: ${cs.speed}` : '',
        cs.speedExplanation || 'Pace of career movement and adaptability',
      ].filter(Boolean)
    },
    'proficiency': {
      title: 'Proficiency Bonus',
      icon: '📊',
      description: 'Reflects your overall experience and training level.',
      cvMeaning: 'Experience Level',
      evidence: [
        cs.proficiencyBonus ? `+${cs.proficiencyBonus} proficiency bonus` : '',
        p.level ? `Character Level ${p.level}` : '',
        'Added to skills, saves, and attacks where proficient',
      ].filter(Boolean)
    },
    'background': {
      title: `Background: ${bg.name || p.background || 'Unknown'}`,
      icon: '🎭',
      description: bg.template ? `Based on the ${bg.template} template.` : 'Your origin story and formative experiences.',
      cvMeaning: 'Origin Story',
      evidence: [
        bg.characteristics && bg.characteristics.backgroundStory ? bg.characteristics.backgroundStory : '',
        bg.characteristics && bg.characteristics.origin ? `Origin: ${bg.characteristics.origin}` : '',
        bg.characteristics && bg.characteristics.firstGig ? `First Gig: ${bg.characteristics.firstGig}` : '',
      ].filter(Boolean)
    },
    'defenses': {
      title: 'Defenses',
      icon: '🛡️',
      description: 'Protective traits that provide advantages in difficult situations.',
      cvMeaning: 'Professional Protections',
      evidence: defs.length ? defs.map(d => `${d.name} — ${d.description}`) : ['No specific defenses listed']
    },
    'conditions': {
      title: 'Conditions',
      icon: '✨',
      description: 'Active effects that influence your capabilities.',
      cvMeaning: 'Active Buffs',
      evidence: conds.length ? conds.map(c => `${c.name}${c.active ? ' (Active)' : ''} — ${c.description}`) : ['No active conditions']
    }
  };
  
  const info = elementInfo[element] || {
    title: element,
    icon: '📊',
    description: 'Information about this element.',
    cvMeaning: 'Professional Context',
    evidence: ['Click for more details']
  };
  
  return `
    <div class="overlay-header">
      <span class="overlay-icon">${info.icon}</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">${info.title}</h2>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">D&D Meaning</div>
      <div class="dnd-definition">
        <p>${info.description}</p>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="cv-meaning">
        <div class="cv-meaning-title">${info.cvMeaning}</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Details</div>
      <ul class="evidence-list">
        ${info.evidence.map(e => `
          <li class="evidence-item">
            <span class="evidence-bullet">•</span>
            <span class="evidence-text">${e}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

// ============================================
// ROLLABLE ELEMENTS
// ============================================
function setupRollableElements() {
  document.querySelectorAll('.rollable').forEach(el => {
    el.addEventListener('click', handleRollClick);
  });
}

// ============================================
// REST BUTTONS — Dynamic content from characterData
// ============================================
function setupRestButtons() {
  const p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
  const extras = (typeof characterData !== 'undefined' && characterData.extras) ? characterData.extras : {};
  const funFacts = extras.funFacts || [];
  const interests = extras.interests || [];

  // Short Rest = Interests & Fun Facts
  const shortRestBtn = document.getElementById('shortRestBtn') || document.querySelector('.short-rest');
  shortRestBtn?.addEventListener('click', () => {
    openOverlay(`
      <div class="overlay-header">
        <span class="overlay-icon">⚡</span>
        <div class="overlay-title-block">
          <h2 class="overlay-title">Short Rest</h2>
          <div class="overlay-subtitle">Interests & Fun Facts</div>
        </div>
      </div>
      
      <div class="overlay-section">
        <div class="overlay-section-title">D&D Definition</div>
        <div class="dnd-definition">
          <p>A short rest is a period of at least 1 hour during which a character does nothing more strenuous than reading, talking, eating, or standing watch.</p>
        </div>
      </div>
      
      ${interests.length ? `
        <div class="overlay-section">
          <div class="overlay-section-title">Interests</div>
          <ul class="evidence-list">
            ${interests.map(i => `
              <li class="evidence-item">
                <span class="evidence-bullet">•</span>
                <span class="evidence-text">${i}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${funFacts.length ? `
        <div class="overlay-section">
          <div class="overlay-section-title">Fun Facts</div>
          <ul class="evidence-list">
            ${funFacts.map(f => `
              <li class="evidence-item">
                <span class="evidence-bullet">🎲</span>
                <span class="evidence-text">${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    `);
  });
  
  // Long Rest = Contact & Connect
  const longRestBtn = document.getElementById('longRestBtn') || document.querySelector('.long-rest');
  longRestBtn?.addEventListener('click', () => {
    const contactLinks = [];
    if (p.email) contactLinks.push(`<a href="mailto:${p.email}?subject=Let's Connect!" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--primary-red); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">📧 Email</a>`);
    if (p.linkedin) contactLinks.push(`<a href="${p.linkedin}" target="_blank" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--accent-blue); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">💼 LinkedIn</a>`);
    if (p.github) contactLinks.push(`<a href="${p.github}" target="_blank" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--text-secondary); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">💻 GitHub</a>`);

    openOverlay(`
      <div class="overlay-header">
        <span class="overlay-icon">🌙</span>
        <div class="overlay-title-block">
          <h2 class="overlay-title">Long Rest</h2>
          <div class="overlay-subtitle">Connect & Collaborate</div>
        </div>
      </div>
      
      <div class="overlay-section">
        <div class="overlay-section-title">D&D Definition</div>
        <div class="dnd-definition">
          <p>A long rest is a period of extended downtime, at least 8 hours long, during which a character regains all lost hit points and spent abilities.</p>
        </div>
      </div>
      
      <div class="overlay-section">
        <div class="overlay-section-title">About ${p.name || 'This Character'}</div>
        <p>${p.summary || 'No summary available.'}</p>
        ${p.currentStatus ? `<div style="margin-top: var(--spacing-md);"><strong>Status:</strong> ${p.currentStatus}</div>` : ''}
        ${p.currentCampaign ? `<div><strong>Current Focus:</strong> ${p.currentCampaign}</div>` : ''}
      </div>
      
      ${contactLinks.length ? `
        <div class="overlay-section" style="background: var(--light-bg); padding: var(--spacing-md); border-radius: var(--radius-md); margin-top: var(--spacing-lg);">
          <div class="overlay-section-title">Get In Touch</div>
          <div class="contact-options" style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; margin-top: var(--spacing-md);">
            ${contactLinks.join('')}
          </div>
        </div>
      ` : ''}
    `);
  });
}

// Print classic CV
function printClassicCV() {
  closeOverlay();
  const classicBtn = document.querySelector('.view-toggle-btn[data-view="classic"]');
  if (classicBtn) {
    classicBtn.click();
    setTimeout(() => {
      window.print();
    }, 500);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Removed dynamic height matching - now using fixed CSS height set once on init

// ============================================
// UPDATE HEADER FROM DATA (for share-link / creator views)
// ============================================
function updateHeaderFromData() {
  if (typeof characterData === 'undefined') return;
  const p = characterData.personal;
  if (!p) return;

  // Update character name
  const nameEl = document.querySelector('.character-name');
  if (nameEl && p.name) nameEl.textContent = p.name;

  // Update title tag
  if (p.name) document.title = document.title.replace(/^[^|]+/, p.name + ' ');

  // Update avatar — use extracted image, or show initials placeholder for generated pages
  const avatarImg = document.querySelector('.character-avatar img');
  const avatarPlaceholder = document.querySelector('.character-avatar .avatar-placeholder');
  if (characterData.avatarImage) {
    // Extracted image from PDF or uploaded image
    if (avatarImg) {
      avatarImg.src = characterData.avatarImage;
      avatarImg.alt = p.name || '';
      avatarImg.style.display = '';
    }
    if (avatarPlaceholder) avatarPlaceholder.style.display = 'none';
  } else if (window.__appDataSource && window.__appDataSource !== 'default') {
    // Generated/shared page with no image — show initials
    if (avatarImg) avatarImg.style.display = 'none';
    if (avatarPlaceholder && p.name) {
      const initials = p.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
      avatarPlaceholder.textContent = initials;
      avatarPlaceholder.style.display = 'flex';
    }
  } else if (avatarImg && p.avatar) {
    avatarImg.src = p.avatar;
    avatarImg.alt = p.name || '';
  }

  // ── Nav updates for generated pages ──
  const slug = window.__appDataSlug;
  const isGenerated = slug && window.__appDataSource && window.__appDataSource !== 'default';

  if (isGenerated) {
    const navLeft = document.querySelector('.navbar-left');

    // Propagate ?slug= to all nav links so navigation stays within this person's sheet
    document.querySelectorAll('.nav-link').forEach(link => {
      const text = link.textContent.trim();

      // Hide "Projects" (only relevant for the site owner)
      if (text === 'Projects') {
        link.style.display = 'none';
        return;
      }

      // Don't modify "Create Yours" — it should always go to the clean creator page
      if (text === 'Create Yours') return;

      // Append slug to the href
      const href = link.getAttribute('href');
      if (href && !href.includes('slug=')) {
        const separator = href.includes('?') ? '&' : '?';
        link.setAttribute('href', href + separator + 'slug=' + encodeURIComponent(slug));
      }
    });

    // Hide Media tab if there's no media content in the generated sheet
    const media = typeof mediaMentions !== 'undefined' ? mediaMentions : {};
    const hasMedia = (media.podcasts && media.podcasts.length) ||
                     (media.press && media.press.length) ||
                     (media.profiles && media.profiles.length);
    if (!hasMedia) {
      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.textContent.trim() === 'Media') link.style.display = 'none';
      });
    }

    // Prepend a "← Back to Buster" link as the first nav item
    if (navLeft && !document.getElementById('backToBusterLink')) {
      const backLink = document.createElement('a');
      backLink.id = 'backToBusterLink';
      backLink.href = 'index.html';
      backLink.className = 'nav-link back-to-owner';
      backLink.textContent = '\u2190 Back to Buster';
      navLeft.insertBefore(backLink, navLeft.firstChild);
    }
  }

  // Update class display
  const classDisplay = document.getElementById('classDisplay');
  if (classDisplay && characterData.classes && characterData.classes.length) {
    classDisplay.innerHTML = characterData.classes
      .map(c => `<span class="class-item" data-class="${c.id}">${c.name} ${c.level}</span>`)
      .join(' / ');
  }

  // Update character details
  const speciesEl = document.querySelector('.species');
  if (speciesEl && p.species) speciesEl.textContent = p.species;
  const bgEl = document.querySelector('.background');
  if (bgEl && p.background) bgEl.textContent = p.background;
  const alignEl = document.querySelector('.alignment');
  if (alignEl && p.alignment) alignEl.textContent = p.alignment;

  // Update ability scores
  if (characterData.abilities) {
    Object.entries(characterData.abilities).forEach(([key, ab]) => {
      const el = document.querySelector(`.ability-score[data-ability="${key}"]`);
      if (!el) return;
      const modEl = el.querySelector('.ability-modifier');
      const valEl = el.querySelector('.ability-value');
      if (modEl) {
        const sign = ab.modifier >= 0 ? '+' : '';
        modEl.textContent = `${sign}${ab.modifier}`;
        modEl.dataset.mod = ab.modifier;
      }
      if (valEl) valEl.textContent = ab.score;
    });
  }

  // Update core stats
  if (characterData.coreStats) {
    const cs = characterData.coreStats;
    const profEl = document.querySelector('.stat-box.proficiency .stat-value');
    if (profEl) { profEl.textContent = `+${cs.proficiencyBonus}`; profEl.dataset.mod = cs.proficiencyBonus; }
    const initEl = document.querySelector('.stat-box.initiative .stat-value');
    if (initEl) { initEl.textContent = `+${cs.initiative}`; initEl.dataset.mod = cs.initiative; }
    const acEl = document.querySelector('.stat-box.armor-class .stat-value');
    if (acEl) acEl.textContent = cs.armorClass;
    const spdEl = document.querySelector('.stat-box.speed .stat-value');
    if (spdEl) spdEl.innerHTML = `${cs.speed.replace(/\s*ft\.?/, '')}<span class="unit">ft.</span>`;
    const hpCur = document.querySelector('.hp-current');
    const hpMax = document.querySelector('.hp-max');
    const hpMeaning = document.querySelector('.hp-meaning');
    if (hpCur && cs.hitPoints) hpCur.textContent = cs.hitPoints.current;
    if (hpMax && cs.hitPoints) hpMax.textContent = cs.hitPoints.max;
    if (hpMeaning && cs.hitPoints) hpMeaning.textContent = cs.hitPoints.meaning;
  }

  // Update defenses
  const defList = document.querySelector('.defenses-box .dc-list');
  if (defList && characterData.defenses) {
    defList.innerHTML = characterData.defenses.map(d => `<span class="dc-item">${d.name}</span>`).join('');
  }
  // Update conditions
  const condList = document.querySelector('.conditions-box .dc-list');
  if (condList && characterData.conditions) {
    condList.innerHTML = characterData.conditions.map(c => `<span class="dc-item ${c.active ? 'active' : ''}">${c.name}</span>`).join('');
  }

  // Update saving throws
  if (characterData.abilities) {
    document.querySelectorAll('.save-item').forEach(el => {
      const key = el.dataset.save;
      const ab = characterData.abilities[key];
      if (!ab) return;
      const profBonus = characterData.coreStats ? characterData.coreStats.proficiencyBonus : 0;
      const mod = ab.saveProficient ? ab.modifier + profBonus : ab.modifier;
      const sign = mod >= 0 ? '+' : '';
      const modEl = el.querySelector('.save-mod');
      if (modEl) { modEl.textContent = `${sign}${mod}`; modEl.dataset.mod = mod; }
      if (ab.saveProficient) {
        el.classList.add('proficient');
        const marker = el.querySelector('.proficiency-marker');
        if (marker) marker.classList.add('filled');
      }
    });
  }

  // Update passive skills
  if (characterData.coreStats) {
    const ppEl = document.querySelector('.passive-skill[data-skill="perception"] .passive-value');
    if (ppEl) ppEl.textContent = characterData.coreStats.passivePerception;
    const piEl = document.querySelector('.passive-skill[data-skill="investigation"] .passive-value');
    if (piEl) piEl.textContent = characterData.coreStats.passiveInvestigation;
    const pisEl = document.querySelector('.passive-skill[data-skill="insight"] .passive-value');
    if (pisEl) pisEl.textContent = characterData.coreStats.passiveInsight;
  }

  // Update senses
  const sensesEl = document.querySelector('.senses-value');
  if (sensesEl && characterData.senses) {
    sensesEl.textContent = characterData.senses;
  }

  // Update proficiencies text using label-based selectors (more robust)
  if (characterData.proficiencies) {
    const profs = characterData.proficiencies;
    document.querySelectorAll('.prof-category').forEach(cat => {
      const label = cat.querySelector('.prof-label');
      const value = cat.querySelector('.prof-value');
      if (!label || !value) return;
      const labelText = label.textContent.trim().toUpperCase();
      if (labelText === 'ARMOR' && profs.armor) {
        value.textContent = profs.armor.length ? profs.armor.join(', ') : 'None';
      } else if (labelText === 'WEAPONS' && profs.weapons) {
        value.textContent = profs.weapons.length ? profs.weapons.join(', ') : 'None';
      } else if (labelText === 'TOOLS' && profs.tools) {
        value.textContent = profs.tools.length ? profs.tools.join(', ') : 'None';
      } else if (labelText === 'LANGUAGES' && profs.languages) {
        value.textContent = profs.languages.map(l => {
          // Handle both formats: {name: "Common", native: "English"} and {name: "English", native: "yes"}
          const displayName = l.native && l.native.length > 3 ? l.native : l.name;
          return `${displayName} (${l.proficiency})`;
        }).join(', ');
      }
    });
  }

  // Update contact bar
  const contactBar = document.querySelector('.contact-bar');
  if (contactBar && p) {
    const items = [];
    if (p.email) items.push(`<a href="mailto:${p.email}" class="contact-item"><span class="contact-icon">&#128231;</span><span class="contact-text">${p.email}</span></a>`);
    if (p.phone) items.push(`<a href="tel:${p.phone}" class="contact-item"><span class="contact-icon">&#128241;</span><span class="contact-text">${p.phone}</span></a>`);
    if (p.linkedin) items.push(`<a href="${p.linkedin}" target="_blank" class="contact-item"><span class="contact-icon">&#128188;</span><span class="contact-text">LinkedIn</span></a>`);
    if (p.github) items.push(`<a href="${p.github}" target="_blank" class="contact-item"><span class="contact-icon">&#128187;</span><span class="contact-text">GitHub</span></a>`);
    if (p.location) items.push(`<span class="contact-item location"><span class="contact-icon">&#128205;</span><span class="contact-text">${p.location}</span></span>`);
    if (items.length) contactBar.innerHTML = items.join('');
  }

  // Update navbar campaign status text
  const campaignNameEl = document.querySelector('.campaign-status .campaign-name');
  const campaignLabelEl = document.querySelector('.campaign-status .campaign-label');
  if (campaignNameEl) {
    // On index.html, show campaign name; on other pages, show level
    if (p.currentCampaign && campaignLabelEl && campaignLabelEl.textContent.includes('CAMPAIGN')) {
      campaignNameEl.textContent = p.currentCampaign;
    } else if (p.level && campaignLabelEl && campaignLabelEl.textContent.includes('LEVEL')) {
      campaignNameEl.textContent = p.level;
    }
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init, setupViewToggle, setupTabNavigation, updateHeaderFromData };
}
