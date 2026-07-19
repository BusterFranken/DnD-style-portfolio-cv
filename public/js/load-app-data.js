/* ============================================
   LOAD-APP-DATA — Unified data loading layer
   Checks URL ?slug= → API fetch → fallback to data.js on failure
   Must be loaded AFTER data.js and BEFORE main.js
   ============================================ */

// Global flag: are we loading external data?
window.__appDataLoading = true;
window.__appDataSlug = null;
window.__appDataSource = 'default'; // 'default' | 'localStorage' | 'api'

/**
 * Detect slug from URL query parameter.
 */
function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug') || null;
}

/**
 * Apply an app data blob to the global variables that the existing
 * render.js, overlay.js, and main.js expect.
 *
 * IMPORTANT: data.js uses `const` for all globals. Const bindings are
 * script-scoped and can't be reassigned via window.xxx. We must MUTATE
 * the existing objects/arrays in-place so that all references (including
 * those captured at const declaration time) see the new values.
 */
function applyAppData(appData) {
  if (!appData || !appData.characterData) return;

  // Mutate characterData object in-place (clear old keys, assign new)
  if (typeof characterData !== 'undefined' && appData.characterData) {
    // Remove all existing keys first
    Object.keys(characterData).forEach(k => delete characterData[k]);
    Object.assign(characterData, appData.characterData);
  } else {
    window.characterData = appData.characterData;
  }

  // Mutate arrays in-place: clear then push new items
  if (appData.campaignsData && typeof campaignsData !== 'undefined') {
    campaignsData.length = 0;
    campaignsData.push(...appData.campaignsData);
  } else if (appData.campaignsData) {
    window.campaignsData = appData.campaignsData;
  }

  if (appData.sideQuests && typeof sideQuests !== 'undefined') {
    sideQuests.length = 0;
    sideQuests.push(...appData.sideQuests);
  } else if (appData.sideQuests) {
    window.sideQuests = appData.sideQuests;
  }

  if (appData.notableAdventures && typeof notableAdventures !== 'undefined') {
    notableAdventures.length = 0;
    notableAdventures.push(...appData.notableAdventures);
  } else if (appData.notableAdventures) {
    window.notableAdventures = appData.notableAdventures;
  }

  if (appData.notableEncounters && typeof notableEncounters !== 'undefined') {
    notableEncounters.length = 0;
    notableEncounters.push(...appData.notableEncounters);
  } else if (appData.notableEncounters) {
    window.notableEncounters = appData.notableEncounters;
  }

  // Mutate mediaMentions object in-place
  if (appData.mediaMentions && typeof mediaMentions !== 'undefined') {
    Object.keys(mediaMentions).forEach(k => delete mediaMentions[k]);
    Object.assign(mediaMentions, appData.mediaMentions);
  } else if (appData.mediaMentions) {
    window.mediaMentions = appData.mediaMentions;
  }

  // Store reference
  window.__appData = appData;
}

/**
 * Save app data to localStorage (for refresh resilience).
 * Only saves when viewing your own sheet (not someone else's via slug).
 */
function cacheAppData(appData, slug) {
  try {
    localStorage.setItem('dnd_cv_creator_data', JSON.stringify(appData));
    if (slug) localStorage.setItem('dnd_cv_creator_slug', slug);
  } catch (e) {
    console.warn('Could not cache app data:', e.message);
  }
}

/**
 * Load app data from localStorage.
 */
function loadCachedAppData() {
  try {
    const raw = localStorage.getItem('dnd_cv_creator_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load cached data:', e.message);
  }
  return null;
}

/**
 * Get cached slug.
 */
function getCachedSlug() {
  return localStorage.getItem('dnd_cv_creator_slug') || null;
}

/**
 * Fetch sheet data from the API by slug.
 */
async function fetchSheetBySlug(slug) {
  const resp = await fetch(`/api/sheets/${encodeURIComponent(slug)}`);
  if (!resp.ok) return null;
  const json = await resp.json();
  return json.data || null;
}

/**
 * Main data loading entrypoint. Called before init().
 * Returns a promise that resolves when data is ready.
 *
 * Only loads generated data when the URL contains ?slug=xxx.
 * Without a slug, the page always shows the default data.js content
 * (the site owner's personal page). This prevents generated sheets
 * from overwriting the main page via localStorage.
 */
async function loadAppData() {
  const slug = getSlugFromURL();

  // Only load external data when there's a slug in the URL
  if (slug) {
    try {
      const data = await fetchSheetBySlug(slug);
      if (data) {
        applyAppData(data);
        window.__appDataSlug = slug;
        window.__appDataSource = 'api';
        console.log('❖ Loaded sheet from API:', slug);
        window.__appDataLoading = false;
        return;
      }
    } catch (e) {
      console.warn('Failed to fetch sheet by slug:', e.message);
    }
  }

  // No slug → always use default data.js (the site owner's content)
  window.__appDataSource = 'default';
  window.__appData = {
    characterData: typeof characterData !== 'undefined' ? characterData : {},
    campaignsData: typeof campaignsData !== 'undefined' ? campaignsData : [],
    sideQuests: typeof sideQuests !== 'undefined' ? sideQuests : [],
    notableAdventures: typeof notableAdventures !== 'undefined' ? notableAdventures : [],
    notableEncounters: typeof notableEncounters !== 'undefined' ? notableEncounters : [],
    mediaMentions: typeof mediaMentions !== 'undefined' ? mediaMentions : {},
  };
  console.log('❖ Using default data.js');
  window.__appDataLoading = false;
}

/**
 * Clear locally cached creator data.
 */
function clearCreatorCache() {
  localStorage.removeItem('dnd_cv_creator_data');
  localStorage.removeItem('dnd_cv_creator_slug');
}
