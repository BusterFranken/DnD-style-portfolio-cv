/* ============================================
   MAIN - Initialization and Event Handling
   ============================================ */

// Wait for DOM
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Load any saved data
  loadSavedData();
  
  // Render all dynamic content (only on pages that load render.js: index, projects)
  if (typeof initRender === 'function') {
    initRender();
  }
  
  // Setup event handlers
  setupNavbarMobile();
  setupViewToggle();
  setupTabNavigation();
  setupClickableElements();
  setupRollableElements();
  setupRestButtons();
  setupMobileAccordions();
  
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
  
  console.log('✦ Character sheet initialized!');
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
// MOBILE ACCORDIONS (≤740px)
// ============================================
// .acc-head buttons are static markup (index.html), one per mapped section-
// box/tab-panel/acc-group (see css/character-sheet.css's mobile block for the
// section-to-accordion mapping). Above 740px .acc-head is display:none and
// this is a no-op; ≤740px exactly one box is ever .acc-open at a time.
function setupMobileAccordions() {
  const mq = window.matchMedia('(max-width: 740px)');
  const heads = document.querySelectorAll('.acc-head');
  if (!heads.length) return;

  function collapseAll() {
    heads.forEach(h => {
      h.parentElement.classList.add('collapsed');
      h.parentElement.classList.remove('acc-open');
      h.setAttribute('aria-expanded', 'false');
      h.querySelector('.acc-chevron').textContent = '▸';
    });
  }

  function apply() {
    if (mq.matches) {
      collapseAll();
      fillAccordionPreviews();
    } else {
      heads.forEach(h => {
        h.parentElement.classList.remove('collapsed', 'acc-open');
      });
    }
  }

  heads.forEach(h => h.addEventListener('click', () => {
    if (!mq.matches) return;
    const box = h.parentElement;
    const wasOpen = box.classList.contains('acc-open');
    collapseAll();
    if (!wasOpen) {
      box.classList.remove('collapsed');
      box.classList.add('acc-open');
      h.setAttribute('aria-expanded', 'true');
      h.querySelector('.acc-chevron').textContent = '▾';
    }
  }));

  mq.addEventListener('change', apply);
  apply();
}

// Collapsed-bar preview text ("DEX +7 · WIS +6 · CHA +7", etc.) — display-
// only, derived from the same characterData the desktop tabs already render
// from. Property names/shapes match js/data.js exactly (d.spells is a level-
// grouped object, not a flat array; d.actions items carry attackBonus only on
// attacks; the Inventory blurb reuses the existing "Weight carried" copy
// already in the DOM rather than duplicating it as a second hardcoded string).
function fillAccordionPreviews() {
  const d = typeof characterData !== 'undefined' ? characterData : null;
  if (!d) return;

  // Query once and reuse for every set() call below, instead of re-querying
  // the whole document on each of the 5 calls.
  const heads = document.querySelectorAll('.acc-head');
  const set = (title, text) => {
    heads.forEach(h => {
      if (h.querySelector('.acc-title').textContent === title) {
        const preview = h.querySelector('.acc-preview');
        if (preview) preview.textContent = text;
      }
    });
  };

  const profSaves = Object.values(d.abilities).filter(a => a.saveProficient)
    .map(a => `${a.abbr} +${a.modifier + d.coreStats.proficiencyBonus}`).join(' · ');
  set('Saving Throws', profSaves);

  const topSkills = [...d.skills].sort((a, b) => b.modifier - a.modifier).slice(0, 2)
    .map(s => `${s.name} +${s.modifier}`).join(' · ') + ' …';
  set('Skills', topSkills);

  const attacks = d.actions.filter(a => a.attackBonus != null);
  const nonAttacks = d.actions.length - attacks.length;
  if (attacks.length) {
    set('Actions', `${attacks[0].name} +${attacks[0].attackBonus} · ${attacks.length} attacks, ${nonAttacks} moves`);
  }

  // d.spells is {spellcastingAbility, spellSaveDC, spellAttackBonus, cantrips[],
  // level1[], level2[], level3[]} — not a flat array — mirrors the existing
  // static .spell-header text ("Spellcasting: CHA / Save DC: 15 / Spell Attack: +7").
  set('Spells', `${d.spells.spellcastingAbility} · save DC ${d.spells.spellSaveDC} · attack +${d.spells.spellAttackBonus}`);

  // "ideas are weightless" lives in the existing static .inventory-header markup,
  // not in characterData — read it from the DOM rather than hardcoding a second
  // copy of the same copy that could drift out of sync.
  const weightNote = document.querySelector('.inventory-header > span > span');
  set('Inventory', weightNote ? weightNote.textContent : `${d.inventory.length} items`);
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
  
  // Campaign Status - handle first to prevent generic handler. The hardcoded
  // fallback that used to live here (old .overlay-header/emoji markup, only
  // reachable if getCampaignStatusOverlayContent were somehow undefined) is
  // dropped: js/overlay.js is always loaded before js/main.js on every page
  // (see index.html/campaigns.html/etc. script order), so the function is
  // always defined and that branch was dead code.
  document.querySelectorAll('.campaign-status.clickable').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openOverlay(getCampaignStatusOverlayContent());
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

// Generic element overlay content — fallback used by the bottom [data-element]
// handler in setupClickableElements(). Every other key here (hp/ac/initiative/
// speed/proficiency/defenses/conditions) also has its own dedicated function
// in js/overlay.js that always wins first, so in the current UI only
// 'background' (the header's "Entrepreneur" pill) actually reaches this path;
// the rest are kept as a defensive fallback, restyled the same way.
function getElementOverlayContent(element) {
  const elementInfo = {
    'hp': {
      title: 'Hit Points',
      sub: '€45M Crowdsourced Impact',
      evidence: [
        'Represents the €45M in AI engineering value crowdsourced',
        'Your capacity to absorb challenges and keep going',
        'Current: 45 / Max: 45 (fully healthy and ready for adventure)'
      ]
    },
    'ac': {
      title: 'Armor Class',
      sub: 'Network Protection',
      evidence: [
        'Your professional network provides protection',
        'Strong relationships deflect problems',
        'AC 14 represents solid but not impenetrable defenses'
      ]
    },
    'initiative': {
      title: 'Initiative',
      sub: 'First Mover Advantage',
      evidence: [
        'DEX (+4) + Alertness Feat (+4) = +8',
        'How quickly you can pivot and respond to opportunities',
        '+8 modifier means you almost always act first'
      ]
    },
    'speed': {
      title: 'Speed',
      sub: 'Execution Velocity',
      evidence: [
        '60 ft is double normal human speed',
        'Cunning Action: Dash as bonus action',
        'Represents willingness to move anywhere for the right opportunity'
      ]
    },
    'proficiency': {
      title: 'Proficiency Bonus',
      sub: 'Experience Level',
      evidence: [
        '+3 bonus at Level 7',
        'Added to skills, saves, and attacks where proficient',
        '7 years of startup experience'
      ]
    },
    // Copy synced verbatim to the prototype's OV.background (title/sub/badge/
    // blurb, no evidence — the prototype's `k` is absent for this key).
    'background': {
      title: 'Entrepreneur',
      sub: 'Background',
      badge: 'BG',
      blurb: "Grew up in the family pawn shop — learned to see value where others don't. Then: actor, security guard, teacher, engineer, founder."
    },
    'defenses': {
      title: 'Defenses',
      sub: 'Market Protection',
      evidence: [
        'Resilient Network - 4500+ engineers, 80+ partners',
        'Pivot Ready - Multiple successful pivots',
        'Community Shield - Strong relationships protect against uncertainty'
      ]
    },
    'conditions': {
      title: 'Conditions',
      sub: 'Active Buffs',
      evidence: [
        'Inspired - Advantage on impact-driven goals',
        'Alert - +4 initiative, can\'t be surprised',
        'Mission-Driven - Resistant to distractions'
      ]
    }
  };

  const info = elementInfo[element] || {
    title: element,
    sub: 'Professional Context',
    evidence: ['Click for more details']
  };

  return `
    <div class="ov-head">
      <span class="ov-title">${info.title}</span>
      <span class="ov-sub">${info.sub}</span>
      ${info.badge ? `<span class="ov-badge">${info.badge}</span>` : ''}
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        ${info.blurb ? `<div class="ov-blurb">${info.blurb}</div>` : ''}
        ${info.evidence ? `
          <div class="ov-evidence-title">Key Evidence</div>
          ${info.evidence.map(e => `<div class="ov-evidence-row">◆ ${e}</div>`).join('')}
        ` : ''}
      </div>
    </div>`;
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
// REST BUTTONS
// ============================================
function setupRestButtons() {
  // Short Rest = Daily/Weekly Activities. Content text unchanged from the
  // pre-redesign version — only the wrapper/bullet markup is restyled to the
  // ov-head/ov-body template, and the old pre-redesign emoji bullets were
  // swapped to glyphs (brief's Step 5 mapping covers the art/palette bullet
  // -> ✦; the other Short Rest bullets aren't in that mapping, so they reuse
  // the same small glyph set already established for Long Rest's mapped
  // bullets: fitness -> ✦, cooking -> ❖, coffee/foodie -> ◇, reading -> ◆,
  // people -> ❖).
  const shortRestBtn = document.getElementById('shortRestBtn') || document.querySelector('.short-rest');
  shortRestBtn?.addEventListener('click', () => {
    openOverlay(`
      <div class="ov-head">
        <span class="ov-title">Short Rest</span>
        <span class="ov-sub">Daily & Weekly Activities</span>
        <span class="ov-badge">✦</span>
        <span class="ov-close-x" onclick="closeOverlay()">✕</span>
      </div>
      <div class="ov-body">
        <div class="ov-main">
          <div class="ov-blurb">A short rest is a period of at least 1 hour during which a character does nothing more strenuous than reading, talking, eating, or standing watch.</div>

          <div class="ov-evidence-title">What I Do Daily & Weekly</div>
          <div class="ov-evidence-row">✦ <strong>Fitness & Training:</strong> I love to work out and have done many sports. I go to the gym every day and am big into scientific lifting. I've been training since I was 17, and in the last 2 years I gained 12kg in muscle with this approach.</div>
          <div class="ov-evidence-row">❖ <strong>Cooking:</strong> I love cooking—Arabic, Mediterranean, and modern fusion mostly. Think Ottolenghi style.</div>
          <div class="ov-evidence-row">◇ <strong>Foodie & Coffee Nerd:</strong> I'm a big foodie and coffee nerd. Ask me for my top recommendations in any city I've visited—I keep an extensive record in Google Maps.</div>

          <div class="ov-evidence-title">General Interests</div>
          <div class="ov-evidence-row">✦ <strong>Art:</strong> I'm into art—anything that is cutting edge really, culturally or technologically.</div>
          <div class="ov-evidence-row">◆ <strong>Political Economy, Philosophy & Sociology:</strong> I'm a nerd in these fields, always reading and refining my understanding. My Goodreads account is my trophy wall.</div>
          <div class="ov-evidence-row">❖ <strong>Meeting New People:</strong> I love meeting new people, am very social, and like to hear from very different backgrounds—that is what makes life rich.</div>
        </div>
      </div>
    `);
  });

  // Long Rest = Day Off Activities. Same treatment; glyph swap follows the
  // brief's Step 5 mapping exactly (party/community -> ✦, sauna/spa -> ❖,
  // nature -> ◆, nightlife/culture -> ◇, art/passion projects -> ✦,
  // psychedelics -> ☾, email -> ✉, LinkedIn -> ❖, download CV -> ❖).
  // Contact CTAs use .ov-roll-btn (solid, Email) and .ov-outline-btn (gold
  // outline, LinkedIn/Download CV) instead of the old inline
  // var(--primary-red)/var(--accent-blue) styles.
  const longRestBtn = document.getElementById('longRestBtn') || document.querySelector('.long-rest');
  longRestBtn?.addEventListener('click', () => {
    openOverlay(`
      <div class="ov-head">
        <span class="ov-title">Long Rest</span>
        <span class="ov-sub">Day Off Activities</span>
        <span class="ov-badge">☾</span>
        <span class="ov-close-x" onclick="closeOverlay()">✕</span>
      </div>
      <div class="ov-body">
        <div class="ov-main">
          <div class="ov-blurb">A long rest is a period of extended downtime, at least 8 hours long, during which a character regains all lost hit points and spent abilities.</div>

          <div class="ov-evidence-title">What I Do With a Day Off</div>
          <div class="ov-evidence-row">✦ <strong>Community Building:</strong> Organizing events for startup founders and friends, designing unique experiences they won't forget—from whisky tastings with food pairing to big parties, to D&D-themed NY parties where everyone competes in D&D skill-related party games to determine their skillset for the final quest, to boat trips with unique storytelling formats to get deep.</div>
          <div class="ov-evidence-row">❖ <strong>Sauna & Spa:</strong> I love the sauna and going to the nude spa with friends.</div>
          <div class="ov-evidence-row">◆ <strong>Nature:</strong> Going into nature—hiking, swimming, climbing.</div>
          <div class="ov-evidence-row">◇ <strong>Culture & Nightlife:</strong> Going raving, or to a museum exhibition.</div>
          <div class="ov-evidence-row">✦ <strong>Passion Projects:</strong> Working on passion projects—art or tech.</div>
          <div class="ov-evidence-row">☾ <strong>Psychedelics:</strong> Once in a while, doing a psychedelics trip.</div>

          <div class="ov-evidence-title">Want to Connect?</div>
          <a href="mailto:${characterData.personal.email}?subject=Let's Connect!" class="ov-roll-btn">✉ Email Me</a>
          <a href="https://linkedin.com/in/buster-franken" target="_blank" class="ov-outline-btn">❖ LinkedIn</a>
          <a href="Resume-Buster-short.pdf" download class="ov-outline-btn">❖ Download CV</a>
        </div>
      </div>
    `);
  });

  // Mobile quick bar (≤740px, index.html only): dispatches to the same
  // buttons/toggle above rather than duplicating their content/behavior.
  // #shortRestBtn/#longRestBtn live inside the ≤740px nav dropdown (hidden
  // until opened) and .view-toggle-btn is always in the DOM — a .click() on a
  // hidden (display:none only on the closed dropdown's ancestor, not on the
  // buttons themselves once open) element still fires its click handler.
  document.getElementById('qbShort')?.addEventListener('click', () => shortRestBtn?.click());
  document.getElementById('qbLong')?.addEventListener('click', () => longRestBtn?.click());
  document.getElementById('qbClassic')?.addEventListener('click', () => {
    document.querySelector('.view-toggle-btn[data-view="classic"]')?.click();
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

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init, setupViewToggle, setupTabNavigation };
}
