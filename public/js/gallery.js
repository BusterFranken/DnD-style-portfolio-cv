/* ============================================
   GALLERY PAGE — Public timeline of all sheets
   ============================================ */

document.addEventListener('DOMContentLoaded', initGallery);

async function initGallery() {
  setupNavbarMobileGallery();

  const grid = document.getElementById('galleryGrid');
  const loading = document.getElementById('galleryLoading');
  const empty = document.getElementById('galleryEmpty');
  const error = document.getElementById('galleryError');

  try {
    const resp = await fetch('/api/sheets?limit=50');
    if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
    const { sheets } = await resp.json();

    loading.style.display = 'none';

    if (!sheets || sheets.length === 0) {
      empty.style.display = 'block';
      return;
    }

    grid.innerHTML = sheets.map(sheet => {
      const date = new Date(sheet.createdAt);
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit'
      });

      return `
        <a href="index.html?slug=${encodeURIComponent(sheet.slug)}" class="gallery-card">
          <div class="gallery-avatar">
            <span class="gallery-avatar-text">${getInitials(sheet.name)}</span>
          </div>
          <div class="gallery-info">
            <h3 class="gallery-name">${escapeHtml(sheet.name)}</h3>
            <p class="gallery-title">${escapeHtml(sheet.title || 'Adventurer')}</p>
            <div class="gallery-meta">
              <span class="gallery-date">${dateStr}</span>
              <span class="gallery-time">${timeStr}</span>
            </div>
          </div>
          <span class="gallery-arrow">→</span>
        </a>
      `;
    }).join('');

    grid.style.display = 'flex';

  } catch (err) {
    console.error('Gallery load error:', err);
    loading.style.display = 'none';
    error.textContent = `Failed to load gallery: ${err.message}`;
    error.style.display = 'block';
  }
}

function getInitials(name) {
  return (name || 'A')
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function setupNavbarMobileGallery() {
  const navbar = document.getElementById('mainNavbar');
  const toggle = document.getElementById('navbarToggle');
  const menu = document.getElementById('navbarMenu');
  if (!navbar || !toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = navbar.classList.contains('is-open');
    navbar.classList.toggle('is-open', !isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}
