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
  
  // Reset state
  diceModal.classList.add('active');
  diceModal.classList.remove('done');
  diceElement.classList.remove('done');
  diceElement.classList.add('rolling');
  diceResult.classList.remove('visible');
  diceMessage.classList.remove('visible', 'crit-success', 'crit-fail');
  diceTitle.classList.remove('done');
  diceTitle.textContent = 'ROLLING...';
  
  document.body.style.overflow = 'hidden';
  
  // Generate the roll
  const roll = rollD20();
  const total = roll + modifier;
  
  // Animate through random numbers
  let animationFrame = 0;
  const animationDuration = 1500;
  const startTime = Date.now();
  
  function animateNumbers() {
    const elapsed = Date.now() - startTime;
    if (elapsed < animationDuration) {
      diceFace.textContent = Math.floor(Math.random() * 20) + 1;
      requestAnimationFrame(animateNumbers);
    } else {
      // Show final result
      showResult(roll, modifier, total, checkName);
    }
  }
  
  animateNumbers();
}

// Show the final result
function showResult(roll, modifier, total, checkName) {
  // Update dice face
  diceFace.textContent = roll;
  diceElement.classList.remove('rolling');
  diceElement.classList.add('done');
  
  // Style for nat 20 or nat 1
  diceFace.classList.remove('nat-20', 'nat-1');
  if (roll === 20) {
    diceFace.classList.add('nat-20');
  } else if (roll === 1) {
    diceFace.classList.add('nat-1');
  }
  
  // Update title
  diceTitle.classList.add('done');
  diceTitle.textContent = checkName.toUpperCase() + ' CHECK';
  
  // Show result breakdown
  diceResult.innerHTML = `
    <div class="result-title">${checkName}</div>
    <div class="result-breakdown">
      <div class="result-row roll">
        <span class="result-label">1d20</span>
        <span class="result-value">${roll}${roll === 20 ? ' (NAT 20!)' : roll === 1 ? ' (NAT 1!)' : ''}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Modifier</span>
        <span class="result-value">${modifier >= 0 ? '+' : ''}${modifier}</span>
      </div>
      <div class="result-total">
        <span class="total-label">TOTAL</span>
        <span class="total-value">${total}</span>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    diceResult.classList.add('visible');
  }, 200);
  
  // Show flavor message
  const message = getDiceMessage(roll, total, checkName);
  diceMessage.textContent = message;
  
  if (roll === 20) {
    diceMessage.classList.add('crit-success');
  } else if (roll === 1) {
    diceMessage.classList.add('crit-fail');
  }
  
  setTimeout(() => {
    diceMessage.classList.add('visible');
    diceModal.classList.add('done');
    isRolling = false;
  }, 500);
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

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rollDice, handleRollClick };
}
