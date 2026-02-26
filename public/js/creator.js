/* ============================================
   CREATOR PAGE — Upload CV, generate D&D sheet
   ============================================ */

document.addEventListener('DOMContentLoaded', initCreator);

function initCreator() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  const generateBtn = document.getElementById('generateBtn');
  const uploadCard = document.getElementById('uploadCard');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const successCard = document.getElementById('successCard');
  const errorMsg = document.getElementById('errorMsg');
  const loadingStep = document.getElementById('loadingStep');
  const loadingDetail = document.getElementById('loadingDetail');
  const progressDots = document.querySelectorAll('.progress-dot');

  let selectedFiles = [];

  // ── Dropzone events ──
  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-over');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    addFiles(Array.from(e.dataTransfer.files));
  });

  fileInput.addEventListener('change', () => {
    addFiles(Array.from(fileInput.files));
    fileInput.value = '';
  });

  function addFiles(files) {
    for (const f of files) {
      if (!selectedFiles.find(sf => sf.name === f.name && sf.size === f.size)) {
        selectedFiles.push(f);
      }
    }
    renderFileList();
    updateGenerateBtn();
  }

  function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFileList();
    updateGenerateBtn();
  }

  function renderFileList() {
    if (selectedFiles.length === 0) {
      fileList.innerHTML = '';
      return;
    }
    fileList.innerHTML = selectedFiles.map((f, i) => `
      <div class="file-item">
        <span class="file-item-name">📄 ${f.name} <small>(${formatSize(f.size)})</small></span>
        <button class="file-item-remove" data-index="${i}" title="Remove">&times;</button>
      </div>
    `).join('');

    fileList.querySelectorAll('.file-item-remove').forEach(btn => {
      btn.addEventListener('click', () => removeFile(parseInt(btn.dataset.index)));
    });
  }

  function updateGenerateBtn() {
    generateBtn.disabled = selectedFiles.length === 0;
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  // ── Generate button ──
  generateBtn.addEventListener('click', startGeneration);

  async function startGeneration() {
    if (selectedFiles.length === 0) return;

    uploadCard.style.display = 'none';
    loadingOverlay.classList.add('active');
    errorMsg.classList.remove('active');
    successCard.classList.remove('active');

    // Hide past sheets during generation
    const pastSection = document.getElementById('pastSheetsSection');
    if (pastSection) pastSection.style.display = 'none';

    updateProgress(0, 'Uploading documents...');

    try {
      const formData = new FormData();
      for (const f of selectedFiles) {
        formData.append('files', f);
      }

      // Step 1: Upload and create job
      const createResp = await fetch('/api/create', {
        method: 'POST',
        body: formData,
      });

      if (!createResp.ok) {
        const err = await createResp.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `Server error: ${createResp.status}`);
      }

      const createResult = await createResp.json();
      if (!createResult.success || !createResult.jobId) {
        throw new Error('Failed to start generation job');
      }

      const jobId = createResult.jobId;
      updateProgress(1, 'Processing your CV...', 'Starting AI generation');

      // Step 2: Trigger processing (fire and forget - it may timeout but will continue)
      fetch(`/api/job/${jobId}`, { method: 'POST' }).catch(() => {});

      // Step 3: Poll for completion
      const result = await pollForCompletion(jobId);

      progressDots.forEach(d => { d.classList.remove('active'); d.classList.add('done'); });
      updateProgress(5, 'Complete!');

      // Save to database and get slug
      let slug = null;
      try {
        const saveResp = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: result }),
        });
        if (saveResp.ok) {
          const saveResult = await saveResp.json();
          slug = saveResult.slug;
        }
      } catch (e) {
        console.warn('Could not save to database:', e.message);
      }

      showSuccess(result, slug);

    } catch (err) {
      console.error('Generation failed:', err);
      loadingOverlay.classList.remove('active');
      uploadCard.style.display = 'block';
      if (pastSection) pastSection.style.display = '';
      errorMsg.textContent = `Generation failed: ${err.message}`;
      errorMsg.classList.add('active');
    }
  }

  async function pollForCompletion(jobId) {
    const steps = [
      { step: 1, msg: 'Analyzing your CV...', detail: 'Extracting text and key information' },
      { step: 2, msg: 'Rolling ability scores...', detail: 'Mapping skills to D&D attributes' },
      { step: 3, msg: 'Building campaign history...', detail: 'Converting work experience to adventures' },
      { step: 4, msg: 'Documenting achievements...', detail: 'Creating notable encounters' },
      { step: 5, msg: 'Finalizing character...', detail: 'Almost done!' },
    ];

    let pollCount = 0;
    const maxPolls = 60; // 60 * 3s = 3 minutes max
    const pollInterval = 3000; // 3 seconds

    while (pollCount < maxPolls) {
      await new Promise(r => setTimeout(r, pollInterval));
      pollCount++;

      // Update progress UI
      const stepIndex = Math.min(Math.floor(pollCount / 4), steps.length - 1);
      const s = steps[stepIndex];
      updateProgress(s.step, s.msg, s.detail);

      try {
        const resp = await fetch(`/api/job/${jobId}`);
        if (!resp.ok) {
          console.warn('Poll failed, retrying...');
          continue;
        }

        const job = await resp.json();

        if (job.status === 'complete' && job.result) {
          return job.result;
        }

        if (job.status === 'failed') {
          throw new Error(job.error || 'Generation failed');
        }

        // Still pending or processing - continue polling
        if (job.status === 'pending') {
          // Trigger processing again in case first request timed out
          fetch(`/api/job/${jobId}`, { method: 'POST' }).catch(() => {});
        }

      } catch (err) {
        console.warn('Poll error:', err.message);
        // Continue polling unless it's a definitive error
        if (err.message && !err.message.includes('Poll failed')) {
          throw err;
        }
      }
    }

    throw new Error('Generation timed out. Please try again.');
  }

  function updateProgress(step, message, detail) {
    loadingStep.textContent = message;
    if (detail) loadingDetail.textContent = detail;

    progressDots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < step - 1) dot.classList.add('done');
      else if (i === step - 1) dot.classList.add('active');
    });
  }

  function showSuccess(appData, slug) {
    loadingOverlay.classList.remove('active');
    successCard.classList.add('active');

    const name = appData.characterData?.personal?.name || 'Your Character';
    document.getElementById('successName').textContent = name;

    const baseUrl = window.location.origin;
    const shareLink = slug ? `${baseUrl}/index.html?slug=${slug}` : null;
    const shareLinkEl = document.getElementById('shareLink');
    const shareLinkBox = document.querySelector('.share-link-box');

    if (shareLink) {
      shareLinkEl.textContent = shareLink;
      shareLinkBox.style.display = 'flex';
      document.getElementById('viewSheetBtn').href = `index.html?slug=${slug}`;
      const viewCampaignsBtn = document.getElementById('viewCampaignsBtn');
      if (viewCampaignsBtn) viewCampaignsBtn.href = `campaigns.html?slug=${slug}`;
    } else {
      shareLinkBox.style.display = 'none';
      document.getElementById('viewSheetBtn').href = 'index.html';
    }

    document.getElementById('copyLinkBtn').addEventListener('click', () => {
      navigator.clipboard.writeText(shareLink || baseUrl).then(() => {
        const btn = document.getElementById('copyLinkBtn');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy Link', 2000);
      });
    });
  }

  // ── Load past sheets by this user's IP ──
  loadPastSheets();

  setupNavbarMobileCreator();
}

// ── Past Sheets Section ──
async function loadPastSheets() {
  const container = document.getElementById('pastSheetsGrid');
  const section = document.getElementById('pastSheetsSection');
  if (!container || !section) return;

  try {
    const resp = await fetch('/api/my-sheets');
    if (!resp.ok) return;
    const data = await resp.json();
    const sheets = data.sheets || [];

    if (sheets.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = '';
    container.innerHTML = sheets.map(s => {
      const initials = s.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
      const date = new Date(s.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      return `
        <a href="index.html?slug=${s.slug}" class="past-sheet-card">
          <div class="past-sheet-avatar">${initials}</div>
          <div class="past-sheet-info">
            <div class="past-sheet-name">${s.name}</div>
            <div class="past-sheet-title">${s.title || 'Adventurer'}</div>
            <div class="past-sheet-date">${date}</div>
          </div>
          <span class="past-sheet-arrow">→</span>
        </a>
      `;
    }).join('');
  } catch (e) {
    console.warn('Could not load past sheets:', e.message);
  }
}

function setupNavbarMobileCreator() {
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

  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('is-open') && !navbar.contains(e.target)) {
      navbar.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}
