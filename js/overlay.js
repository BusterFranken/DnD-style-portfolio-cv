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
// roll button.
function getAbilityOverlayContent(abilityKey) {
  const ability = characterData.abilities[abilityKey];
  const desc = abilityDescriptions[abilityKey];
  const plate = desc.photoCaption
    ? `<div class="ov-plate"><img src="assets/images/buster.jpg" alt="${ability.name}">
       <div class="ov-plate-caption">${desc.photoCaption}</div></div>`
    : `<div class="ov-plate"><div class="ov-plate-art"><span>${desc.artLabel || 'commissioned art'}</span></div>
       <div class="ov-plate-caption">your AI art drops in here</div></div>`;
  return `
    <div class="ov-head">
      <span class="ov-title">${ability.name}</span>
      <span class="ov-sub">Score ${ability.score} · ${ability.cvMeaning}</span>
      <span class="ov-badge rollable" data-mod="${ability.modifier}" data-ability="${abilityKey}">${ability.modifier >= 0 ? '+' : ''}${ability.modifier}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      ${plate}
      <div class="ov-main">
        <div class="ov-blurb">${ability.cvDescription}</div>
        <div class="ov-evidence-title">Key Evidence</div>
        ${ability.evidence.map(e => `<div class="ov-evidence-row">◆ ${e}</div>`).join('')}
        ${ability.vouch ? `<div class="ov-evidence-title">Vouch</div><div class="ov-blurb">"${ability.vouch.text}" — ${ability.vouch.author}, ${ability.vouch.role}</div>` : ''}
        <button class="ov-roll-btn" onclick="rollFromOverlay('${ability.abbr}', ${ability.modifier})">✦ Roll ${ability.abbr} Check</button>
      </div>
    </div>`;
}

// Generate Skill overlay content — same band/body pattern, no plate.
// Not one of the prototype's OV keys, so band + blurb + Key Evidence +
// Vouch + Calculation + roll button are all kept (data-driven sections the
// prototype doesn't cover for this type, restyled to the same idiom).
function getSkillOverlayContent(skillKey) {
  const skill = characterData.skills.find(s =>
    s.name.toLowerCase().replace(/\s+/g, '') === skillKey
  );
  if (!skill) return '<p>Skill not found</p>';

  const desc = skillDescriptions[skillKey] || {};
  const ability = characterData.abilities[skill.ability];
  const profStatus = skill.expertise ? 'Expertise' : (skill.proficient ? 'Proficient' : 'Not Proficient');
  const cvMeaning = skill.cvMeaning || desc.cvMeaning || skill.name;
  const evidence = skill.evidence || desc.evidence || ['Demonstrated through work experience'];

  return `
    <div class="ov-head">
      <span class="ov-title">${skill.name}</span>
      <span class="ov-sub">${skill.ability.toUpperCase()} · ${profStatus} · ${cvMeaning}</span>
      <span class="ov-badge rollable" data-mod="${skill.modifier}" data-skill="${skill.name}">${skill.modifier >= 0 ? '+' : ''}${skill.modifier}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${desc.cvDescription || 'Professional application of this skill.'}</div>
        <div class="ov-evidence-title">Key Evidence</div>
        ${evidence.map(e => `<div class="ov-evidence-row">◆ ${e}</div>`).join('')}
        ${skill.vouch ? `<div class="ov-evidence-title">Vouch</div><div class="ov-blurb">"${skill.vouch.text}" — ${skill.vouch.author}</div>` : ''}
        <div class="ov-evidence-title">Calculation</div>
        <div class="ov-evidence-row">◆ ${skill.ability.toUpperCase()} Modifier — ${ability.modifier >= 0 ? '+' : ''}${ability.modifier}</div>
        ${skill.proficient ? `<div class="ov-evidence-row">◆ Proficiency Bonus — +${characterData.coreStats.proficiencyBonus}</div>` : ''}
        ${skill.expertise ? `<div class="ov-evidence-row">◆ Expertise Bonus — +${characterData.coreStats.proficiencyBonus}</div>` : ''}
        <div class="ov-evidence-row">◆ Total — ${skill.modifier >= 0 ? '+' : ''}${skill.modifier}</div>
        <button class="ov-roll-btn" onclick="rollFromOverlay('${skill.name}', ${skill.modifier})">✦ Roll ${skill.name} Check</button>
      </div>
    </div>`;
}

// Generate Class overlay content — no plate (classes/passives/etc. follow
// the prototype's plate-less non-ability pattern). Class Features + Key
// Evidence + Vouch are existing data sources, kept and restyled.
function getClassOverlayContent(classKey) {
  const classData = characterData.classes.find(c => c.id === classKey);

  if (!classData) {
    // Check unleveled classes
    const unleveled = characterData.unleveldClasses.find(c => c.id === classKey);
    if (unleveled) {
      return `
        <div class="ov-head">
          <span class="ov-title">${unleveled.name}</span>
          <span class="ov-sub">Primary: ${unleveled.primaryAbility}</span>
          <span class="ov-close-x" onclick="closeOverlay()">✕</span>
        </div>
        <div class="ov-body">
          <div class="ov-main">
            <div class="ov-blurb">${unleveled.description}</div>
            <div class="ov-evidence-row">◆ ${unleveled.notYetMessage}</div>
          </div>
        </div>`;
    }
    return '<p>Class not found</p>';
  }

  return `
    <div class="ov-head">
      <span class="ov-title">${classData.name}</span>
      <span class="ov-sub">${classData.primaryAbility} · Level ${classData.level}</span>
      <span class="ov-badge">${classData.level}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${classData.description}</div>
        <div class="ov-evidence-title">Class Features</div>
        ${classData.features.map(f => `<div class="ov-evidence-row">◆ Lv.${f.level} ${f.name} — ${f.desc}</div>`).join('')}
        <div class="ov-evidence-title">Key Evidence</div>
        ${classData.evidence.map(e => `<div class="ov-evidence-row">◆ ${e}</div>`).join('')}
        ${classData.vouch ? `<div class="ov-evidence-title">Vouch</div><div class="ov-blurb">"${classData.vouch.text}" — ${classData.vouch.author}, ${classData.vouch.role}</div>` : ''}
      </div>
    </div>`;
}

// Generate Alignment overlay content — matches the prototype's OV.alignment
// exactly: band (title / cv-meaning sub / "CG" badge) + blurb only, no
// evidence rows (the prototype's `k` is absent for this key).
function getAlignmentOverlayContent() {
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

// Generate Combat Stat overlay content — these 5 keys (proficiency,
// initiative, ac, speed, hp) are all in the prototype's OV set as
// blurb-only band+body (no bullets, no calculation breakdown, no roll
// button — the initiative tile's own .rollable modifier on the sheet
// still rolls independently of this overlay).
function getCombatStatOverlayContent(statKey) {
  const desc = combatStatDescriptions[statKey];
  const stats = characterData.coreStats;

  let value, title, sub;

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
    case 'heroic-inspiration':
      return getHeroicInspirationOverlayContent();
    default:
      return '<p>Stat not found</p>';
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
        <div class="ov-blurb">${desc.cvDescription}</div>
      </div>
    </div>`;
}

// Generate Saving Throw overlay content — not one of the prototype's OV
// keys: band + blurb + Calculation + roll button kept (no separate Key
// Evidence list — saves don't carry their own evidence array).
function getSavingThrowOverlayContent(saveKey) {
  const ability = characterData.abilities[saveKey];
  const desc = savingThrowDescriptions[saveKey];
  const proficient = ability.saveProficient;
  const profBonus = characterData.coreStats.proficiencyBonus;
  const total = proficient ? ability.modifier + profBonus : ability.modifier;

  return `
    <div class="ov-head">
      <span class="ov-title">${ability.name} Saving Throw</span>
      <span class="ov-sub">${proficient ? 'Proficient' : 'Not Proficient'} · ${desc.cvMeaning}</span>
      <span class="ov-badge rollable" data-mod="${total}" data-save="${saveKey}">${total >= 0 ? '+' : ''}${total}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${desc.cvDescription}</div>
        <div class="ov-evidence-title">Calculation</div>
        <div class="ov-evidence-row">◆ ${ability.abbr} Modifier — +${ability.modifier}</div>
        ${proficient ? `<div class="ov-evidence-row">◆ Proficiency Bonus — +${profBonus}</div>` : ''}
        <div class="ov-evidence-row">◆ Total — ${total >= 0 ? '+' : ''}${total}</div>
        <button class="ov-roll-btn" onclick="rollFromOverlay('${ability.abbr} Save', ${total})">✦ Roll ${ability.abbr} Save</button>
      </div>
    </div>`;
}

// Generate Spell overlay content — not one of the prototype's OV keys.
// Badge shows the spell's level label (Cantrip / Level 1-3) so the header
// band always has something to push the close-x flush right.
function getSpellOverlayContent(spellName) {
  const levels = [
    { list: characterData.spells.cantrips, label: 'Cantrip' },
    { list: characterData.spells.level1, label: 'Level 1' },
    { list: characterData.spells.level2, label: 'Level 2' },
    { list: characterData.spells.level3, label: 'Level 3' }
  ];
  let spell, levelLabel;
  for (const lvl of levels) {
    const found = (lvl.list || []).find(s => s.name === spellName);
    if (found) { spell = found; levelLabel = lvl.label; break; }
  }
  const desc = spellDescriptions[spellName] || {};

  if (!spell) return '<p>Spell not found</p>';

  return `
    <div class="ov-head">
      <span class="ov-title">${spell.name}</span>
      <span class="ov-sub">${spell.castTime} · ${spell.range}</span>
      <span class="ov-badge">${levelLabel}</span>
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${desc.cvDescription || spell.description}</div>
        <div class="ov-evidence-title">Spell Details</div>
        ${desc.dndEquivalent ? `<div class="ov-evidence-row">◆ D&D Equivalent — ${desc.dndEquivalent}</div>` : ''}
        <div class="ov-evidence-row">◆ Cast Time — ${spell.castTime}</div>
        <div class="ov-evidence-row">◆ Range — ${spell.range}</div>
        ${spell.slots ? `<div class="ov-evidence-row">◆ Slots — ${spell.slots}</div>` : ''}
      </div>
    </div>`;
}

// Generate Action overlay content — not one of the prototype's OV keys.
// Badge + roll button only for attack-type actions (attackBonus defined);
// Attack Details / Effect / Recharge sections render only when their data
// exists.
function getActionOverlayContent(actionName) {
  const action = characterData.actions.find(a => a.name === actionName);
  const desc = actionDescriptions[actionName] || {};

  if (!action) return '<p>Action not found</p>';

  const hasAttack = action.attackBonus !== undefined;

  return `
    <div class="ov-head">
      <span class="ov-title">${action.name}</span>
      <span class="ov-sub">${action.type}${action.uses ? ' · ' + action.uses : ''}</span>
      ${hasAttack ? `<span class="ov-badge rollable" data-mod="${action.attackBonus}">+${action.attackBonus}</span>` : ''}
      <span class="ov-close-x" onclick="closeOverlay()">✕</span>
    </div>
    <div class="ov-body">
      <div class="ov-main">
        <div class="ov-blurb">${desc.cvDescription || action.description}</div>
        ${hasAttack ? `
          <div class="ov-evidence-title">Attack Details</div>
          <div class="ov-evidence-row">◆ Attack Bonus — +${action.attackBonus}</div>
          <div class="ov-evidence-row">◆ Damage — ${action.damage} ${action.damageType}</div>
          ${action.range ? `<div class="ov-evidence-row">◆ Range — ${action.range}</div>` : ''}
        ` : ''}
        ${(action.effect || action.recharge) ? `
          <div class="ov-evidence-title">Details</div>
          ${action.effect ? `<div class="ov-evidence-row">◆ Effect — ${action.effect}</div>` : ''}
          ${action.recharge ? `<div class="ov-evidence-row">◆ Recharge — ${action.recharge}</div>` : ''}
        ` : ''}
        ${hasAttack ? `<button class="ov-roll-btn" onclick="rollFromOverlay('${action.name}', ${action.attackBonus})">✦ Roll to Hit</button>` : ''}
      </div>
    </div>`;
}

// Generate Defenses overlay content — matches the prototype's OV.defenses:
// band (title / "Damage Resistances" sub / ❖ badge) + Key Evidence only
// (no blurb — the prototype's `d` is absent for this key). Each row is
// "Name — description"; characterData.defenses[].description holds the
// post-em-dash text verbatim from the prototype's reviewed copy.
function getDefensesOverlayContent() {
  const defenses = characterData.defenses;

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
        ${defenses.map(d => `<div class="ov-evidence-row">◆ ${d.name} — ${d.description}</div>`).join('')}
      </div>
    </div>`;
}

// Generate Heroic Inspiration overlay content — leads with the prototype's
// OV.inspiration blurb (band: title / sub / ✦ badge), then keeps the
// existing Background line and the full "What Inspires Me" essay
// (restyled, not deleted — there is no OV bullet list for this key, and
// this richer personal content predates the prototype's terse overlay).
function getHeroicInspirationOverlayContent() {
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

// Generate Conditions overlay content — matches the prototype's
// OV.conditions: band (title / "Active Effects" sub / ✦ badge) + Key
// Evidence only. Same "Name — description" row pattern as Defenses.
function getConditionsOverlayContent() {
  const conditions = characterData.conditions;

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
        ${conditions.map(c => `<div class="ov-evidence-row">◆ ${c.name} — ${c.description}</div>`).join('')}
      </div>
    </div>`;
}

// Generate Campaign Status overlay content — same isIndexPage branching as
// before (kept, since the navbar's campaign-status chip is shared across
// all 6 pages); both branches restyled to the band+body pattern, contact
// CTAs now .ov-roll-btn/.ov-outline-btn instead of inline styles.
function getCampaignStatusOverlayContent() {
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
          <div class="ov-evidence-row">◆ Product & building roles — Product Engineer, Product Owner, or founding-team role at an exciting startup</div>
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
