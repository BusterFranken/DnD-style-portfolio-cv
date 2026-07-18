/* ============================================
   DICE - D20 Rolling Animation
   ============================================ */

const diceModal = document.getElementById('diceModal');
const diceElement = document.getElementById('dice');
const diceFace = diceElement?.querySelector('.dice-face');
const diceResult = document.getElementById('diceResult');
const diceMessage = document.getElementById('diceMessage');
const diceTitle = diceModal?.querySelector('.dice-title');

let isRolling = false;

// Roll a d20
function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

// Main roll function
function rollDice(checkName, modifier) {
  if (isRolling) return;
  isRolling = true;
  diceModal.classList.add('active');
  diceModal.classList.remove('done');
  diceResult.classList.remove('visible');
  diceMessage.classList.remove('visible', 'crit-success', 'crit-fail');
  diceTitle.textContent = checkName;
  document.body.style.overflow = 'hidden';

  const roll = rollD20();
  const total = roll + modifier;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 550 : 1400;
  let rot = 0;

  const iv = setInterval(() => {
    diceFace.textContent = Math.floor(Math.random() * 20) + 1;
    rot += 80 + Math.random() * 160;
    diceElement.style.transform = `rotate(${rot}deg)`;
  }, 85);

  setTimeout(() => {
    clearInterval(iv);
    rot = Math.ceil(rot / 360) * 360;
    diceElement.style.transform = `rotate(${rot}deg)`;
    showResult(roll, modifier, total, checkName);
  }, duration);
}

function showResult(roll, modifier, total, checkName) {
  diceFace.textContent = roll;
  diceModal.classList.add('done');
  diceResult.innerHTML = `
    <div class="result-row"><span>1d20 — the roll</span><span class="result-value">${roll}</span></div>
    <div class="result-row"><span>Modifier</span><span class="result-value">${modifier >= 0 ? '+' : ''}${modifier}</span></div>
    <div class="result-total"><span class="total-label">Total</span><span class="total-stamp">${total}</span></div>
    ${roll === 20 ? '<div class="dice-banner--crit">✦ ✦ ✦ &nbsp;CRITICAL&nbsp; ✦ ✦ ✦</div>' : ''}
    ${roll === 1 ? '<div class="dice-banner--fumble">✕ &nbsp;FUMBLE&nbsp; ✕</div>' : ''}`;
  setTimeout(() => diceResult.classList.add('visible'), 60);
  diceMessage.textContent = getDiceMessage(roll, total, checkName);
  if (roll === 20) diceMessage.classList.add('crit-success');
  if (roll === 1) diceMessage.classList.add('crit-fail');
  setTimeout(() => { diceMessage.classList.add('visible'); isRolling = false; }, 500);
}

// Handle roll click on any rollable element
function handleRollClick(e) {
  e.stopPropagation();
  
  const el = e.currentTarget;
  const modifier = parseInt(el.dataset.mod) || 0;
  const skillName = el.dataset.skill || el.dataset.ability || 'Check';
  
  rollDice(skillName, modifier);
}

// Close dice modal
function closeDiceModal() {
  if (!diceModal.classList.contains('done')) return;
  
  diceModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Click to dismiss
diceModal?.addEventListener('click', (e) => {
  if (diceModal.classList.contains('done')) {
    closeDiceModal();
  }
});

// ESC to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && diceModal?.classList.contains('active') && diceModal?.classList.contains('done')) {
    closeDiceModal();
  }
});

// Swipe-down to close (mobile bottom sheet)
let touchStartY = null;
diceModal?.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
diceModal?.addEventListener('touchmove', (e) => {
  if (touchStartY !== null && e.touches[0].clientY - touchStartY > 60) { touchStartY = null; closeDiceModal(); }
}, { passive: true });

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rollDice, handleRollClick };
}
