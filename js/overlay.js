/* ============================================
   OVERLAY - Modal handling for descriptions
   ============================================ */

const overlayModal = document.getElementById('overlayModal');
const overlayBody = document.getElementById('overlayBody');
const overlayClose = document.getElementById('overlayClose');

// Open overlay with content
function openOverlay(content) {
  overlayBody.innerHTML = content;
  overlayModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Add rollable handlers to any rollable elements in overlay
  overlayBody.querySelectorAll('.rollable').forEach(el => {
    el.addEventListener('click', handleRollClick);
  });
}

// Close overlay
function closeOverlay() {
  overlayModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close button handler
overlayClose?.addEventListener('click', closeOverlay);

// Click outside to close
overlayModal?.addEventListener('click', (e) => {
  if (e.target === overlayModal) {
    closeOverlay();
  }
});

// ESC key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlayModal?.classList.contains('active')) {
    closeOverlay();
  }
});

// Generate Ability Score overlay content
function getAbilityOverlayContent(abilityKey) {
  const ability = characterData.abilities[abilityKey];
  const desc = abilityDescriptions[abilityKey];
  
  return `
    <div class="overlay-header">
      <span class="overlay-icon">${desc.icon}</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">${ability.name}</h2>
        <div class="overlay-subtitle">${ability.abbr} • Score: ${ability.score}</div>
      </div>
      <div class="overlay-modifier rollable" data-mod="${ability.modifier}" data-ability="${abilityKey}">
        ${ability.modifier >= 0 ? '+' : ''}${ability.modifier}
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">D&D Definition</div>
      <div class="dnd-definition">
        <p>${desc.dndDefinition}</p>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="cv-meaning">
        <div class="cv-meaning-title">${ability.cvMeaning}</div>
        <div class="cv-meaning-desc">${ability.cvDescription}</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Key Evidence</div>
      <ul class="evidence-list">
        ${ability.evidence.map(e => `
          <li class="evidence-item">
            <span class="evidence-bullet">•</span>
            <span class="evidence-text">${e}</span>
          </li>
        `).join('')}
      </ul>
    </div>
    
    ${ability.vouch ? `
      <div class="overlay-section">
        <div class="overlay-section-title">Vouch</div>
        <div class="overlay-vouch">
          <div class="overlay-vouch-text">"${ability.vouch.text}"</div>
          <div class="overlay-vouch-author">– ${ability.vouch.author}, ${ability.vouch.role}</div>
        </div>
      </div>
    ` : ''}
    
    <div class="overlay-section">
      <div class="overlay-section-title">Calculation</div>
      <div class="calculation">
        <div class="calc-row">
          <span class="calc-label">Base Score</span>
          <span class="calc-value">${ability.score}</span>
        </div>
        <div class="calc-row">
          <span class="calc-label">Modifier</span>
          <span class="calc-value">${ability.modifier >= 0 ? '+' : ''}${ability.modifier}</span>
        </div>
        <div class="calc-row">
          <span class="calc-label">Save Proficient</span>
          <span class="calc-value">${ability.saveProficient ? 'Yes (+3)' : 'No'}</span>
        </div>
      </div>
    </div>
    
    <button class="overlay-roll-btn" onclick="rollFromOverlay('${ability.abbr}', ${ability.modifier})">
      <span class="dice-emoji">🎲</span>
      Roll ${ability.abbr} Check
    </button>
  `;
}

// Generate Skill overlay content
function getSkillOverlayContent(skillKey) {
  const skill = characterData.skills.find(s => 
    s.name.toLowerCase().replace(/\s+/g, '') === skillKey
  );
  if (!skill) return '<p>Skill not found</p>';
  
  const desc = skillDescriptions[skillKey] || {};
  const ability = characterData.abilities[skill.ability];
  
  const profStatus = skill.expertise ? 'Expertise' : (skill.proficient ? 'Proficient' : 'Not Proficient');
  
  return `
    <div class="overlay-header">
      <span class="overlay-icon">${desc.icon || '📊'}</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">${skill.name}</h2>
        <div class="overlay-subtitle">${skill.ability.toUpperCase()} • ${profStatus}</div>
      </div>
      <div class="overlay-modifier rollable" data-mod="${skill.modifier}" data-skill="${skill.name}">
        ${skill.modifier >= 0 ? '+' : ''}${skill.modifier}
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">D&D Definition</div>
      <div class="dnd-definition">
        <p>${desc.dndDefinition || 'A skill check using ' + skill.ability.toUpperCase() + '.'}</p>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="cv-meaning">
        <div class="cv-meaning-title">${skill.cvMeaning || desc.cvMeaning || skill.name}</div>
        <div class="cv-meaning-desc">${desc.cvDescription || 'Professional application of this skill.'}</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Key Evidence</div>
      <ul class="evidence-list">
        ${(skill.evidence || desc.evidence || ['Demonstrated through work experience']).map(e => `
          <li class="evidence-item">
            <span class="evidence-bullet">•</span>
            <span class="evidence-text">${e}</span>
          </li>
        `).join('')}
      </ul>
    </div>
    
    ${skill.vouch ? `
      <div class="overlay-section">
        <div class="overlay-section-title">Vouch</div>
        <div class="overlay-vouch">
          <div class="overlay-vouch-text">"${skill.vouch.text}"</div>
          <div class="overlay-vouch-author">– ${skill.vouch.author}</div>
        </div>
      </div>
    ` : ''}
    
    <div class="overlay-section">
      <div class="overlay-section-title">Calculation</div>
      <div class="calculation">
        <div class="calc-row">
          <span class="calc-label">${skill.ability.toUpperCase()} Modifier</span>
          <span class="calc-value">+${ability.modifier}</span>
        </div>
        ${skill.proficient ? `
          <div class="calc-row">
            <span class="calc-label">Proficiency Bonus</span>
            <span class="calc-value">+${characterData.coreStats.proficiencyBonus}</span>
          </div>
        ` : ''}
        ${skill.expertise ? `
          <div class="calc-row">
            <span class="calc-label">Expertise Bonus</span>
            <span class="calc-value">+${characterData.coreStats.proficiencyBonus}</span>
          </div>
        ` : ''}
        <div class="calc-row total">
          <span class="calc-label">Total</span>
          <span class="calc-value">${skill.modifier >= 0 ? '+' : ''}${skill.modifier}</span>
        </div>
      </div>
    </div>
    
    <button class="overlay-roll-btn" onclick="rollFromOverlay('${skill.name}', ${skill.modifier})">
      <span class="dice-emoji">🎲</span>
      Roll ${skill.name} Check
    </button>
  `;
}

// Generate Class overlay content
function getClassOverlayContent(classKey) {
  const classData = characterData.classes.find(c => c.id === classKey);
  
  if (!classData) {
    // Check unleveled classes
    const unleveled = characterData.unleveldClasses.find(c => c.id === classKey);
    if (unleveled) {
      return `
        <div class="unleveled-class">
          <div class="overlay-header" style="opacity: 0.6;">
            <div class="overlay-title-block">
              <h2 class="overlay-title">${unleveled.name}</h2>
              <div class="overlay-subtitle">Primary: ${unleveled.primaryAbility}</div>
            </div>
          </div>
          
          <div class="overlay-section">
            <div class="overlay-section-title">Class Description</div>
            <div class="overlay-section-content">${unleveled.description}</div>
          </div>
          
          <div class="unleveled-message">
            ${unleveled.notYetMessage}
          </div>
        </div>
      `;
    }
    return '<p>Class not found</p>';
  }
  
  return `
    <div class="class-overlay-header">
      <h2 class="overlay-title">${classData.name}</h2>
      <div class="overlay-subtitle">Primary Ability: ${classData.primaryAbility}</div>
      <span class="class-level-badge">Level ${classData.level}</span>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Class Description</div>
      <div class="overlay-section-content">${classData.description}</div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">D&D Style</div>
      <div class="dnd-definition">
        <p>${classData.dndStyle}</p>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Class Features</div>
      <ul class="class-features-list">
        ${classData.features.map(f => `
          <li class="class-feature-item">
            <div class="class-feature-level">Level ${f.level}</div>
            <div class="class-feature-name">${f.name}</div>
            <div class="class-feature-desc">${f.desc}</div>
          </li>
        `).join('')}
      </ul>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Evidence</div>
      <ul class="evidence-list">
        ${classData.evidence.map(e => `
          <li class="evidence-item">
            <span class="evidence-bullet">•</span>
            <span class="evidence-text">${e}</span>
          </li>
        `).join('')}
      </ul>
    </div>
    
    ${classData.vouch ? `
      <div class="overlay-section">
        <div class="overlay-section-title">Vouch</div>
        <div class="overlay-vouch">
          <div class="overlay-vouch-text">"${classData.vouch.text}"</div>
          <div class="overlay-vouch-author">– ${classData.vouch.author}, ${classData.vouch.role}</div>
        </div>
      </div>
    ` : ''}
  `;
}

// Generate Alignment overlay content
function getAlignmentOverlayContent() {
  return `
    <div class="overlay-header">
      <span class="overlay-icon">${alignmentDescription.icon}</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">Chaotic Good</h2>
        <div class="overlay-subtitle">Alignment</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">D&D Definition</div>
      <div class="dnd-definition">
        <p>${alignmentDescription.dndDefinition}</p>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="cv-meaning">
        <div class="cv-meaning-title">${alignmentDescription.cvMeaning}</div>
        <div class="cv-meaning-desc">${alignmentDescription.cvDescription}</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">In Practice</div>
      <ul class="evidence-list">
        <li class="evidence-item">
          <span class="evidence-bullet">•</span>
          <span class="evidence-text">Will challenge established systems if they don't serve the greater good</span>
        </li>
        <li class="evidence-item">
          <span class="evidence-bullet">•</span>
          <span class="evidence-text">Believes in doing what's right, not what's easy or conventional</span>
        </li>
        <li class="evidence-item">
          <span class="evidence-bullet">•</span>
          <span class="evidence-text">Values freedom and flexibility over rules and hierarchy</span>
        </li>
        <li class="evidence-item">
          <span class="evidence-bullet">•</span>
          <span class="evidence-text">Makes decisions based on impact, not protocol</span>
        </li>
      </ul>
    </div>
  `;
}

// Generate Combat Stat overlay content
function getCombatStatOverlayContent(statKey) {
  const desc = combatStatDescriptions[statKey];
  const stats = characterData.coreStats;
  
  let value, title, subtitle;
  
  switch(statKey) {
    case 'proficiency':
      value = `+${stats.proficiencyBonus}`;
      title = 'Proficiency Bonus';
      subtitle = 'Level 7';
      break;
    case 'initiative':
      value = `+${stats.initiative}`;
      title = 'Initiative';
      subtitle = stats.initiativeBreakdown;
      break;
    case 'ac':
      value = stats.armorClass;
      title = 'Armor Class';
      subtitle = 'Light Armor';
      break;
    case 'speed':
      value = stats.speed;
      title = 'Speed';
      subtitle = 'Enhanced by Cunning Action';
      break;
    case 'hp':
      value = `${stats.hitPoints.current}/${stats.hitPoints.max}`;
      title = 'Hit Points';
      subtitle = stats.hitPoints.meaning;
      break;
    case 'heroic-inspiration':
      return getHeroicInspirationOverlayContent();
    default:
      return '<p>Stat not found</p>';
  }
  
  return `
    <div class="overlay-header">
      <span class="overlay-icon">${desc.icon}</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">${title}</h2>
        <div class="overlay-subtitle">${subtitle}</div>
      </div>
      <div class="overlay-modifier">${value}</div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">D&D Definition</div>
      <div class="dnd-definition">
        <p>${desc.dndDefinition}</p>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="cv-meaning">
        <div class="cv-meaning-title">${desc.cvMeaning}</div>
        <div class="cv-meaning-desc">${desc.cvDescription}</div>
      </div>
    </div>
    
    ${desc.breakdown ? `
      <div class="overlay-section">
        <div class="overlay-section-title">Calculation</div>
        <div class="calculation">
          <div class="calc-row">
            <span class="calc-label">Breakdown</span>
            <span class="calc-value">${desc.breakdown}</span>
          </div>
        </div>
      </div>
    ` : ''}
    
    ${statKey === 'initiative' ? `
      <button class="overlay-roll-btn" onclick="rollFromOverlay('Initiative', ${stats.initiative})">
        <span class="dice-emoji">🎲</span>
        Roll Initiative
      </button>
    ` : ''}
  `;
}

// Generate Saving Throw overlay content
function getSavingThrowOverlayContent(saveKey) {
  const ability = characterData.abilities[saveKey];
  const desc = savingThrowDescriptions[saveKey];
  const proficient = ability.saveProficient;
  const profBonus = characterData.coreStats.proficiencyBonus;
  const total = proficient ? ability.modifier + profBonus : ability.modifier;
  
  return `
    <div class="overlay-header">
      <span class="overlay-icon">${desc.icon}</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">${ability.name} Saving Throw</h2>
        <div class="overlay-subtitle">${proficient ? 'Proficient' : 'Not Proficient'}</div>
      </div>
      <div class="overlay-modifier rollable" data-mod="${total}" data-save="${saveKey}">
        ${total >= 0 ? '+' : ''}${total}
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">D&D Definition</div>
      <div class="dnd-definition">
        <p>${desc.dndDefinition}</p>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="cv-meaning">
        <div class="cv-meaning-title">${desc.cvMeaning}</div>
        <div class="cv-meaning-desc">${desc.cvDescription}</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Calculation</div>
      <div class="calculation">
        <div class="calc-row">
          <span class="calc-label">${ability.abbr} Modifier</span>
          <span class="calc-value">+${ability.modifier}</span>
        </div>
        ${proficient ? `
          <div class="calc-row">
            <span class="calc-label">Proficiency Bonus</span>
            <span class="calc-value">+${profBonus}</span>
          </div>
        ` : ''}
        <div class="calc-row total">
          <span class="calc-label">Total</span>
          <span class="calc-value">${total >= 0 ? '+' : ''}${total}</span>
        </div>
      </div>
    </div>
    
    <button class="overlay-roll-btn" onclick="rollFromOverlay('${ability.abbr} Save', ${total})">
      <span class="dice-emoji">🎲</span>
      Roll ${ability.abbr} Save
    </button>
  `;
}

// Generate Spell overlay content
function getSpellOverlayContent(spellName) {
  // Find spell in data
  const allSpells = [
    ...characterData.spells.cantrips,
    ...(characterData.spells.level1 || []),
    ...(characterData.spells.level2 || []),
    ...(characterData.spells.level3 || [])
  ];
  const spell = allSpells.find(s => s.name === spellName);
  const desc = spellDescriptions[spellName] || {};
  
  if (!spell) return '<p>Spell not found</p>';
  
  return `
    <div class="overlay-header">
      <span class="overlay-icon">${desc.icon || '✨'}</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">${spell.name}</h2>
        <div class="overlay-subtitle">${spell.castTime} • ${spell.range}</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Description</div>
      <div class="dnd-definition">
        <p>${spell.description}</p>
      </div>
    </div>
    
    ${desc.dndEquivalent ? `
      <div class="overlay-section">
        <div class="overlay-section-title">D&D Equivalent</div>
        <div class="overlay-section-content">${desc.dndEquivalent}</div>
      </div>
    ` : ''}
    
    <div class="overlay-section">
      <div class="cv-meaning">
        <div class="cv-meaning-title">${desc.cvMeaning || 'Professional Application'}</div>
        <div class="cv-meaning-desc">${desc.cvDescription || spell.description}</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Spell Details</div>
      <div class="calculation">
        <div class="calc-row">
          <span class="calc-label">Cast Time</span>
          <span class="calc-value">${spell.castTime}</span>
        </div>
        <div class="calc-row">
          <span class="calc-label">Range</span>
          <span class="calc-value">${spell.range}</span>
        </div>
        ${spell.slots ? `
          <div class="calc-row">
            <span class="calc-label">Slots</span>
            <span class="calc-value">${spell.slots}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Generate Action overlay content
function getActionOverlayContent(actionName) {
  const action = characterData.actions.find(a => a.name === actionName);
  const desc = actionDescriptions[actionName] || {};
  
  if (!action) return '<p>Action not found</p>';
  
  const icon = action.type === 'Attack' ? '⚔️' : 
               action.type === 'Bonus Action' ? '⚡' : 
               action.type === 'Reaction' ? '🔄' : '🎬';
  
  return `
    <div class="overlay-header">
      <span class="overlay-icon">${desc.icon || icon}</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">${action.name}</h2>
        <div class="overlay-subtitle">${action.type}${action.uses ? ` • ${action.uses}` : ''}</div>
      </div>
      ${action.attackBonus !== undefined ? `
        <div class="overlay-modifier rollable" data-mod="${action.attackBonus}">
          +${action.attackBonus}
        </div>
      ` : ''}
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Description</div>
      <div class="dnd-definition">
        <p>${action.description}</p>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="cv-meaning">
        <div class="cv-meaning-title">${desc.cvMeaning || 'Professional Application'}</div>
        <div class="cv-meaning-desc">${desc.cvDescription || action.description}</div>
      </div>
    </div>
    
    ${action.attackBonus !== undefined ? `
      <div class="overlay-section">
        <div class="overlay-section-title">Attack Details</div>
        <div class="calculation">
          <div class="calc-row">
            <span class="calc-label">Attack Bonus</span>
            <span class="calc-value">+${action.attackBonus}</span>
          </div>
          <div class="calc-row">
            <span class="calc-label">Damage</span>
            <span class="calc-value">${action.damage} ${action.damageType}</span>
          </div>
          ${action.range ? `
            <div class="calc-row">
              <span class="calc-label">Range</span>
              <span class="calc-value">${action.range}</span>
            </div>
          ` : ''}
        </div>
      </div>
      
      <button class="overlay-roll-btn" onclick="rollFromOverlay('${action.name}', ${action.attackBonus})">
        <span class="dice-emoji">🎲</span>
        Roll to Hit
      </button>
    ` : ''}
    
    ${action.effect ? `
      <div class="overlay-section">
        <div class="overlay-section-title">Effect</div>
        <div class="overlay-section-content">${action.effect}</div>
      </div>
    ` : ''}
    
    ${action.recharge ? `
      <div class="overlay-section">
        <div class="overlay-section-title">Recharge</div>
        <div class="overlay-section-content">${action.recharge}</div>
      </div>
    ` : ''}
  `;
}

// Generate Defenses overlay content
function getDefensesOverlayContent() {
  const defenses = characterData.defenses;
  
  return `
    <div class="overlay-header">
      <span class="overlay-icon">🛡️</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">Defenses</h2>
        <div class="overlay-subtitle">Protective Traits</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Active Defenses</div>
      ${defenses.map(d => {
        const desc = defenseDescriptions[d.name.toLowerCase().replace(/\s+/g, '-')] || {};
        return `
          <div class="defense-item">
            <div class="defense-header">
              <span class="defense-icon">${desc.icon || '🛡️'}</span>
              <span class="defense-name">${d.name}</span>
            </div>
            <div class="defense-desc">${d.description}</div>
            ${desc.cvDescription ? `<div class="defense-cv">${desc.cvDescription}</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Generate Heroic Inspiration overlay content
function getHeroicInspirationOverlayContent() {
  return `
    <div class="overlay-header">
      <span class="overlay-icon">✦</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">Heroic Inspiration</h2>
        <div class="overlay-subtitle">What kind of events inspire you</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">D&D Definition</div>
      <div class="dnd-definition">
        <p>Your DM can reward you with Inspiration when you do something especially clever, creative, or in character—like solving a puzzle in an unexpected way, or staying true to your ideals in a tough spot. When you have Inspiration, you can spend it to give yourself advantage on one attack roll, saving throw, or ability check.</p>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Background</div>
      <p class="heroic-inspiration-background">Entertainer turned Folk Hero — from stage and performance into building communities, platforms, and ventures for a better world.</p>
    </div>
    
    <div class="overlay-section overlay-section-inspiration">
      <div class="cv-meaning cv-meaning-inspiration">
        <h3 class="cv-meaning-title">What inspires me</h3>
        <div class="cv-meaning-desc">
          <p>I get that same “advantage” when I’m around the cutting edge of any field—tech, art, philosophy, or economic theory—or when I’m in conversation with people who want to change the world for the better and we’re actually vibing. Good craftsmanship does it too, whether it’s great food or anything someone makes with care. So does someone rebelling with a cause, or discussing and realizing visions of a better world. I’m inspired when humans organize and come together in a beautiful way: in culture, in a city building something, or in rebellion. And simply when something good is being done.</p>
          <p>When I have inspiration from any of that, I bring it into the next pitch, the next conversation, or the next build.</p>
        </div>
      </div>
    </div>
  `;
}

// Generate Conditions overlay content
function getConditionsOverlayContent() {
  const conditions = characterData.conditions;
  
  return `
    <div class="overlay-header">
      <span class="overlay-icon">✨</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">Conditions</h2>
        <div class="overlay-subtitle">Active Effects</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">Active Conditions</div>
      ${conditions.map(c => {
        const desc = conditionDescriptions[c.name.toLowerCase().replace(/\s+/g, '-')] || {};
        return `
          <div class="condition-item ${c.active ? 'active' : ''}">
            <div class="condition-header">
              <span class="condition-icon">${desc.icon || '✨'}</span>
              <span class="condition-name">${c.name}</span>
              ${c.active ? '<span class="condition-active-badge">Active</span>' : ''}
            </div>
            <div class="condition-desc">${c.description}</div>
            ${desc.cvDescription ? `<div class="condition-cv">${desc.cvDescription}</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Generate Campaign Status overlay content
function getCampaignStatusOverlayContent() {
  // Check if this is the Energy Hardtech Exploration campaign
  const campaignStatusEl = document.querySelector('.campaign-status .campaign-name');
  const campaignName = campaignStatusEl ? campaignStatusEl.textContent.trim() : '';
  
  // Check if we're on the index/character sheet page
  const isIndexPage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname.endsWith('/') ||
                      window.location.pathname === '/Users/busterfranken/Personal-page/index.html' ||
                      !window.location.pathname.includes('.html');
  
  // Show Energy Hardtech content if on index page or if campaign name matches
  if (isIndexPage || campaignName === 'Energy Hardtech Exploration' || campaignName.includes('Energy')) {
    return `
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
    `;
  } else {
    // Generic contact overlay for other pages
    return `
      <div class="overlay-header">
        <h2>📬 Get In Touch</h2>
      </div>
      <div class="overlay-body">
        <div class="overlay-section">
          <p>Interested in connecting or discussing opportunities? I'm always open to interesting conversations and new adventures!</p>
        </div>
        <div class="overlay-section" style="background: var(--light-bg); padding: var(--spacing-md); border-radius: var(--radius-md); margin-top: var(--spacing-lg);">
          <div class="contact-options" style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; margin-top: var(--spacing-md);">
            <a href="mailto:busterfranken@gmail.com" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--primary-red); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">
              📧 Email Me
            </a>
            <a href="https://linkedin.com/in/buster-franken" target="_blank" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--accent-blue); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">
              💼 LinkedIn
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

// Roll from overlay button
function rollFromOverlay(name, modifier) {
  closeOverlay();
  setTimeout(() => {
    rollDice(name, modifier);
  }, 300);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    openOverlay, 
    closeOverlay, 
    getAbilityOverlayContent, 
    getSkillOverlayContent, 
    getClassOverlayContent,
    getAlignmentOverlayContent,
    getCombatStatOverlayContent,
    getSavingThrowOverlayContent,
    getSpellOverlayContent,
    getActionOverlayContent,
    getDefensesOverlayContent,
    getConditionsOverlayContent,
    getCampaignStatusOverlayContent,
    getHeroicInspirationOverlayContent
  };
}
