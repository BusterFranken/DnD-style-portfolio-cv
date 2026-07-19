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

// Swipe-down to close (mobile bottom sheet) — same technique as js/dice.js's
// touch handlers (Task 4), applied to the overlay modal.
let overlayTouchStartY = null;
overlayModal?.addEventListener('touchstart', (e) => { overlayTouchStartY = e.touches[0].clientY; }, { passive: true });
overlayModal?.addEventListener('touchmove', (e) => {
  if (overlayTouchStartY !== null && e.touches[0].clientY - overlayTouchStartY > 60) { overlayTouchStartY = null; closeOverlay(); }
}, { passive: true });


// Generate Ability Score overlay content — canonical parchment template:
// red header band (title / "Score N · cv meaning" sub / rollable modifier
// badge / close-x) + body with an art plate (photo for CHA, hatched
// placeholder + artLabel for the rest) beside blurb / Key Evidence / Vouch /
// roll button. On generated sheets (?slug=) the owner's abilityDescriptions
// art/photo captions don't apply — those render the hatched placeholder with
// the generic "commissioned art" caption instead, and every field access is
// guarded so missing generated data never prints "undefined".
function getAbilityOverlayContent(abilityKey) {
  const ability = (characterData.abilities || {})[abilityKey];
  if (!ability) return '<p>Ability not found</p>';
  const isGenerated = window.__appDataSource !== 'default';
  const desc = (typeof abilityDescriptions !== 'undefined' && abilityDescriptions[abilityKey]) || {};
  const mod = ability.modifier != null ? ability.modifier : 0;
  const abbr = ability.abbr || abilityKey.toUpperCase();
  const plate = (!isGenerated && desc.photoCaption)
    ? `<div class="ov-plate"><img src="assets/images/buster.jpg" alt="${ability.name || abbr}">
       <div class="ov-plate-caption">${desc.photoCaption}</div></div>`
    : `<div class="ov-plate"><div class="ov-plate-art"><span>${isGenerated ? (ability.name || 'commissioned art') : (desc.artLabel || 'commissioned art')}</span></div>
       <div class="ov-plate-caption">${isGenerated ? 'commissioned art' : 'your AI art drops in here'}</div></div>`;
  const evidence = ability.evidence || [];
  const vouch = ability.vouch && ability.vouch.text ? ability.vouch : null;
  return `
    <div class="ov-head">
      <span class="ov-title">${ability.name || abbr}</span>
      <span class="ov-sub">Score ${ability.score != null ? ability.score : '—'}${ability.cvMeaning ? ' · ' + ability.cvMeaning : ''}</span>
      <span class="ov-badge rollable" data-mod="${mod}" data-ability="${abilityKey}">${mod >= 0 ? '+' : ''}${mod}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      ${plate}
      <div class="ov-main">
        ${ability.cvDescription ? `<div class="ov-blurb">${ability.cvDescription}</div>` : ''}
        ${evidence.length ? `
          <div class="ov-evidence-title">Key Evidence</div>
          ${evidence.map(e => `<div class="ov-evidence-row">◆ ${e}</div>`).join('')}
        ` : ''}
        ${vouch ? `<div class="ov-evidence-title">Vouch</div><div class="ov-blurb">"${vouch.text}" — ${vouch.author || 'anonymous'}${vouch.role ? ', ' + vouch.role : ''}</div>` : ''}
        <button class="ov-roll-btn" onclick="rollFromOverlay('${abbr}', ${mod})">✦ Roll ${abbr} Check</button>
      </div>
    </div>`;
}


// Generate Skill overlay content — same band/body pattern, no plate.
// Generated sheets prefer the skill's own cvMeaning/evidence over the
// owner's skillDescriptions copy (branch behavior), with guarded fallbacks.
function getSkillOverlayContent(skillKey) {
  const skill = (characterData.skills || []).find(s =>
    (s.name || '').toLowerCase().replace(/\s+/g, '') === skillKey
  );
  if (!skill) return '<p>Skill not found</p>';

  const isGenerated = window.__appDataSource !== 'default';
  const desc = (!isGenerated && typeof skillDescriptions !== 'undefined' && skillDescriptions[skillKey]) || {};
  const ability = (characterData.abilities || {})[skill.ability] || {};
  const coreStats = characterData.coreStats || {};
  const profStatus = skill.expertise ? 'Expertise' : (skill.proficient ? 'Proficient' : 'Not Proficient');
  const cvMeaning = skill.cvMeaning || desc.cvMeaning || skill.name;
  const hasOwnEvidence = skill.evidence && skill.evidence.length;
  const evidence = hasOwnEvidence ? skill.evidence : (desc.evidence || ['Demonstrated through work experience']);
  const blurb = (isGenerated && skill.cvMeaning)
    ? (hasOwnEvidence ? skill.evidence[0] : 'Professional application of this skill.')
    : (desc.cvDescription || 'Professional application of this skill.');
  const sMod = skill.modifier != null ? skill.modifier : 0;

  return `
    <div class="ov-head">
      <span class="ov-title">${skill.name}</span>
      <span class="ov-sub">${(skill.ability || '').toUpperCase()} · ${profStatus} · ${cvMeaning}</span>
      <span class="ov-badge rollable" data-mod="${sMod}" data-skill="${skill.name}">${sMod >= 0 ? '+' : ''}${sMod}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${blurb}</div>
        <div class="ov-evidence-title">Key Evidence</div>
        ${evidence.map(e => `<div class="ov-evidence-row">◆ ${e}</div>`).join('')}
        ${skill.vouch && skill.vouch.text ? `<div class="ov-evidence-title">Vouch</div><div class="ov-blurb">"${skill.vouch.text}" — ${skill.vouch.author || 'anonymous'}</div>` : ''}
        <div class="ov-evidence-title">Calculation</div>
        ${ability.modifier != null ? `<div class="ov-evidence-row">◆ ${(skill.ability || '').toUpperCase()} Modifier — ${ability.modifier >= 0 ? '+' : ''}${ability.modifier}</div>` : ''}
        ${skill.proficient && coreStats.proficiencyBonus != null ? `<div class="ov-evidence-row">◆ Proficiency Bonus — +${coreStats.proficiencyBonus}</div>` : ''}
        ${skill.expertise && coreStats.proficiencyBonus != null ? `<div class="ov-evidence-row">◆ Expertise Bonus — +${coreStats.proficiencyBonus}</div>` : ''}
        <div class="ov-evidence-row">◆ Total — ${sMod >= 0 ? '+' : ''}${sMod}</div>
        <button class="ov-roll-btn" onclick="rollFromOverlay('${skill.name}', ${sMod})">✦ Roll ${skill.name} Check</button>
      </div>
    </div>`;
}


// Generate Class overlay content — no plate (classes/passives/etc. follow
// the prototype's plate-less non-ability pattern). Class Features + Key
// Evidence + Vouch are existing data sources, kept and restyled; all list
// accesses guarded for generated sheets.
function getClassOverlayContent(classKey) {
  const classData = (characterData.classes || []).find(c => c.id === classKey);

  if (!classData) {
    // Check unleveled classes
    const unleveled = (characterData.unleveldClasses || []).find(c => c.id === classKey);
    if (unleveled) {
      return `
        <div class="ov-head">
          <span class="ov-title">${unleveled.name || 'Class'}</span>
          <span class="ov-sub">${unleveled.primaryAbility ? 'Primary: ' + unleveled.primaryAbility : 'Unleveled class'}</span>
          <span class="ov-close-x" onclick="closeOverlay()">✕</span>
        </div>
        <div class="ov-body">
          <div class="ov-main">
            ${unleveled.description ? `<div class="ov-blurb">${unleveled.description}</div>` : ''}
            ${unleveled.notYetMessage ? `<div class="ov-evidence-row">◆ ${unleveled.notYetMessage}</div>` : ''}
          </div>
        </div>`;
    }
    return '<p>Class not found</p>';
  }

  const features = classData.features || [];
  const evidence = classData.evidence || [];
  return `
    <div class="ov-head">
      <span class="ov-title">${classData.name || 'Class'}</span>
      <span class="ov-sub">${classData.primaryAbility || ''}${classData.level != null ? ' · Level ' + classData.level : ''}</span>
      ${classData.level != null ? `<span class="ov-badge">${classData.level}</span>` : ''}
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        ${classData.description ? `<div class="ov-blurb">${classData.description}</div>` : ''}
        ${features.length ? `
          <div class="ov-evidence-title">Class Features</div>
          ${features.map(f => `<div class="ov-evidence-row">◆ ${f.level != null ? 'Lv.' + f.level + ' ' : ''}${f.name || ''}${f.desc ? ' — ' + f.desc : ''}</div>`).join('')}
        ` : ''}
        ${evidence.length ? `
          <div class="ov-evidence-title">Key Evidence</div>
          ${evidence.map(e => `<div class="ov-evidence-row">◆ ${e}</div>`).join('')}
        ` : ''}
        ${classData.vouch && classData.vouch.text ? `<div class="ov-evidence-title">Vouch</div><div class="ov-blurb">"${classData.vouch.text}" — ${classData.vouch.author || 'anonymous'}${classData.vouch.role ? ', ' + classData.vouch.role : ''}</div>` : ''}
      </div>
    </div>`;
}


// Generate Alignment overlay content — owner page matches the prototype's
// OV.alignment exactly (band + blurb only); generated sheets derive the
// definition from a standard alignment table plus the sheet's own
// alignmentDescription.
function getAlignmentOverlayContent() {
  if (window.__appDataSource === 'default') {
    const abbr = characterData.personal.alignment.split(' ').map(w => w[0]).join('');
    return `
      <div class="ov-head">
        <span class="ov-title">${characterData.personal.alignment}</span>
        <span class="ov-sub">${alignmentDescription.cvMeaning}</span>
        <span class="ov-badge">${abbr}</span>
        <span class="ov-close-x" onclick="closeOverlay()">✕</span>
      </div>
      <div class="ov-body">
        <div class="ov-main">
          <div class="ov-blurb">${alignmentDescription.cvDescription}</div>
        </div>
      </div>`;
  }

  // Generated sheets
  const p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
  const alignment = p.alignment || 'Unaligned';
  const abbr = alignment.split(' ').map(w => w[0]).join('').toUpperCase();
  const dndAlignments = {
    'Lawful Good': 'Lawful Good characters act with compassion and honor, following the rules and obeying authority when doing so leads to the greater good.',
    'Neutral Good': 'Neutral Good characters do the best they can to help others according to their needs, without bias for or against order.',
    'Chaotic Good': 'Chaotic Good characters do what is necessary to bring about change for the better, disdaining bureaucratic organizations that get in the way of social improvement.',
    'Lawful Neutral': 'Lawful Neutral characters act in accordance with law, tradition, or personal codes. Order and organization are paramount.',
    'True Neutral': 'True Neutral characters prefer to stay balanced, avoiding moral or ethical extremes in favor of pragmatism.',
    'Chaotic Neutral': 'Chaotic Neutral characters follow their whims. They are individualists first and last.',
    'Lawful Evil': 'Lawful Evil characters methodically take what they want within the limits of a code of tradition or loyalty.',
    'Neutral Evil': 'Neutral Evil characters do whatever they can get away with, without compassion or qualms.',
    'Chaotic Evil': 'Chaotic Evil characters act with arbitrary violence, spurred by greed, hatred, or bloodlust.'
  };
  const dndDef = dndAlignments[alignment] || (alignment + " reflects this character's moral and ethical outlook.");
  return `
    <div class="ov-head">
      <span class="ov-title">${alignment}</span>
      <span class="ov-sub">Alignment</span>
      <span class="ov-badge">${abbr}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${dndDef}</div>
        ${p.alignmentDescription ? `<div class="ov-evidence-title">What This Means</div><div class="ov-blurb">${p.alignmentDescription}</div>` : ''}
      </div>
    </div>`;
}


// Generate Combat Stat overlay content — owner page keeps the prototype's
// blurb-only band+body per stat; generated sheets derive value/sub/blurb
// from coreStats with guarded fallbacks.
function getCombatStatOverlayContent(statKey) {
  if (statKey === 'heroic-inspiration') return getHeroicInspirationOverlayContent();

  const stats = characterData.coreStats || {};
  let value, title, sub, blurb;

  if (window.__appDataSource === 'default') {
    const desc = combatStatDescriptions[statKey];
    switch(statKey) {
      case 'proficiency':
        value = `+${stats.proficiencyBonus}`;
        title = 'Proficiency Bonus';
        sub = desc.cvMeaning;
        break;
      case 'initiative':
        value = `+${stats.initiative}`;
        title = 'Initiative';
        sub = desc.cvMeaning;
        break;
      case 'ac':
        value = `${stats.armorClass}`;
        title = 'Armor Class';
        sub = desc.cvMeaning;
        break;
      case 'speed':
        value = `${stats.speed}.`;
        title = 'Speed';
        sub = desc.cvMeaning;
        break;
      case 'hp':
        value = `${stats.hitPoints.current}/${stats.hitPoints.max}`;
        title = 'Hit Points';
        sub = stats.hitPoints.meaning;
        break;
      default:
        return '<p>Stat not found</p>';
    }
    blurb = desc.cvDescription;
  } else {
    // Generated sheets — every field guarded
    const charLevel = (characterData.personal && characterData.personal.level != null) ? characterData.personal.level : '?';
    switch(statKey) {
      case 'proficiency':
        value = stats.proficiencyBonus != null ? `+${stats.proficiencyBonus}` : '—';
        title = 'Proficiency Bonus';
        sub = `Level ${charLevel}`;
        blurb = 'Reflects overall experience and training level — added to skills, saves, and attacks where proficient.';
        break;
      case 'initiative':
        value = stats.initiative != null ? `+${stats.initiative}` : '—';
        title = 'Initiative';
        sub = 'Responsiveness';
        blurb = stats.initiativeBreakdown || 'How quickly this character reacts to new opportunities.';
        break;
      case 'ac':
        value = stats.armorClass != null ? `${stats.armorClass}` : '—';
        title = 'Armor Class';
        sub = 'Defense Rating';
        blurb = stats.armorClassExplanation || 'How hard this character is to hit — professional defenses and resilience.';
        break;
      case 'speed':
        value = stats.speed ? `${stats.speed}.` : '—';
        title = 'Speed';
        sub = 'Execution Velocity';
        blurb = stats.speedExplanation || 'Pace of movement and adaptability.';
        break;
      case 'hp':
        value = stats.hitPoints ? `${stats.hitPoints.current}/${stats.hitPoints.max}` : '—';
        title = 'Hit Points';
        sub = (stats.hitPoints && stats.hitPoints.meaning) || 'Life Force';
        blurb = 'Capacity to absorb challenges and keep going.';
        break;
      default:
        return '<p>Stat not found</p>';
    }
  }

  return `
    <div class="ov-head">
      <span class="ov-title">${title}</span>
      <span class="ov-sub">${sub}</span>
      <span class="ov-badge">${value}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${blurb || ''}</div>
      </div>
    </div>`;
}


// Generate Saving Throw overlay content — band + blurb + Calculation +
// roll button; generated sheets prefer the ability's own cvMeaning/
// cvDescription (branch behavior), all lookups guarded.
function getSavingThrowOverlayContent(saveKey) {
  const ability = (characterData.abilities || {})[saveKey];
  if (!ability) return '<p>Save not found</p>';
  const isGenerated = window.__appDataSource !== 'default';
  const desc = (typeof savingThrowDescriptions !== 'undefined' && savingThrowDescriptions[saveKey]) || {};
  const proficient = !!ability.saveProficient;
  const profBonus = (characterData.coreStats && characterData.coreStats.proficiencyBonus != null) ? characterData.coreStats.proficiencyBonus : 0;
  const mod = ability.modifier != null ? ability.modifier : 0;
  const total = proficient ? mod + profBonus : mod;
  const abbr = ability.abbr || saveKey.toUpperCase();
  const cvMeaning = (isGenerated && ability.cvMeaning) ? ability.cvMeaning : (desc.cvMeaning || '');
  const blurb = (isGenerated ? (ability.cvDescription || '') : '') || desc.cvDescription || 'A saving throw represents the ability to resist or avoid certain effects.';

  return `
    <div class="ov-head">
      <span class="ov-title">${ability.name || abbr} Saving Throw</span>
      <span class="ov-sub">${proficient ? 'Proficient' : 'Not Proficient'}${cvMeaning ? ' · ' + cvMeaning : ''}</span>
      <span class="ov-badge rollable" data-mod="${total}" data-save="${saveKey}">${total >= 0 ? '+' : ''}${total}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${blurb}</div>
        <div class="ov-evidence-title">Calculation</div>
        <div class="ov-evidence-row">◆ ${abbr} Modifier — ${mod >= 0 ? '+' : ''}${mod}</div>
        ${proficient ? `<div class="ov-evidence-row">◆ Proficiency Bonus — +${profBonus}</div>` : ''}
        <div class="ov-evidence-row">◆ Total — ${total >= 0 ? '+' : ''}${total}</div>
        <button class="ov-roll-btn" onclick="rollFromOverlay('${abbr} Save', ${total})">✦ Roll ${abbr} Save</button>
      </div>
    </div>`;
}


// Generate Spell overlay content — badge shows the spell's level label so
// the header band always has something to push the close-x flush right.
// Generated sheets skip the owner's spellDescriptions and fall back to the
// spell's own description/dndEquivalent fields, guarded.
function getSpellOverlayContent(spellName) {
  const sp = (typeof characterData !== 'undefined' && characterData.spells) || {};
  const levels = [
    { list: sp.cantrips, label: 'Cantrip' },
    { list: sp.level1, label: 'Level 1' },
    { list: sp.level2, label: 'Level 2' },
    { list: sp.level3, label: 'Level 3' }
  ];
  let spell, levelLabel;
  for (const lvl of levels) {
    const found = (lvl.list || []).find(s => s.name === spellName);
    if (found) { spell = found; levelLabel = lvl.label; break; }
  }
  if (!spell) return '<p>Spell not found</p>';

  const desc = (window.__appDataSource === 'default' && typeof spellDescriptions !== 'undefined' && spellDescriptions[spellName]) || {};
  const sub = [spell.castTime, spell.range].filter(Boolean).join(' · ') || levelLabel;
  const blurb = desc.cvDescription || spell.description || spell.cvMeaning || '';
  const dndEq = desc.dndEquivalent || spell.dndEquivalent;

  return `
    <div class="ov-head">
      <span class="ov-title">${spell.name}</span>
      <span class="ov-sub">${sub}</span>
      <span class="ov-badge">${levelLabel}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${blurb}</div>
        <div class="ov-evidence-title">Spell Details</div>
        ${dndEq ? `<div class="ov-evidence-row">◆ D&D Equivalent — ${dndEq}</div>` : ''}
        ${spell.castTime ? `<div class="ov-evidence-row">◆ Cast Time — ${spell.castTime}</div>` : ''}
        ${spell.range ? `<div class="ov-evidence-row">◆ Range — ${spell.range}</div>` : ''}
        ${spell.slots ? `<div class="ov-evidence-row">◆ Slots — ${spell.slots}</div>` : ''}
      </div>
    </div>`;
}


// Helper (branch): treat null, undefined, empty string, "/", "N/A" and
// "none" as absent — generated sheets use "/" as a placeholder value.
function val(v) {
  if (v == null) return '';
  const s = String(v).trim();
  return (s === '' || s === '/' || s === 'N/A' || s === 'null' || s === 'none') ? '' : s;
}

// Generate Action overlay content — badge + roll button only for
// attack-type actions; every data row is val()-guarded so generated
// placeholder values ("/") never render.
function getActionOverlayContent(actionName) {
  const action = (characterData.actions || []).find(a => a.name === actionName);
  if (!action) return '<p>Action not found</p>';

  const desc = (window.__appDataSource === 'default' && typeof actionDescriptions !== 'undefined' && actionDescriptions[actionName]) || {};
  const hasAttack = action.attackBonus != null;
  const damage = val(action.damage);
  const damageType = val(action.damageType);
  const range = val(action.range);
  const effect = val(action.effect);
  const recharge = val(action.recharge);
  const uses = val(action.uses);

  return `
    <div class="ov-head">
      <span class="ov-title">${action.name}</span>
      <span class="ov-sub">${action.type || 'Action'}${uses ? ' · ' + uses : ''}</span>
      ${hasAttack ? `<span class="ov-badge rollable" data-mod="${action.attackBonus}">+${action.attackBonus}</span>` : ''}
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${desc.cvDescription || val(action.description) || effect || ''}</div>
        ${hasAttack ? `
          <div class="ov-evidence-title">Attack Details</div>
          <div class="ov-evidence-row">◆ Attack Bonus — +${action.attackBonus}</div>
          ${damage ? `<div class="ov-evidence-row">◆ Damage — ${damage}${damageType ? ' ' + damageType : ''}</div>` : ''}
          ${range ? `<div class="ov-evidence-row">◆ Range — ${range}</div>` : ''}
        ` : ''}
        ${(effect || recharge) ? `
          <div class="ov-evidence-title">Details</div>
          ${effect ? `<div class="ov-evidence-row">◆ Effect — ${effect}</div>` : ''}
          ${recharge ? `<div class="ov-evidence-row">◆ Recharge — ${recharge}</div>` : ''}
        ` : ''}
        ${hasAttack ? `<button class="ov-roll-btn" onclick="rollFromOverlay('${action.name}', ${action.attackBonus})">✦ Roll to Hit</button>` : ''}
      </div>
    </div>`;
}


// Generate Defenses overlay content — band + Key Evidence rows,
// "Name — description" (description guarded for generated sheets).
function getDefensesOverlayContent() {
  const defenses = characterData.defenses || [];

  return `
    <div class="ov-head">
      <span class="ov-title">Defenses</span>
      <span class="ov-sub">Damage Resistances</span>
      <span class="ov-badge">❖</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-evidence-title">Key Evidence</div>
        ${defenses.length ? defenses.map(d => `<div class="ov-evidence-row">◆ ${d.name || ''}${d.description ? ' — ' + d.description : ''}</div>`).join('') : '<div class="ov-evidence-row">◆ No specific defenses listed</div>'}
      </div>
    </div>`;
}


// Generate Heroic Inspiration overlay content — owner page keeps the full
// personal essay verbatim; generated sheets derive it from background
// story, ideals and interests (branch behavior), guarded.
function getHeroicInspirationOverlayContent() {
  if (window.__appDataSource === 'default') {
    return `
      <div class="ov-head">
        <span class="ov-title">Heroic Inspiration</span>
        <span class="ov-sub">What inspires this character</span>
        <span class="ov-badge">✦</span>
        <span class="ov-close-x" onclick="closeOverlay()">✕</span>
      </div>
      <div class="ov-body">
        <div class="ov-main">
          <div class="ov-blurb">Technology should serve humanity, not the other way around. The mission: change humanity's mindset toward truly sustainable development.</div>
          <div class="ov-evidence-title">Background</div>
          <div class="ov-evidence-row">◆ Entertainer turned Folk Hero — from stage and performance into building communities, platforms, and ventures for a better world.</div>
          <div class="ov-evidence-title">What Inspires Me</div>
          <div class="ov-blurb">I get that same “advantage” when I’m around the cutting edge of any field—tech, art, philosophy, or economic theory—or when I’m in conversation with people who want to change the world for the better and we’re actually vibing. Good craftsmanship does it too, whether it’s great food or anything someone makes with care. So does someone rebelling with a cause, or discussing and realizing visions of a better world. I’m inspired when humans organize and come together in a beautiful way: in culture, in a city building something, or in rebellion. And simply when something good is being done.</div>
          <div class="ov-blurb">When I have inspiration from any of that, I bring it into the next pitch, the next conversation, or the next build.</div>
        </div>
      </div>`;
  }

  // Generated sheets
  const p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
  const bg = (typeof characterData !== 'undefined' && characterData.background) ? characterData.background : {};
  const extras = (typeof characterData !== 'undefined' && characterData.extras) ? characterData.extras : {};
  const bgStory = (bg.characteristics && bg.characteristics.backgroundStory) ? bg.characteristics.backgroundStory : '';
  const ideals = (bg.ideals && bg.ideals.length) ? bg.ideals : [];
  const interests = (extras.interests && extras.interests.length) ? extras.interests : [];

  return `
    <div class="ov-head">
      <span class="ov-title">Heroic Inspiration</span>
      <span class="ov-sub">What drives ${p.name || 'this character'}</span>
      <span class="ov-badge">✦</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${bgStory || 'A unique character with an inspiring background.'}</div>
        ${ideals.length ? `
          <div class="ov-evidence-title">Ideals</div>
          ${ideals.map(i => `<div class="ov-evidence-row">◆ ${i.name || ''}${i.description ? ' — ' + i.description : ''}</div>`).join('')}
        ` : ''}
        ${interests.length ? `
          <div class="ov-evidence-title">Interests</div>
          <div class="ov-blurb">${interests.join(', ')}</div>
        ` : ''}
      </div>
    </div>`;
}


// Generate Conditions overlay content — band + Key Evidence rows, same
// "Name — description" pattern as Defenses, guarded.
function getConditionsOverlayContent() {
  const conditions = characterData.conditions || [];

  return `
    <div class="ov-head">
      <span class="ov-title">Conditions</span>
      <span class="ov-sub">Active Effects</span>
      <span class="ov-badge">✦</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-evidence-title">Key Evidence</div>
        ${conditions.length ? conditions.map(c => `<div class="ov-evidence-row">◆ ${c.name || ''}${c.active ? ' (Active)' : ''}${c.description ? ' — ' + c.description : ''}</div>`).join('') : '<div class="ov-evidence-row">◆ No active conditions</div>'}
      </div>
    </div>`;
}


// Generate Campaign Status overlay content — owner page keeps the redesign's
// isIndexPage branching verbatim; generated sheets build an About/Status/
// contact card from characterData.personal (branch behavior), restyled to
// the band+body pattern with .ov-roll-btn/.ov-outline-btn CTAs.
function getCampaignStatusOverlayContent() {
  if (window.__appDataSource === 'default') {
    const p = characterData.personal;
    const campaignStatusEl = document.querySelector('.campaign-status .campaign-name');
    const campaignName = campaignStatusEl ? campaignStatusEl.textContent.trim() : '';

    const isIndexPage = window.location.pathname.endsWith('index.html') ||
                        window.location.pathname.endsWith('/') ||
                        !window.location.pathname.includes('.html');

    if (isIndexPage || campaignName === p.currentCampaignName || campaignName.includes('Energy')) {
      return `
        <div class="ov-head">
          <span class="ov-title">Current Campaign</span>
          <span class="ov-sub">${p.currentCampaignName}</span>
          <span class="ov-badge">✦</span>
          <span class="ov-close-x" onclick="closeOverlay()">✕</span>
        </div>
        <div class="ov-body">
          <div class="ov-main">
            <div class="ov-blurb">${p.currentCampaign}</div>
            <div class="ov-evidence-title">What I'm Looking For</div>
            <div class="ov-evidence-row">◆ Energy & Hardtech — energy solutions, hardtech innovations, and deep tech applications</div>
            <div class="ov-evidence-row">◆ Product & Growth roles — Product Owner or Growth role at an exciting startup</div>
            <div class="ov-evidence-row">◆ Deep/Hardtech ideas — any compelling concept that solves real problems</div>
            <div class="ov-evidence-title">Background</div>
            <div class="ov-evidence-row">◆ €45M crowdsourced in AI engineering work for impact organizations</div>
            <div class="ov-evidence-row">◆ 4500+ engineers, 80+ partners, €1M raised</div>
            <div class="ov-evidence-row">◆ 500+ user & customer interviews; product & growth experience</div>
            <a class="ov-roll-btn" href="mailto:${p.email}?subject=Energy Hardtech Opportunity">✉ Email Me</a>
            <a class="ov-outline-btn" href="${p.linkedin}" target="_blank">❖ LinkedIn</a>
          </div>
        </div>`;
    } else {
      return `
        <div class="ov-head">
          <span class="ov-title">Get In Touch</span>
          <span class="ov-sub">Let's Connect</span>
          <span class="ov-close-x" onclick="closeOverlay()">✕</span>
        </div>
        <div class="ov-body">
          <div class="ov-main">
            <div class="ov-blurb">Interested in connecting or discussing opportunities? I'm always open to interesting conversations and new adventures!</div>
            <a class="ov-roll-btn" href="mailto:${p.email}">✉ Email Me</a>
            <a class="ov-outline-btn" href="${p.linkedin}" target="_blank">❖ LinkedIn</a>
          </div>
        </div>`;
    }
  }

  // Generated sheets
  const p = (typeof characterData !== 'undefined' && characterData.personal) ? characterData.personal : {};
  const contactLinks = [];
  if (p.email) contactLinks.push(`<a class="ov-roll-btn" href="mailto:${p.email}">✉ Email</a>`);
  if (p.linkedin) contactLinks.push(`<a class="ov-outline-btn" href="${p.linkedin}" target="_blank">❖ LinkedIn</a>`);
  if (p.github) contactLinks.push(`<a class="ov-outline-btn" href="${p.github}" target="_blank">❖ GitHub</a>`);

  return `
    <div class="ov-head">
      <span class="ov-title">${p.currentCampaign ? 'Current Campaign' : 'Current Status'}</span>
      <span class="ov-sub">${p.currentCampaignName || p.currentCampaign || p.currentStatus || p.name || 'Adventurer'}</span>
      <span class="ov-badge">✦</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        ${p.summary ? `<div class="ov-blurb">${p.summary}</div>` : ''}
        ${p.currentStatus ? `<div class="ov-evidence-row">✦ <strong>Status:</strong> ${p.currentStatus}</div>` : ''}
        ${p.currentCampaign && p.currentCampaign !== (p.currentCampaignName || '') ? `<div class="ov-evidence-row">◆ ${p.currentCampaign}</div>` : ''}
        ${contactLinks.length ? `<div class="ov-evidence-title">Get In Touch</div>${contactLinks.join('')}` : ''}
      </div>
    </div>`;
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
