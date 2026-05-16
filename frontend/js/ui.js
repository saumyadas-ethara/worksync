/* ============================================================
   ui.js – Shared UI helpers
   ============================================================ */

// ── Toast ─────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  t.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; t.style.transition = '.3s'; setTimeout(() => t.remove(), 300); }, 3500);
}

// ── Modal ─────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Close buttons with data-modal attribute
document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.modal));
});

// ── Set loading state on a button ─────────────────────────
function setLoading(btn, loading) {
  const text = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  if (!text || !loader) return;
  btn.disabled = loading;
  text.classList.toggle('hidden', loading);
  loader.classList.toggle('hidden', !loading);
}

// ── Show / hide error ─────────────────────────────────────
function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearFieldErrors(...ids) {
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; });
}
function showGlobalError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}
function hideGlobalError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

// ── Page navigation ───────────────────────────────────────
const pages = {};  // populated by app.js

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.getElementById(`nav-${pageId}`);
  if (navItem) navItem.classList.add('active');

  const titles = { dashboard: 'Dashboard', projects: 'Projects', tasks: 'Tasks', 'project-detail': 'Project Detail' };
  document.getElementById('topbar-title').textContent = titles[pageId] || 'WorkSync';

  // Update topbar action buttons
  renderTopbarActions(pageId);
}

// ── Topbar action buttons (role-aware) ───────────────────
function renderTopbarActions(pageId) {
  const container = document.getElementById('topbar-actions');
  container.innerHTML = '';
  const user = Auth.getUser();
  if (!user) return;
  const isAdmin = user.role === 'ADMIN';

  if (pageId === 'projects' && isAdmin) {
    container.innerHTML = `<button id="btn-new-project" class="btn btn-primary btn-sm">+ New Project</button>`;
    document.getElementById('btn-new-project').addEventListener('click', () => Projects.openCreateModal());
  }
  if (pageId === 'tasks' && isAdmin) {
    container.innerHTML = `<button id="btn-new-task" class="btn btn-primary btn-sm">+ New Task</button>`;
    document.getElementById('btn-new-task').addEventListener('click', () => Tasks.openCreateModal());
  }
}

// ── Badge helpers ─────────────────────────────────────────
function statusBadge(s) {
  const map = { TODO: 'badge-todo', IN_PROGRESS: 'badge-inprogress', DONE: 'badge-done' };
  const labels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
  return `<span class="badge ${map[s] || ''}">${labels[s] || s}</span>`;
}
function priorityBadge(p) {
  const map = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high' };
  return `<span class="badge ${map[p] || ''}">${p}</span>`;
}
function roleBadge(r) {
  return `<span class="badge ${r === 'ADMIN' ? 'badge-admin' : 'badge-member'}">${r}</span>`;
}

// ── Confirm dialog ────────────────────────────────────────
function confirmAction(msg, onOk) {
  document.getElementById('modal-confirm-msg').textContent = msg;
  openModal('modal-confirm');
  const okBtn = document.getElementById('confirm-ok');
  const cancelBtn = document.getElementById('confirm-cancel');
  const cleanup = () => { okBtn.replaceWith(okBtn.cloneNode(true)); cancelBtn.replaceWith(cancelBtn.cloneNode(true)); };
  document.getElementById('confirm-ok').addEventListener('click', () => { closeModal('modal-confirm'); cleanup(); onOk(); }, { once: true });
  document.getElementById('confirm-cancel').addEventListener('click', () => { closeModal('modal-confirm'); cleanup(); }, { once: true });
}

// ── Date formatting ───────────────────────────────────────
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function isOverdue(d) {
  return d && new Date(d) < new Date() ;
}

// ── Avatar letter ─────────────────────────────────────────
function avatarLetter(name) {
  return (name || '?')[0].toUpperCase();
}

// ── Toggle password visibility ────────────────────────────
document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', () => {
    const inp = document.getElementById(btn.dataset.target);
    if (!inp) return;
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });
});
