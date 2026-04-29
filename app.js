/* ════════════════════════════════════════════
   Museo Interactivo · app.js
════════════════════════════════════════════ */
'use strict';

// ── State ─────────────────────────────────
const state = {
  user:   JSON.parse(localStorage.getItem('museo_user')   || 'null'),
  images: JSON.parse(localStorage.getItem('museo_images') || '[]'),
  dark:   localStorage.getItem('museo_dark') === 'true',
};

// ── Helpers ───────────────────────────────
function save() {
  localStorage.setItem('museo_user',   JSON.stringify(state.user));
  localStorage.setItem('museo_images', JSON.stringify(state.images));
  localStorage.setItem('museo_dark',   state.dark);
}

function initials(name = '') {
  return name.trim().slice(0, 2).toUpperCase() || 'U';
}

function today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function randomRating() {
  return Math.floor(Math.random() * 2) + 4; // 4–5 stars
}

function starsSVG(count) {
  const star = `<svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>`;
  return Array(count).fill(star).join('');
}

function buildCard(img) {
  const rating = img.rating ?? randomRating();
  const thumb  = img.dataUrl
    ? `<img class="card-thumb" src="${img.dataUrl}" alt="${img.artwork}" />`
    : `<div class="card-thumb"></div>`;

  return `
    <div class="image-card">
      ${thumb}
      <div class="card-body">
        <div class="card-field"><strong>Nombre:</strong> ${escapeHtml(img.artwork)}</div>
        <div class="card-field"><strong>Autor:</strong> ${escapeHtml(img.author)}</div>
        <div class="card-field"><strong>Fecha:</strong> ${escapeHtml(img.date)}</div>
        <div class="stars">${starsSVG(rating)}</div>
        <p class="card-description">Descripción: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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
  save();
  applyTheme();
}

// ── Navigation ────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  // Sync active state on bottom-nav buttons inside each screen
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === id);
  });

  if (id === 'screen-gallery')  renderGallery();
  if (id === 'screen-account')  renderAccount();
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
  const myImgs  = state.images.filter(i => i.owner === state.user?.name);
  const others  = state.images.filter(i => i.owner !== state.user?.name);

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
  btnEnter.addEventListener('click', () => {
    const nameEl   = document.getElementById('inp-name');
    const ageEl    = document.getElementById('inp-age');

    let valid = true;
    [nameEl, ageEl].forEach(el => {
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    });
    if (!valid) return;

    state.user = {
      name:   nameEl.value.trim(),
      age:    ageEl.value.trim(),
      course: document.getElementById('inp-course').value.trim(),
    };
    save();
    renderAvatars();
    showScreen('screen-upload');
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

  // Open file picker on click
  dropZone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      selectedDataUrl = e.target.result;
      previewImg.src = selectedDataUrl;
      previewImg.classList.remove('hidden');
      placeholder.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  });

  // Drag & drop
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.borderColor = 'var(--clr-primary)'; });
  dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event('change'));
    }
  });

  btnUpload.addEventListener('click', () => {
    const artworkEl = document.getElementById('inp-artwork');
    const authorEl  = document.getElementById('inp-author');

    let valid = true;
    [artworkEl, authorEl].forEach(el => {
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    });
    if (!valid) return;

    const newImage = {
      id:      Date.now(),
      artwork: artworkEl.value.trim(),
      author:  authorEl.value.trim(),
      date:    today(),
      owner:   state.user?.name || 'User',
      dataUrl: selectedDataUrl,
      rating:  randomRating(),
    };

    state.images.unshift(newImage);
    save();

    // Show success modal
    successModal.classList.remove('hidden');
  });

  btnAccept.addEventListener('click', () => {
    successModal.classList.add('hidden');
    // Reset form
    document.getElementById('inp-artwork').value = '';
    document.getElementById('inp-author').value  = '';
    fileInput.value = '';
    selectedDataUrl = null;
    previewImg.classList.add('hidden');
    placeholder.classList.remove('hidden');
    showScreen('screen-gallery');
  });
}

// ── Screen 4 · Account ────────────────────
function setupAccount() {
  document.getElementById('btn-edit-account').addEventListener('click', () => {
    const newName = prompt('Editar nombre:', state.user?.name || '');
    if (newName !== null && newName.trim()) {
      state.user.name = newName.trim();
      save();
      renderAvatars();
      renderAccount();
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
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });
}

// ── Sample "other users" data ─────────────
function seedSampleData() {
  const key = 'museo_seeded';
  if (localStorage.getItem(key)) return;
  const samples = [
    { id: 1001, artwork: 'Amanecer en el Caribe', author: 'María González', date: '24/04/2026', owner: 'OtroUsuario', dataUrl: null, rating: 5 },
    { id: 1002, artwork: 'Abstracción Urbana',    author: 'Carlos Pérez',   date: '24/04/2026', owner: 'OtroUsuario', dataUrl: null, rating: 4 },
    { id: 1003, artwork: 'Luz y Sombra',          author: 'Ana Martínez',   date: '25/04/2026', owner: 'OtroUsuario2', dataUrl: null, rating: 5 },
  ];
  state.images.push(...samples);
  save();
  localStorage.setItem(key, '1');
}

// ── Boot ──────────────────────────────────
function init() {
  applyTheme();
  seedSampleData();
  setupWelcome();
  setupUpload();
  setupAccount();
  setupThemeButtons();
  setupNav();

  // If user already registered, skip welcome
  if (state.user) {
    renderAvatars();
    showScreen('screen-upload');
  } else {
    showScreen('screen-welcome');
  }
}

document.addEventListener('DOMContentLoaded', init);
