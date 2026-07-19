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
  setupMobileAccordions();
  updateSheetZoom();
  window.addEventListener('resize', debounce(updateSheetZoom, 150));

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
  const classicBtn = document.querySelector('.view-toggle-btn[data-view="classic"]');
  
  // Hide Classic CV button for generated pages (not Buster's default page)
  if (window.__appDataSource !== 'default' && classicBtn) {
    classicBtn.style.display = 'none';
    // Also hide the classic view container and the mobile quick-bar shortcut
    if (classicView) classicView.style.display = 'none';
    const qbClassic = document.getElementById('qbClassic');
    if (qbClassic) qbClassic.style.display = 'none';
  }
  
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
  
  // Load saved preference (only for default pages)
  if (window.__appDataSource === 'default') {
    const savedView = localStorage.getItem('preferredView');
    if (savedView) {
      const btn = document.querySelector(`.view-toggle-btn[data-view="${savedView}"]`);
      if (btn) btn.click();
    }
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

  // Generated sheets may lack any of these fields — every preview is
  // computed defensively and simply skipped when its data is missing.
  const sgn = n => `${n >= 0 ? '+' : ''}${n}`;
  const pb = (d.coreStats && d.coreStats.proficiencyBonus != null) ? d.coreStats.proficiencyBonus : 0;
  const profSaves = Object.values(d.abilities || {}).filter(a => a && a.saveProficient)
    .map(a => `${a.abbr || ''} ${sgn((a.modifier || 0) + pb)}`).join(' · ');
  if (profSaves) set('Saving Throws', profSaves);

  const skills = Array.isArray(d.skills) ? d.skills : [];
  if (skills.length) {
    const topSkills = [...skills].sort((a, b) => (b.modifier || 0) - (a.modifier || 0)).slice(0, 2)
      .map(s => `${s.name} ${sgn(s.modifier || 0)}`).join(' · ') + ' …';
    set('Skills', topSkills);
  }

  const actions = Array.isArray(d.actions) ? d.actions : [];
  const attacks = actions.filter(a => a.attackBonus != null);
  const nonAttacks = actions.length - attacks.length;
  if (attacks.length) {
    set('Actions', `${attacks[0].name} +${attacks[0].attackBonus} · ${attacks.length} attacks, ${nonAttacks} moves`);
  }

  // d.spells is {spellcastingAbility, spellSaveDC, spellAttackBonus, cantrips[],
  // level1[], level2[], level3[]} — not a flat array — mirrors the existing
  // static .spell-header text ("Spellcasting: CHA / Save DC: 15 / Spell Attack: +7").
  if (d.spells && d.spells.spellcastingAbility != null && d.spells.spellSaveDC != null && d.spells.spellAttackBonus != null) {
    set('Spells', `${String(d.spells.spellcastingAbility).toUpperCase()} · save DC ${d.spells.spellSaveDC} · attack +${d.spells.spellAttackBonus}`);
  }

  // "ideas are weightless" lives in the existing static .inventory-header markup,
  // not in characterData — read it from the DOM rather than hardcoding a second
  // copy of the same copy that could drift out of sync.
  const weightNote = document.querySelector('.inventory-header > span > span');
  set('Inventory', weightNote ? weightNote.textContent : `${(d.inventory || []).length} items`);
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

      if (typeof getCampaignStatusOverlayContent === 'function') {
        openOverlay(getCampaignStatusOverlayContent());
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

// Generic element overlay content — fallback used by the bottom [data-element]
// handler in setupClickableElements(). Every other key here (hp/ac/initiative/
// speed/proficiency/defenses/conditions) also has its own dedicated function
// in js/overlay.js that always wins first, so in the current UI only
// 'background' (the header's "Entrepreneur" pill) actually reaches this path;
// the rest are kept as a defensive fallback, restyled the same way.
function getElementOverlayContent(element) {
  let info;

  if (window.__appDataSource === 'default') {
    // Owner page: copy-final content, identical to the static site's main.js.
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
    info = elementInfo[element];
  } else {
    // Generated sheets: build the same {title, sub, badge?, blurb?, evidence}
    // shape from characterData — every field access guarded (generated data
    // may lack any of these).
    const cs = (typeof characterData !== 'undefined' && characterData.coreStats) ? characterData.coreStats : {};
    const p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
    const bg = (typeof characterData !== 'undefined' && characterData.background) ? characterData.background : {};
    const defs = (typeof characterData !== 'undefined' && characterData.defenses) ? characterData.defenses : [];
    const conds = (typeof characterData !== 'undefined' && characterData.conditions) ? characterData.conditions : [];

    const dynamicInfo = {
      'hp': {
        title: 'Hit Points',
        sub: (cs.hitPoints && cs.hitPoints.meaning) || 'Resilience',
        blurb: 'Your life force in D&D represents your ability to withstand damage.',
        evidence: [
          cs.hitPoints ? `Current: ${cs.hitPoints.current} / Max: ${cs.hitPoints.max}` : '',
          'Capacity to absorb challenges and keep going',
          cs.hitDice ? `Hit Dice: ${cs.hitDice}` : ''
        ].filter(Boolean)
      },
      'ac': {
        title: 'Armor Class',
        sub: 'Professional Defense',
        blurb: 'How hard you are to hit in combat. Represents your defenses.',
        evidence: [
          cs.armorClass != null ? `AC ${cs.armorClass}` : '',
          cs.armorClassExplanation || 'Professional network and experience provide protection'
        ].filter(Boolean)
      },
      'initiative': {
        title: 'Initiative',
        sub: 'Responsiveness',
        blurb: 'How quickly you can react and act in combat situations.',
        evidence: [
          cs.initiative !== undefined ? `+${cs.initiative} initiative modifier` : '',
          cs.initiativeBreakdown || 'How quickly you respond to opportunities'
        ].filter(Boolean)
      },
      'speed': {
        title: 'Speed',
        sub: 'Execution Velocity',
        blurb: 'How far you can move in a single turn.',
        evidence: [
          cs.speed ? `Speed: ${cs.speed}` : '',
          cs.speedExplanation || 'Pace of career movement and adaptability'
        ].filter(Boolean)
      },
      'proficiency': {
        title: 'Proficiency Bonus',
        sub: 'Experience Level',
        blurb: 'Reflects your overall experience and training level.',
        evidence: [
          cs.proficiencyBonus != null ? `+${cs.proficiencyBonus} proficiency bonus` : '',
          p.level ? `Character Level ${p.level}` : '',
          'Added to skills, saves, and attacks where proficient'
        ].filter(Boolean)
      },
      'background': {
        title: bg.name || p.background || 'Background',
        sub: 'Background',
        badge: 'BG',
        blurb: (bg.characteristics && bg.characteristics.backgroundStory) ||
               (bg.template ? `Based on the ${bg.template} template.` : 'Origin story and formative experiences.'),
        evidence: [
          bg.characteristics && bg.characteristics.origin ? `Origin: ${bg.characteristics.origin}` : '',
          bg.characteristics && bg.characteristics.firstGig ? `First Gig: ${bg.characteristics.firstGig}` : ''
        ].filter(Boolean)
      },
      'defenses': {
        title: 'Defenses',
        sub: 'Professional Protections',
        blurb: 'Protective traits that provide advantages in difficult situations.',
        evidence: defs.length ? defs.map(d => `${d.name || ''}${d.description ? ' — ' + d.description : ''}`) : ['No specific defenses listed']
      },
      'conditions': {
        title: 'Conditions',
        sub: 'Active Buffs',
        blurb: 'Active effects that influence your capabilities.',
        evidence: conds.length ? conds.map(c => `${c.name || ''}${c.active ? ' (Active)' : ''}${c.description ? ' — ' + c.description : ''}`) : ['No active conditions']
      }
    };
    info = dynamicInfo[element];
  }

  if (!info) {
    info = {
      title: element,
      sub: 'Professional Context',
      evidence: ['Click for more details']
    };
  }
  // Never render an empty "Key Evidence" section (generated data may filter to none).
  if (info.evidence && !info.evidence.length) info = { ...info, evidence: undefined };

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
  const longRestBtn = document.getElementById('longRestBtn') || document.querySelector('.long-rest');

  shortRestBtn?.addEventListener('click', () => {
    if (window.__appDataSource === 'default') {
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
    } else {
      // Generated sheets: interests & fun facts from characterData.extras,
      // restyled to the same ov-head/ov-body glyph template.
      const extras = (typeof characterData !== 'undefined' && characterData.extras) ? characterData.extras : {};
      const funFacts = extras.funFacts || [];
      const interests = extras.interests || [];
      openOverlay(`
        <div class="ov-head">
          <span class="ov-title">Short Rest</span>
          <span class="ov-sub">Interests & Fun Facts</span>
          <span class="ov-badge">✦</span>
          <span class="ov-close-x" onclick="closeOverlay()">✕</span>
        </div>
        <div class="ov-body">
          <div class="ov-main">
            <div class="ov-blurb">A short rest is a period of at least 1 hour during which a character does nothing more strenuous than reading, talking, eating, or standing watch.</div>
            ${interests.length ? `
              <div class="ov-evidence-title">Interests</div>
              ${interests.map(i => `<div class="ov-evidence-row">◆ ${i}</div>`).join('')}
            ` : ''}
            ${funFacts.length ? `
              <div class="ov-evidence-title">Fun Facts</div>
              ${funFacts.map(fact => `<div class="ov-evidence-row">✦ ${fact}</div>`).join('')}
            ` : ''}
          </div>
        </div>
      `);
    }
  });

  // Long Rest = Day Off Activities. Same treatment; glyph swap follows the
  // brief's Step 5 mapping exactly (party/community -> ✦, sauna/spa -> ❖,
  // nature -> ◆, nightlife/culture -> ◇, art/passion projects -> ✦,
  // psychedelics -> ☾, email -> ✉, LinkedIn -> ❖, download CV -> ❖).
  // Contact CTAs use .ov-roll-btn (solid, Email) and .ov-outline-btn (gold
  // outline, LinkedIn/Download CV) instead of the old inline
  // var(--primary-red)/var(--accent-blue) styles.
  longRestBtn?.addEventListener('click', () => {
    if (window.__appDataSource === 'default') {
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
    } else {
      // Generated sheets: about + contact links from characterData.personal,
      // using the redesign's .ov-roll-btn / .ov-outline-btn CTAs.
      const p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
      const contactLinks = [];
      if (p.email) contactLinks.push(`<a href="mailto:${p.email}?subject=Let's Connect!" class="ov-roll-btn">✉ Email</a>`);
      if (p.linkedin) contactLinks.push(`<a href="${p.linkedin}" target="_blank" class="ov-outline-btn">❖ LinkedIn</a>`);
      if (p.github) contactLinks.push(`<a href="${p.github}" target="_blank" class="ov-outline-btn">❖ GitHub</a>`);
      openOverlay(`
        <div class="ov-head">
          <span class="ov-title">Long Rest</span>
          <span class="ov-sub">Connect & Collaborate</span>
          <span class="ov-badge">☾</span>
          <span class="ov-close-x" onclick="closeOverlay()">✕</span>
        </div>
        <div class="ov-body">
          <div class="ov-main">
            <div class="ov-blurb">A long rest is a period of extended downtime, at least 8 hours long, during which a character regains all lost hit points and spent abilities.</div>
            ${(p.summary || p.currentStatus || p.currentCampaign) ? `
              <div class="ov-evidence-title">About ${p.name || 'This Character'}</div>
              ${p.summary ? `<div class="ov-evidence-row">◆ ${p.summary}</div>` : ''}
              ${p.currentStatus ? `<div class="ov-evidence-row">✦ <strong>Status:</strong> ${p.currentStatus}</div>` : ''}
              ${p.currentCampaign ? `<div class="ov-evidence-row">❖ <strong>Current Focus:</strong> ${p.currentCampaign}</div>` : ''}
            ` : ''}
            ${contactLinks.length ? `
              <div class="ov-evidence-title">Get In Touch</div>
              ${contactLinks.join('')}
            ` : ''}
          </div>
        </div>
      `);
    }
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

// Fixed 1.1× sheet zoom with desk margins kept (spec 2026-07-19).
// clientWidth excludes the scrollbar, so the ease-down clamp between
// 1248-1373px never introduces horizontal scroll; ≤1248px → 1 (unchanged).
function updateSheetZoom() {
  const z = Math.min(1.1, Math.max(1, document.documentElement.clientWidth / 1248));
  document.documentElement.style.setProperty('--sheet-zoom', z);
}

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
  // Owner page (default data.js): the static markup already IS the rendered
  // state — leave the DOM untouched so it stays identical to the static site.
  // Everything below only applies to externally loaded (generated) sheets.
  if (window.__appDataSource === 'default') return;
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

  // ── Hide example banner for generated pages ──
  const exampleBanner = document.getElementById('exampleBanner');
  if (exampleBanner && window.__appDataSource !== 'default') {
    exampleBanner.style.display = 'none';
  }

  // ── Owner-specific flavor doesn't apply to generated sheets ──
  // The handwritten margin notes ("the money-maker", "still full HP!" …)
  // reference the owner's own data; hide them on generated pages.
  document.querySelectorAll('.margin-note').forEach(el => { el.style.display = 'none'; });

  // Level banner under the avatar (static "Level 7" in the markup)
  const levelBanner = document.querySelector('.level-banner');
  if (levelBanner && p.level != null) levelBanner.textContent = `Level ${p.level}`;

  // ── Nav updates for generated pages ──
  const slug = window.__appDataSlug;
  const isGenerated = slug && window.__appDataSource && window.__appDataSource !== 'default';

  if (isGenerated) {
    const navLeft = document.querySelector('.navbar-left');

    // Propagate ?slug= to all nav links so navigation stays within this person's sheet
    document.querySelectorAll('.nav-link').forEach(link => {
      const text = link.textContent.trim();

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
      .map(c => `<span class="class-item" data-class="${c.id || ''}">${c.name || ''}${c.level != null ? ' ' + c.level : ''}</span>`)
      .join(' <span class="class-sep">/</span> ');
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
    if (profEl && cs.proficiencyBonus != null) { profEl.textContent = `+${cs.proficiencyBonus}`; profEl.dataset.mod = cs.proficiencyBonus; }
    const initEl = document.querySelector('.stat-box.initiative .stat-value');
    if (initEl && cs.initiative != null) { initEl.textContent = `+${cs.initiative}`; initEl.dataset.mod = cs.initiative; }
    const acEl = document.querySelector('.stat-box.armor-class .stat-value');
    if (acEl && cs.armorClass != null) acEl.textContent = cs.armorClass;
    const spdEl = document.querySelector('.stat-box.speed .stat-value');
    if (spdEl && cs.speed) spdEl.innerHTML = `${String(cs.speed).replace(/\s*ft\.?/, '')}<span class="unit">ft.</span>`;
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

  // Update the static Spells-tab header (markup ships the owner's values)
  if (characterData.spells) {
    const sp = characterData.spells;
    const headParts = document.querySelectorAll('.spell-header > span');
    if (headParts[0] && sp.spellcastingAbility) {
      const inner = headParts[0].querySelector('span');
      if (inner) inner.textContent = String(sp.spellcastingAbility).toUpperCase();
    }
    if (headParts[1] && sp.spellSaveDC != null) {
      const dc = headParts[1].querySelector('.rollable');
      if (dc) { dc.textContent = sp.spellSaveDC; dc.dataset.mod = sp.spellSaveDC; }
    }
    if (headParts[2] && sp.spellAttackBonus != null) {
      const atk = headParts[2].querySelector('.rollable');
      if (atk) { atk.textContent = `+${sp.spellAttackBonus}`; atk.dataset.mod = sp.spellAttackBonus; }
    }
  }

  // Update the static Inventory-tab weight note (owner joke copy in markup)
  const weightNoteEl = document.querySelector('.inventory-header > span > span');
  if (weightNoteEl) weightNoteEl.textContent = `${(characterData.inventory || []).length} items`;

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

  // Update contact bar — redesign format (glyph-prefixed .contact-item links)
  const contactBar = document.querySelector('.contact-bar');
  if (contactBar && p) {
    const items = [];
    if (p.email) items.push(`<a href="mailto:${p.email}" class="contact-item">✉ ${p.email}</a>`);
    if (p.phone) items.push(`<a href="tel:${String(p.phone).replace(/\s+/g, '')}" class="contact-item">❖ ${p.phone}</a>`);
    if (p.linkedin) items.push(`<a href="${p.linkedin}" target="_blank" class="contact-item">❖ LinkedIn</a>`);
    if (p.github) items.push(`<a href="${p.github}" target="_blank" class="contact-item">❖ GitHub</a>`);
    if (p.location) items.push(`<span class="contact-item location">❖ ${p.location}</span>`);
    if (items.length) contactBar.innerHTML = items.join('\n      ');
  }

  // Update navbar campaign status text
  const campaignNameEl = document.querySelector('.campaign-status .campaign-name');
  const campaignLabelEl = document.querySelector('.campaign-status .campaign-label');
  if (campaignNameEl) {
    // On index.html, show campaign name; on other pages, show level
    if (p.currentCampaign && campaignLabelEl && campaignLabelEl.textContent.toUpperCase().includes('CAMPAIGN')) {
      campaignNameEl.textContent = p.currentCampaign;
    } else if (p.level && campaignLabelEl && campaignLabelEl.textContent.toUpperCase().includes('LEVEL')) {
      campaignNameEl.textContent = p.level;
    } else if (p.currentStatus && campaignLabelEl && campaignLabelEl.textContent.toUpperCase().includes('STATUS')) {
      campaignNameEl.textContent = p.currentStatus;
    }
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init, setupViewToggle, setupTabNavigation, updateHeaderFromData };
}
