/* ════════════════════════════════════════════
   Museo Interactivo · app.js
════════════════════════════════════════════ */
'use strict';

// ── API & State ───────────────────────────
const API_BASE = '/api';
const STORAGE_USER_ID = 'museo_user_id';

const state = {
  user: null,
  images: [],
  dark:   localStorage.getItem('museo_dark') === 'true',
};

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Error de comunicación con el servidor');
  }
  return payload;
}

// ── Helpers ───────────────────────────────
function saveClientState() {
  if (state.user?.id) {
    localStorage.setItem(STORAGE_USER_ID, state.user.id);
  }
  localStorage.setItem('museo_dark',   state.dark);
}

function initials(name = '') {
  return name.trim().slice(0, 2).toUpperCase() || 'U';
}

function today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function heartSVG(filled) {
  return filled
    ? `<svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
    : `<svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>`;
}

function heartHTML(image) {
  const heartsCount = Number(image.heartsCount) || 0;
  const viewerHasHeart = Boolean(image.viewerHasHeart);
  const ariaLabel = viewerHasHeart ? 'Quitar corazón a esta imagen' : 'Dar corazón a esta imagen';

  return `
    <div class="hearts" data-image-id="${escapeHtml(image.id)}">
      <button
        type="button"
        class="heart-btn ${viewerHasHeart ? 'active' : ''}"
        data-image-id="${escapeHtml(image.id)}"
        aria-label="${ariaLabel}"
        aria-pressed="${viewerHasHeart ? 'true' : 'false'}"
      >${heartSVG(viewerHasHeart)}</button>
      <span class="heart-count">${heartsCount}</span>
    </div>`;
}

function imageDetailHTML(image) {
  const description = image.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  return `
    <div class="detail-preview">
      <img class="detail-image" src="${image.dataUrl}" alt="${escapeHtml(image.artwork)}" />
    </div>
    <div class="detail-info">
      <h2 class="detail-title">${escapeHtml(image.artwork)}</h2>
      <div class="detail-meta"><strong>Autor:</strong> ${escapeHtml(image.author)}</div>
      <div class="detail-meta"><strong>Fecha:</strong> ${escapeHtml(image.date)}</div>
      <div class="detail-hearts">${heartHTML(image)}</div>
      <p class="detail-description">${escapeHtml(description)}</p>
    </div>`;
}

function buildCard(img) {
  const description = img.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  const thumb  = img.dataUrl
    ? `<button type="button" class="card-thumb-btn" data-image-id="${escapeHtml(img.id)}" aria-label="Ver ${escapeHtml(img.artwork)} en grande"><img class="card-thumb" src="${img.dataUrl}" alt="${img.artwork}" /></button>`
    : `<div class="card-thumb"></div>`;

  return `
    <div class="image-card">
      ${thumb}
      <div class="card-body">
        <div class="card-field"><strong>Nombre de la obra:</strong> ${escapeHtml(img.artwork)}</div>
        <div class="card-field"><strong>Autor:</strong> ${escapeHtml(img.author)}</div>
        <div class="card-field"><strong>Fecha:</strong> ${escapeHtml(img.date)}</div>
        ${heartHTML(img)}
        <p class="card-description">Descripción: ${escapeHtml(description)}</p>
      </div>
    </div>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Theme ─────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.dark ? 'dark' : '');
}

function toggleTheme() {
  state.dark = !state.dark;
  saveClientState();
  applyTheme();
}

// ── Navigation ────────────────────────────
async function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  // Sync active state on bottom-nav buttons inside each screen
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === id);
  });

  if (id === 'screen-gallery') {
    await refreshImages();
    renderGallery();
  }
  if (id === 'screen-account')  renderAccount();
}

async function refreshImages() {
  const userId = state.user?.id || '';
  const data = await api(`/images?userId=${encodeURIComponent(userId)}`);
  state.images = data.images || [];
}

// ── Render helpers ────────────────────────
function renderAvatars() {
  const name = state.user?.name || 'User';
  const ini  = initials(name);
  ['upload','gallery','account'].forEach(key => {
    const el = document.getElementById(`header-avatar-${key}`);
    const nm = document.getElementById(`header-name-${key}`);
    if (el) el.textContent = ini;
    if (nm) nm.textContent = name;
  });
}

function renderGallery() {
  const myEl    = document.getElementById('my-images');
  const otherEl = document.getElementById('other-images');
  const myImgs  = state.images.filter(i => i.ownerId === state.user?.id);
  const others  = state.images.filter(i => i.ownerId !== state.user?.id);

  myEl.innerHTML    = myImgs.length  ? myImgs.map(buildCard).join('')  : '<p class="empty-msg">Aún no has subido imágenes.</p>';
  otherEl.innerHTML = others.length  ? others.map(buildCard).join('') : '<p class="empty-msg">No hay imágenes de otros usuarios.</p>';
}

function renderAccount() {
  const nameEl = document.getElementById('acc-name');
  if (nameEl) nameEl.textContent = state.user?.name || 'User';
}

// ── Screen 1 · Registration ───────────────
function setupWelcome() {
  const btnEnter = document.getElementById('btn-enter');
  btnEnter.addEventListener('click', async () => {
    const nameEl   = document.getElementById('inp-name');
    const ageEl    = document.getElementById('inp-age');

    let valid = true;
    [nameEl, ageEl].forEach(el => {
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    });
    if (!valid) return;

    btnEnter.disabled = true;
    try {
      const response = await api('/users/register', {
        method: 'POST',
        body: JSON.stringify({
          name:   nameEl.value.trim(),
          age:    ageEl.value.trim(),
          course: document.getElementById('inp-course').value.trim(),
        }),
      });

      state.user = response.user;
      saveClientState();
      renderAvatars();
      await showScreen('screen-upload');
    } catch (error) {
      alert(error.message);
    } finally {
      btnEnter.disabled = false;
    }
  });

  // Remove error class on input
  ['inp-name','inp-age'].forEach(id => {
    document.getElementById(id).addEventListener('input', e => e.target.classList.remove('error'));
  });
}

// ── Screen 2 · Upload ─────────────────────
function setupUpload() {
  const dropZone     = document.getElementById('upload-drop-zone');
  const fileInput    = document.getElementById('file-input');
  const placeholder  = document.getElementById('upload-placeholder');
  const previewImg   = document.getElementById('preview-img');
  const btnUpload    = document.getElementById('btn-upload');
  const successModal = document.getElementById('upload-success');
  const btnAccept    = document.getElementById('btn-accept');

  let selectedDataUrl = null;

  function processSelectedFile(file) {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen.');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      selectedDataUrl = e.target.result;
      previewImg.src = selectedDataUrl;
      previewImg.classList.remove('hidden');
      placeholder.classList.add('hidden');
      dropZone.style.borderColor = '';
    };
    reader.readAsDataURL(file);
  }

  // Open file picker on click
  dropZone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    processSelectedFile(fileInput.files[0]);
  });

  // Drag & drop
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.borderColor = 'var(--clr-primary)'; });
  dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    processSelectedFile(file);
  });

  btnUpload.addEventListener('click', async () => {
    const artworkEl = document.getElementById('inp-artwork');
    const descriptionEl = document.getElementById('inp-description');

    let valid = true;
    [artworkEl, descriptionEl].forEach(el => {
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    });
    if (!selectedDataUrl) {
      valid = false;
      dropZone.style.borderColor = 'var(--clr-error)';
      alert('Selecciona una imagen antes de subirla.');
    }
    if (!valid) return;

    btnUpload.disabled = true;
    try {
      const response = await api('/images', {
        method: 'POST',
        body: JSON.stringify({
          ownerId: state.user?.id,
          artwork: artworkEl.value.trim(),
          description: descriptionEl.value.trim() || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          dataUrl: selectedDataUrl,
          date: today(),
          rating: 0,
        }),
      });

      if (response.image) {
        state.images.unshift(response.image);
      }

      successModal.classList.remove('hidden');
    } catch (error) {
      alert(error.message);
    } finally {
      btnUpload.disabled = false;
    }
  });

  btnAccept.addEventListener('click', async () => {
    successModal.classList.add('hidden');
    // Reset form
    document.getElementById('inp-artwork').value = '';
    document.getElementById('inp-description').value = '';
    fileInput.value = '';
    selectedDataUrl = null;
    previewImg.classList.add('hidden');
    placeholder.classList.remove('hidden');
    await showScreen('screen-gallery');
  });
}

function setupImageRatings() {
  document.addEventListener('click', async event => {
    const button = event.target.closest('.heart-btn');
    if (!button) return;

    const imageId = button.dataset.imageId;
    if (!imageId) return;

    button.disabled = true;
    try {
      const response = await api(`/images/${encodeURIComponent(imageId)}/heart`, {
        method: 'POST',
        body: JSON.stringify({ userId: state.user?.id }),
      });

      if (response.image) {
        state.images = state.images.map(image => (image.id === response.image.id ? response.image : image));
        renderGallery();

        const modal = document.getElementById('image-detail-modal');
        const modalContent = document.getElementById('image-detail-content');
        if (modal && !modal.classList.contains('hidden') && modal.dataset.imageId === response.image.id) {
          modalContent.innerHTML = imageDetailHTML(response.image);
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      button.disabled = false;
    }
  });
}

function setupImageDetails() {
  const modal = document.getElementById('image-detail-modal');
  const modalContent = document.getElementById('image-detail-content');
  const modalClose = document.getElementById('btn-close-image-detail');

  function closeModal() {
    modal?.classList.add('hidden');
    modal?.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('.card-thumb-btn');
    if (!trigger) return;

    const imageId = trigger.dataset.imageId;
    const image = state.images.find(item => item.id === imageId);
    if (!image || !image.dataUrl) return;

    modalContent.innerHTML = imageDetailHTML(image);
    modal.dataset.imageId = image.id;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal?.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// ── Screen 4 · Account ────────────────────
function setupAccount() {
  document.getElementById('btn-edit-account').addEventListener('click', async () => {
    const newName = prompt('Editar nombre:', state.user?.name || '');
    if (newName !== null && newName.trim()) {
      try {
        const response = await api(`/users/${encodeURIComponent(state.user.id)}`, {
          method: 'PUT',
          body: JSON.stringify({ name: newName.trim() }),
        });
        state.user = response.user;
        saveClientState();
        renderAvatars();
        renderAccount();
      } catch (error) {
        alert(error.message);
      }
    }
  });
}

// ── Theme toggles ─────────────────────────
function setupThemeButtons() {
  ['btn-theme-upload','btn-theme-gallery','btn-theme-account'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', toggleTheme);
  });
}

// ── Nav buttons ───────────────────────────
function setupNav() {
  document.querySelectorAll('.nav-btn[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      showScreen(btn.dataset.screen).catch(error => alert(error.message));
    });
  });
}

// ── Boot ──────────────────────────────────
async function init() {
  applyTheme();
  setupWelcome();
  setupUpload();
  setupAccount();
  setupImageRatings();
  setupImageDetails();
  setupThemeButtons();
  setupNav();

  const storedUserId = localStorage.getItem(STORAGE_USER_ID);

  try {
    const data = await api(`/bootstrap?userId=${encodeURIComponent(storedUserId || '')}`);
    state.user = data.user;
    state.images = data.images || [];
  } catch (error) {
    alert(error.message);
  }

  // If user already registered, skip welcome
  if (state.user) {
    renderAvatars();
    await showScreen('screen-upload');
  } else {
    localStorage.removeItem(STORAGE_USER_ID);
    await showScreen('screen-welcome');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init().catch(error => alert(error.message));
});
