/* ============================================================
   projects.js – Projects page + Project Detail
   ============================================================ */
const Projects = (() => {
  let _allUsers = [];

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  // ── Load projects list ───────────────────────────────────
  async function load() {
    const container = document.getElementById('projects-list');
    container.innerHTML = '<div class="empty-state">Loading…</div>';
    try {
      const res = await Api.get('/projects');
      render(res.data);
    } catch (err) {
      container.innerHTML = `<div class="empty-state">Error: ${err.message}</div>`;
    }
  }

  function render(projects) {
    const container = document.getElementById('projects-list');
    const user = Auth.getUser();
    const isAdmin = user?.role === 'ADMIN';

    if (!projects || projects.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">📁</div>
          <p>${isAdmin ? 'No projects yet. Create your first project!' : 'No projects assigned to you yet.'}</p>
        </div>`;
      return;
    }

    container.innerHTML = projects.map(p => {
      const members = p.members || [];
      const chips = members.slice(0, 4).map(m =>
        `<div class="chip" title="${esc(m.name || '')}">${avatarLetter(m.name)}</div>`
      ).join('');
      const extra = members.length > 4 ? `<span class="member-count">+${members.length - 4}</span>` : '';
      return `
        <div class="project-card" data-id="${p._id}">
          <div class="project-card-header">
            <span class="project-card-title">${esc(p.title)}</span>
          </div>
          <p class="project-card-desc">${esc(p.description) || '<span style="color:var(--muted)">No description</span>'}</p>
          <div class="project-card-footer">
            <div class="member-chips">${chips}</div>
            ${extra}
            <span style="margin-left:auto;font-size:.75rem;color:var(--muted)">${members.length} member${members.length !== 1 ? 's' : ''}</span>
          </div>
        </div>`;
    }).join('');

    container.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => loadDetail(card.dataset.id));
    });
  }

  // ── Project Detail ───────────────────────────────────────
  async function loadDetail(id) {
    navigateTo('project-detail');
    document.getElementById('project-detail-content').innerHTML = '<div class="empty-state">Loading…</div>';

    try {
      const [projRes] = await Promise.all([Api.get(`/projects/${id}`)]);
      const project = projRes.data;
      renderDetail(project);
    } catch (err) {
      document.getElementById('project-detail-content').innerHTML =
        `<div class="empty-state">Error: ${err.message}</div>`;
    }
  }

  function renderDetail(p) {
    const user = Auth.getUser();
    const isAdmin = user?.role === 'ADMIN';
    const members = p.members || [];

    const membersHtml = members.length === 0
      ? '<p style="color:var(--muted);font-size:.85rem">No members yet.</p>'
      : members.map(m => `
          <div class="member-row">
            <div class="user-avatar" style="width:32px;height:32px;font-size:.75rem">${avatarLetter(m.name)}</div>
            <span class="member-row-name">${esc(m.name)}</span>
            <span class="member-row-email">${esc(m.email)}</span>
            ${roleBadge(m.role)}
            ${isAdmin ? `<button class="btn-icon remove-member-btn" data-project="${p._id}" data-user="${m._id}" title="Remove member">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>` : ''}
          </div>`).join('');

    document.getElementById('project-detail-content').innerHTML = `
      <div class="project-detail-header">
        <div>
          <h1 class="project-detail-title">${esc(p.title)}</h1>
          <p class="project-detail-desc">${esc(p.description) || ''}</p>
        </div>
        ${isAdmin ? `
          <div style="display:flex;gap:.5rem;flex-wrap:wrap">
            <button class="btn btn-ghost btn-sm" id="detail-edit-btn">Edit</button>
            <button class="btn btn-primary btn-sm" id="detail-add-member-btn">+ Add Member</button>
            <button class="btn btn-primary btn-sm" id="detail-new-task-btn">+ New Task</button>
          </div>` : ''}
      </div>
      <h3 class="section-title">Members</h3>
      <div class="members-list">${membersHtml}</div>
    `;

    if (isAdmin) {
      document.getElementById('detail-edit-btn')?.addEventListener('click', () => openEditModal(p));
      document.getElementById('detail-add-member-btn')?.addEventListener('click', () => openAddMemberModal(p._id));
      document.getElementById('detail-new-task-btn')?.addEventListener('click', () => Tasks.openCreateModal(p._id));
    }

    document.querySelectorAll('.remove-member-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        confirmAction(`Remove this member from "${p.title}"?`, async () => {
          try {
            await Api.delete(`/projects/${btn.dataset.project}/members/${btn.dataset.user}`);
            showToast('Member removed', 'success');
            loadDetail(p._id);
          } catch (err) { showToast(err.message, 'error'); }
        });
      });
    });
  }

  // ── Create/Edit Modal ────────────────────────────────────
  function openCreateModal() {
    document.getElementById('modal-project-title').textContent = 'New Project';
    document.getElementById('project-form-id').value = '';
    document.getElementById('project-title').value   = '';
    document.getElementById('project-desc').value    = '';
    document.getElementById('project-form-submit').querySelector('.btn-text').textContent = 'Create Project';
    hideGlobalError('project-form-err');
    openModal('modal-project');
  }

  function openEditModal(p) {
    document.getElementById('modal-project-title').textContent = 'Edit Project';
    document.getElementById('project-form-id').value = p._id;
    document.getElementById('project-title').value   = p.title;
    document.getElementById('project-desc').value    = p.description || '';
    document.getElementById('project-form-submit').querySelector('.btn-text').textContent = 'Save Changes';
    hideGlobalError('project-form-err');
    openModal('modal-project');
  }

  document.getElementById('project-form').addEventListener('submit', async e => {
    e.preventDefault();
    const id    = document.getElementById('project-form-id').value;
    const title = document.getElementById('project-title').value.trim();
    const desc  = document.getElementById('project-desc').value.trim();

    if (!title) { showFieldError('project-title-err', 'Title is required'); return; }
    clearFieldErrors('project-title-err');
    hideGlobalError('project-form-err');

    const btn = document.getElementById('project-form-submit');
    setLoading(btn, true);
    try {
      if (id) {
        await Api.patch(`/projects/${id}`, { title, description: desc });
        showToast('Project updated!', 'success');
      } else {
        await Api.post('/projects', { title, description: desc });
        showToast('Project created!', 'success');
      }
      closeModal('modal-project');
      load();
    } catch (err) {
      showGlobalError('project-form-err', err.message);
    } finally {
      setLoading(btn, false);
    }
  });

  // ── Add Member Modal ─────────────────────────────────────
  async function openAddMemberModal(projectId) {
    document.getElementById('member-project-id').value = projectId;
    document.getElementById('member-select').innerHTML = '<option value="">Loading users…</option>';
    hideGlobalError('member-form-err');
    openModal('modal-member');

    try {
      const res = await Api.get('/projects/users');
      _allUsers = res.data;
      const select = document.getElementById('member-select');
      select.innerHTML = '<option value="">— choose a user —</option>' +
        _allUsers.map(u => `<option value="${u._id}">${esc(u.name)} (${esc(u.email)})</option>`).join('');
    } catch (err) {
      document.getElementById('member-select').innerHTML = '<option value="">Failed to load users</option>';
    }
  }

  document.getElementById('member-form').addEventListener('submit', async e => {
    e.preventDefault();
    const projectId = document.getElementById('member-project-id').value;
    const userId    = document.getElementById('member-select').value;
    if (!userId) { showFieldError('member-select-err', 'Please select a user'); return; }
    clearFieldErrors('member-select-err');
    hideGlobalError('member-form-err');

    const btn = e.target.querySelector('[type="submit"]');
    setLoading(btn, true);
    try {
      await Api.post(`/projects/${projectId}/members`, { userId });
      showToast('Member added!', 'success');
      closeModal('modal-member');
      loadDetail(projectId);
    } catch (err) {
      showGlobalError('member-form-err', err.message);
    } finally {
      setLoading(btn, false);
    }
  });

  // ── Back button ──────────────────────────────────────────
  document.getElementById('back-to-projects').addEventListener('click', () => {
    navigateTo('projects');
    load();
  });

  return { load, loadDetail, openCreateModal, getAllUsers: () => _allUsers };
})();
