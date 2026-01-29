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
        // Fallback: show custom content directly
        openOverlay(`
          <div class="overlay-header">
            <h2>🎯 Current Campaign: Energy Hardtech Exploration</h2>
          </div>
          <div class="overlay-body">
            <div class="overlay-section">
              <h3>What I'm Looking For</h3>
              <p>I'm currently exploring new startup opportunities and open to exciting ventures in:</p>
              <ul style="margin: var(--spacing-md) 0; padding-left: var(--spacing-lg);">
                <li><strong>Energy & Hardtech:</strong> Particularly interested in energy solutions, hardtech innovations, and deep tech applications</li>
                <li><strong>Product & Growth Roles:</strong> Open to joining as a Product Owner or in a Growth role at an exciting startup</li>
                <li><strong>Deep/Hardtech Ideas:</strong> Open to any compelling deep tech or hardtech concepts that solve real problems</li>
              </ul>
            </div>
            
            <div class="overlay-section">
              <h3>My Background</h3>
              <p>With my experience building FruitPunch AI from scratch to €45M in AI engineering work crowdsourced for impact organizations, raising €1M, and growing a community of 4500+ engineers, I bring:</p>
              <ul style="margin: var(--spacing-md) 0; padding-left: var(--spacing-lg);">
                <li>Product management expertise (500+ user and customer interviews conducted, experience design, A/B experiments)</li>
                <li>Growth and community building (4500+ members, 80+ partners)</li>
                <li>Fundraising and partnerships (€1M raised, Stanford, ESA, Greenpeace partnerships)</li>
                <li>Platform building and decision-making experience</li>
              </ul>
            </div>
            
            <div class="overlay-section" style="background: var(--light-bg); padding: var(--spacing-md); border-radius: var(--radius-md); margin-top: var(--spacing-lg);">
              <h3 style="margin-top: 0;">Get In Touch</h3>
              <p>Interested in discussing opportunities? Let's connect!</p>
              <div class="contact-options" style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; margin-top: var(--spacing-md);">
                <a href="mailto:busterfranken@gmail.com?subject=Energy Hardtech Opportunity" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--primary-red); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">
                  📧 Email Me
                </a>
                <a href="https://linkedin.com/in/buster-franken" target="_blank" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--accent-blue); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">
                  💼 LinkedIn
                </a>
              </div>
            </div>
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

// Generic element overlay content
function getElementOverlayContent(element) {
  const elementInfo = {
    'hp': {
      title: 'Hit Points',
      icon: '❤️',
      description: 'Your life force in D&D represents your ability to withstand damage.',
      cvMeaning: '€45M Crowdsourced Impact',
      evidence: [
        'Represents the €45M in AI engineering value crowdsourced',
        'Your capacity to absorb challenges and keep going',
        'Current: 45 / Max: 45 (fully healthy and ready for adventure)'
      ]
    },
    'ac': {
      title: 'Armor Class',
      icon: '🛡️',
      description: 'How hard you are to hit in combat. Represents your defenses.',
      cvMeaning: 'Network Protection',
      evidence: [
        'Your professional network provides protection',
        'Strong relationships deflect problems',
        'AC 14 represents solid but not impenetrable defenses'
      ]
    },
    'initiative': {
      title: 'Initiative',
      icon: '⚡',
      description: 'How quickly you can react and act in combat situations.',
      cvMeaning: 'First Mover Advantage',
      evidence: [
        'DEX (+4) + Alertness Feat (+4) = +8',
        'How quickly you can pivot and respond to opportunities',
        '+8 modifier means you almost always act first'
      ]
    },
    'speed': {
      title: 'Speed',
      icon: '🏃',
      description: 'How far you can move in a single turn.',
      cvMeaning: 'Execution Velocity',
      evidence: [
        '60 ft is double normal human speed',
        'Cunning Action: Dash as bonus action',
        'Represents willingness to move anywhere for the right opportunity'
      ]
    },
    'proficiency': {
      title: 'Proficiency Bonus',
      icon: '📊',
      description: 'Reflects your overall experience and training level.',
      cvMeaning: 'Experience Level',
      evidence: [
        '+3 bonus at Level 7',
        'Added to skills, saves, and attacks where proficient',
        '7 years of startup experience'
      ]
    },
    'background': {
      title: 'Background: Entrepreneur',
      icon: '🎭',
      description: 'Based on the Criminal background template - because entrepreneurs break into markets.',
      cvMeaning: 'Origin Story',
      evidence: [
        'Grew up in parents\' pawn shop',
        'Professional teen actor (first IKEA gig at 14)',
        'Made art until switching to engineering'
      ]
    },
    'defenses': {
      title: 'Defenses',
      icon: '🛡️',
      description: 'Protective traits that provide advantages in difficult situations.',
      cvMeaning: 'Market Protection',
      evidence: [
        'Resilient Network - 4500+ engineers, 80+ partners',
        'Pivot Ready - Multiple successful pivots',
        'Community Shield - Strong relationships protect against uncertainty'
      ]
    },
    'conditions': {
      title: 'Conditions',
      icon: '✨',
      description: 'Active effects that influence your capabilities.',
      cvMeaning: 'Active Buffs',
      evidence: [
        'Inspired - Advantage on impact-driven goals',
        'Alert - +4 initiative, can\'t be surprised',
        'Mission-Driven - Resistant to distractions'
      ]
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
// REST BUTTONS
// ============================================
function setupRestButtons() {
  // Short Rest = Daily/Weekly Activities
  const shortRestBtn = document.getElementById('shortRestBtn') || document.querySelector('.short-rest');
  shortRestBtn?.addEventListener('click', () => {
    openOverlay(`
      <div class="overlay-header">
        <span class="overlay-icon">⚡</span>
        <div class="overlay-title-block">
          <h2 class="overlay-title">Short Rest</h2>
          <div class="overlay-subtitle">Daily & Weekly Activities</div>
        </div>
      </div>
      
      <div class="overlay-section">
        <div class="overlay-section-title">D&D Definition</div>
        <div class="dnd-definition">
          <p>A short rest is a period of at least 1 hour during which a character does nothing more strenuous than reading, talking, eating, or standing watch.</p>
        </div>
      </div>
      
      <div class="overlay-section">
        <div class="overlay-section-title">What I Do Daily & Weekly</div>
        <ul class="evidence-list">
          <li class="evidence-item">
            <span class="evidence-bullet">💪</span>
            <span class="evidence-text"><strong>Fitness & Training:</strong> I love to work out and have done many sports. I go to the gym every day and am big into scientific lifting. I've been training since I was 17, and in the last 2 years I gained 12kg in muscle with this approach.</span>
          </li>
          <li class="evidence-item">
            <span class="evidence-bullet">🍳</span>
            <span class="evidence-text"><strong>Cooking:</strong> I love cooking—Arabic, Mediterranean, and modern fusion mostly. Think Ottolenghi style.</span>
          </li>
          <li class="evidence-item">
            <span class="evidence-bullet">☕</span>
            <span class="evidence-text"><strong>Foodie & Coffee Nerd:</strong> I'm a big foodie and coffee nerd. Ask me for my top recommendations in any city I've visited—I keep an extensive record in Google Maps.</span>
          </li>
        </ul>
      </div>
      
      <div class="overlay-section">
        <div class="overlay-section-title">General Interests</div>
        <ul class="evidence-list">
          <li class="evidence-item">
            <span class="evidence-bullet">🎨</span>
            <span class="evidence-text"><strong>Art:</strong> I'm into art—anything that is cutting edge really, culturally or technologically.</span>
          </li>
          <li class="evidence-item">
            <span class="evidence-bullet">📚</span>
            <span class="evidence-text"><strong>Political Economy, Philosophy & Sociology:</strong> I'm a nerd in these fields, always reading and refining my understanding. My Goodreads account is my trophy wall.</span>
          </li>
          <li class="evidence-item">
            <span class="evidence-bullet">👥</span>
            <span class="evidence-text"><strong>Meeting New People:</strong> I love meeting new people, am very social, and like to hear from very different backgrounds—that is what makes life rich.</span>
          </li>
        </ul>
      </div>
    `);
  });
  
  // Long Rest = Day Off Activities
  const longRestBtn = document.getElementById('longRestBtn') || document.querySelector('.long-rest');
  longRestBtn?.addEventListener('click', () => {
    openOverlay(`
      <div class="overlay-header">
        <span class="overlay-icon">🌙</span>
        <div class="overlay-title-block">
          <h2 class="overlay-title">Long Rest</h2>
          <div class="overlay-subtitle">Day Off Activities</div>
        </div>
      </div>
      
      <div class="overlay-section">
        <div class="overlay-section-title">D&D Definition</div>
        <div class="dnd-definition">
          <p>A long rest is a period of extended downtime, at least 8 hours long, during which a character regains all lost hit points and spent abilities.</p>
        </div>
      </div>
      
      <div class="overlay-section">
        <div class="overlay-section-title">What I Do With a Day Off</div>
        <ul class="evidence-list">
          <li class="evidence-item">
            <span class="evidence-bullet">🎉</span>
            <span class="evidence-text"><strong>Community Building:</strong> Organizing events for startup founders and friends, designing unique experiences they won't forget—from whisky tastings with food pairing to big parties, to D&D-themed NY parties where everyone competes in D&D skill-related party games to determine their skillset for the final quest, to boat trips with unique storytelling formats to get deep.</span>
          </li>
          <li class="evidence-item">
            <span class="evidence-bullet">🧖</span>
            <span class="evidence-text"><strong>Sauna & Spa:</strong> I love the sauna and going to the nude spa with friends.</span>
          </li>
          <li class="evidence-item">
            <span class="evidence-bullet">🏔️</span>
            <span class="evidence-text"><strong>Nature:</strong> Going into nature—hiking, swimming, climbing.</span>
          </li>
          <li class="evidence-item">
            <span class="evidence-bullet">🎵</span>
            <span class="evidence-text"><strong>Culture & Nightlife:</strong> Going raving, or to a museum exhibition.</span>
          </li>
          <li class="evidence-item">
            <span class="evidence-bullet">🎨</span>
            <span class="evidence-text"><strong>Passion Projects:</strong> Working on passion projects—art or tech.</span>
          </li>
          <li class="evidence-item">
            <span class="evidence-bullet">🧘</span>
            <span class="evidence-text"><strong>Psychedelics:</strong> Once in a while, doing a psychedelics trip.</span>
          </li>
        </ul>
      </div>
      
      <div class="overlay-section" style="background: var(--light-bg); padding: var(--spacing-md); border-radius: var(--radius-md); margin-top: var(--spacing-lg);">
        <div class="overlay-section-title">Want to Connect?</div>
        <div class="contact-options" style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; margin-top: var(--spacing-md);">
          <a href="mailto:${characterData.personal.email}?subject=Let's Connect!" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--primary-red); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">
            📧 Email Me
          </a>
          <a href="https://linkedin.com/in/buster-franken" target="_blank" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--accent-blue); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">
            💼 LinkedIn
          </a>
          <a href="Resume-Buster-short.pdf" download class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--text-secondary); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">
            📄 Download CV
          </a>
        </div>
      </div>
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

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init, setupViewToggle, setupTabNavigation };
}
