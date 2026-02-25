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
        <div class="cv-meaning-desc">${skill.cvMeaning ? (skill.evidence && skill.evidence.length ? skill.evidence[0] : 'Professional application of this skill.') : (desc.cvDescription || 'Professional application of this skill.')}</div>
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

// Generate Alignment overlay content — dynamic from characterData
function getAlignmentOverlayContent() {
  const p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
  const alignment = p.alignment || 'Unknown';
  const alignDesc = p.alignmentDescription || '';

  // Use D&D standard descriptions per alignment type
  const dndAlignments = {
    'Lawful Good': 'Lawful Good characters act with compassion and honor, following the rules and obeying authority when doing so leads to the greater good.',
    'Neutral Good': 'Neutral Good characters do the best they can to help others according to their needs, without bias for or against order.',
    'Chaotic Good': 'Chaotic Good characters do what is necessary to bring about change for the better, disdaining bureaucratic organizations that get in the way of social improvement.',
    'Lawful Neutral': 'Lawful Neutral characters act in accordance with law, tradition, or personal codes. Order and organization are paramount.',
    'True Neutral': 'True Neutral characters prefer to stay balanced, avoiding moral or ethical extremes in favor of pragmatism.',
    'Chaotic Neutral': 'Chaotic Neutral characters follow their whims. They are individualists first and last.',
    'Lawful Evil': 'Lawful Evil characters methodically take what they want within the limits of a code of tradition or loyalty.',
    'Neutral Evil': 'Neutral Evil characters do whatever they can get away with, without compassion or qualms.',
    'Chaotic Evil': 'Chaotic Evil characters act with arbitrary violence, spurred by greed, hatred, or bloodlust.',
  };
  const dndDef = dndAlignments[alignment] || `${alignment} alignment reflects this character's moral and ethical outlook.`;

  return `
    <div class="overlay-header">
      <span class="overlay-icon">⚖️</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">${alignment}</h2>
        <div class="overlay-subtitle">Alignment</div>
      </div>
    </div>
    
    <div class="overlay-section">
      <div class="overlay-section-title">D&D Definition</div>
      <div class="dnd-definition">
        <p>${dndDef}</p>
      </div>
    </div>
    
    ${alignDesc ? `
      <div class="overlay-section">
        <div class="cv-meaning">
          <div class="cv-meaning-title">What This Means</div>
          <div class="cv-meaning-desc">${alignDesc}</div>
        </div>
      </div>
    ` : ''}
  `;
}

// Generate Combat Stat overlay content
function getCombatStatOverlayContent(statKey) {
  const desc = combatStatDescriptions[statKey];
  const stats = characterData.coreStats;
  
  let value, title, subtitle;
  
  const charLevel = (characterData.personal && characterData.personal.level) ? characterData.personal.level : '?';
  switch(statKey) {
    case 'proficiency':
      value = `+${stats.proficiencyBonus}`;
      title = 'Proficiency Bonus';
      subtitle = `Level ${charLevel}`;
      break;
    case 'initiative':
      value = `+${stats.initiative}`;
      title = 'Initiative';
      subtitle = stats.initiativeBreakdown || 'Initiative modifier';
      break;
    case 'ac':
      value = stats.armorClass;
      title = 'Armor Class';
      subtitle = stats.armorClassExplanation || 'Defense Rating';
      break;
    case 'speed':
      value = stats.speed;
      title = 'Speed';
      subtitle = stats.speedExplanation || 'Movement speed';
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
        <div class="cv-meaning-title">Professional Context</div>
        <div class="cv-meaning-desc">${subtitle || ''}</div>
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
  const desc = savingThrowDescriptions[saveKey] || {};
  const proficient = ability.saveProficient;
  const profBonus = characterData.coreStats.proficiencyBonus;
  const total = proficient ? ability.modifier + profBonus : ability.modifier;

  // Use dynamic data from characterData.abilities for the CV meaning
  const cvMeaning = ability.cvMeaning || desc.cvMeaning || 'Professional Resilience';
  const cvDesc = ability.cvDescription || desc.cvDescription || '';
  
  return `
    <div class="overlay-header">
      <span class="overlay-icon">${desc.icon || '🎯'}</span>
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
        <p>${desc.dndDefinition || 'A saving throw represents your ability to resist or avoid certain effects.'}</p>
      </div>
    </div>
    
    ${cvDesc ? `
      <div class="overlay-section">
        <div class="cv-meaning">
          <div class="cv-meaning-title">${cvMeaning}</div>
          <div class="cv-meaning-desc">${cvDesc}</div>
        </div>
      </div>
    ` : ''}
    
    <div class="overlay-section">
      <div class="overlay-section-title">Calculation</div>
      <div class="calculation">
        <div class="calc-row">
          <span class="calc-label">${ability.abbr} Modifier</span>
          <span class="calc-value">${ability.modifier >= 0 ? '+' : ''}${ability.modifier}</span>
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
      ${action.attackBonus != null ? `
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
        <div class="cv-meaning-title">${action.effect || 'Professional Application'}</div>
        <div class="cv-meaning-desc">${action.description}</div>
      </div>
    </div>
    
    ${action.attackBonus != null ? `
      <div class="overlay-section">
        <div class="overlay-section-title">Attack Details</div>
        <div class="calculation">
          <div class="calc-row">
            <span class="calc-label">Attack Bonus</span>
            <span class="calc-value">+${action.attackBonus}</span>
          </div>
          ${action.damage != null ? `
            <div class="calc-row">
              <span class="calc-label">Damage</span>
              <span class="calc-value">${action.damage} ${action.damageType || ''}</span>
            </div>
          ` : ''}
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
        return `
          <div class="defense-item">
            <div class="defense-header">
              <span class="defense-icon">🛡️</span>
              <span class="defense-name">${d.name}</span>
            </div>
            <div class="defense-desc">${d.description}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Generate Heroic Inspiration overlay content — dynamic
function getHeroicInspirationOverlayContent() {
  const _p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
  const _bg = (typeof characterData !== 'undefined' && characterData.background) ? characterData.background : {};
  const _extras = (typeof characterData !== 'undefined' && characterData.extras) ? characterData.extras : {};
  const _bgStory = (_bg.characteristics && _bg.characteristics.backgroundStory) ? _bg.characteristics.backgroundStory : '';
  const _ideals = (_bg.ideals && _bg.ideals.length) ? _bg.ideals : [];
  const _interests = (_extras.interests && _extras.interests.length) ? _extras.interests : [];

  const idealsHtml = _ideals.map(function(i) { return '<p><strong>' + i.name + ':</strong> ' + i.description + '</p>'; }).join('');
  const interestsHtml = _interests.length ? '<p><strong>Interests:</strong> ' + _interests.join(', ') + '</p>' : '';

  return `
    <div class="overlay-header">
      <span class="overlay-icon">&#10022;</span>
      <div class="overlay-title-block">
        <h2 class="overlay-title">Heroic Inspiration</h2>
        <div class="overlay-subtitle">What drives this character</div>
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
      <p class="heroic-inspiration-background">${_bgStory || 'A unique character with an inspiring background.'}</p>
    </div>
    
    ${idealsHtml || interestsHtml ? '<div class="overlay-section overlay-section-inspiration"><div class="cv-meaning cv-meaning-inspiration"><h3 class="cv-meaning-title">What inspires ' + (_p.name || 'this character') + '</h3><div class="cv-meaning-desc">' + idealsHtml + interestsHtml + '</div></div></div>' : ''}
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

// Generate Campaign Status overlay content — dynamic from characterData
function getCampaignStatusOverlayContent() {
  const p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
  
  const contactLinks = [];
  if (p.email) contactLinks.push(`<a href="mailto:${p.email}" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--primary-red); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">📧 Email</a>`);
  if (p.linkedin) contactLinks.push(`<a href="${p.linkedin}" target="_blank" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--accent-blue); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">💼 LinkedIn</a>`);
  if (p.github) contactLinks.push(`<a href="${p.github}" target="_blank" class="contact-option-btn" style="padding: var(--spacing-sm) var(--spacing-md); background: var(--text-secondary); color: var(--white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600;">💻 GitHub</a>`);

  return `
    <div class="overlay-header">
      <h2>🎯 ${p.currentCampaign ? `Current Campaign: ${p.currentCampaign}` : 'Current Status'}</h2>
    </div>
    <div class="overlay-body">
      <div class="overlay-section">
        <h3>About ${p.name || 'This Character'}</h3>
        <p>${p.summary || 'No summary available.'}</p>
        ${p.currentStatus ? `<p><strong>Status:</strong> ${p.currentStatus}</p>` : ''}
      </div>
      
      ${contactLinks.length ? `
        <div class="overlay-section" style="background: var(--light-bg); padding: var(--spacing-md); border-radius: var(--radius-md); margin-top: var(--spacing-lg);">
          <h3 style="margin-top: 0;">Get In Touch</h3>
          <p>Interested in connecting? Let's start a new quest together!</p>
          <div class="contact-options" style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; margin-top: var(--spacing-md);">
            ${contactLinks.join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
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
