/* ============================================
   ADMIN - Login and Editing Functionality
   ============================================ */

const adminModal = document.getElementById('adminModal');
const adminClose = document.getElementById('adminClose');
const adminForm = document.getElementById('adminForm');
const adminLoginBtn = document.getElementById('adminLoginBtn');

// Simple password (in production, use proper auth)
const ADMIN_PASSWORD = 'buster2024'; // Change this!

let isAdminMode = false;

// Open admin modal
function openAdminModal() {
  adminModal.classList.add('active');
  document.getElementById('adminPassword').focus();
}

// Close admin modal
function closeAdminModal() {
  adminModal.classList.remove('active');
  document.getElementById('adminPassword').value = '';
}

// Handle login
function handleLogin(e) {
  e.preventDefault();
  
  const password = document.getElementById('adminPassword').value;
  
  if (password === ADMIN_PASSWORD) {
    enableAdminMode();
    closeAdminModal();
  } else {
    alert('Incorrect password');
    document.getElementById('adminPassword').value = '';
  }
}

// Enable admin mode
function enableAdminMode() {
  isAdminMode = true;
  document.body.classList.add('admin-mode');
  
  // Make editable fields contenteditable
  document.querySelectorAll('.editable').forEach(el => {
    el.contentEditable = 'true';
    el.addEventListener('blur', handleFieldEdit);
  });
  
  // Show save button
  showSaveButton();
  
  // Update admin button
  adminLoginBtn.textContent = '✦';
  adminLoginBtn.title = 'Admin Mode Active';
  adminLoginBtn.onclick = disableAdminMode;
}

// Disable admin mode
function disableAdminMode() {
  isAdminMode = false;
  document.body.classList.remove('admin-mode');
  
  // Remove contenteditable
  document.querySelectorAll('.editable').forEach(el => {
    el.contentEditable = 'false';
    el.removeEventListener('blur', handleFieldEdit);
  });
  
  // Hide save button
  hideSaveButton();
  
  // Reset admin button (matches the static default markup in *.html exactly)
  adminLoginBtn.textContent = '◆';
  adminLoginBtn.title = 'Admin Login';
  adminLoginBtn.onclick = openAdminModal;
}

// Handle field edit
function handleFieldEdit(e) {
  const field = e.target.dataset.field;
  const newValue = e.target.textContent.trim();
  
  if (field) {
    // Update the data object
    const keys = field.split('.');
    let obj = characterData;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = newValue;
    
    // Save to localStorage
    saveData();
  }
}

// Show save button
function showSaveButton() {
  let saveBtn = document.getElementById('adminSaveBtn');
  if (!saveBtn) {
    saveBtn = document.createElement('button');
    saveBtn.id = 'adminSaveBtn';
    saveBtn.textContent = '❖ Save Changes';
    saveBtn.style.cssText = `
      position: fixed;
      bottom: 60px;
      right: 16px;
      z-index: 1000;
      padding: 8px 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: inherit;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    saveBtn.onclick = saveData;
    document.body.appendChild(saveBtn);
  }
  saveBtn.style.display = 'block';
}

// Hide save button
function hideSaveButton() {
  const saveBtn = document.getElementById('adminSaveBtn');
  if (saveBtn) {
    saveBtn.style.display = 'none';
  }
}

// Save data to localStorage
function saveData() {
  try {
    localStorage.setItem('characterData', JSON.stringify(characterData));
    
    // Show success feedback
    const saveBtn = document.getElementById('adminSaveBtn');
    if (saveBtn) {
      const originalText = saveBtn.textContent;
      saveBtn.textContent = '✦ Saved!';
      saveBtn.style.background = '#2E7D32';
      setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '#4CAF50';
      }, 2000);
    }
  } catch (err) {
    console.error('Failed to save data:', err);
    alert('Failed to save changes. Please try again.');
  }
}

// Load saved data from localStorage
function loadSavedData() {
  try {
    const saved = localStorage.getItem('characterData');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with default data (in case structure changed)
      Object.assign(characterData, parsed);
    }
  } catch (err) {
    console.error('Failed to load saved data:', err);
  }
}

// Event listeners
adminLoginBtn?.addEventListener('click', openAdminModal);
adminClose?.addEventListener('click', closeAdminModal);
adminForm?.addEventListener('submit', handleLogin);

// Click outside to close
adminModal?.addEventListener('click', (e) => {
  if (e.target === adminModal) {
    closeAdminModal();
  }
});

// Load saved data on init
loadSavedData();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { enableAdminMode, disableAdminMode, saveData, loadSavedData };
}
