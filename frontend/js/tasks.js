/* ============================================================
   tasks.js – Tasks page
   ============================================================ */
const Tasks = (() => {
  let _projects = [];
  let _users    = [];

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  // ── Load tasks with optional filters ────────────────────
  async function load() {
    const container = document.getElementById('tasks-list');
    container.innerHTML = '<div class="empty-state">Loading…</div>';

    const status   = document.getElementById('task-filter-status').value;
    const priority = document.getElementById('task-filter-priority').value;
    const params   = new URLSearchParams();
    if (status)   params.set('status', status);
    if (priority) params.set('priority', priority);

    try {
      const res = await Api.get(`/tasks?${params}`);
      render(res.data);
    } catch (err) {
      container.innerHTML = `<div class="empty-state">Error: ${err.message}</div>`;
    }
  }

  function render(tasks) {
    const container = document.getElementById('tasks-list');
    const user = Auth.getUser();
    const isAdmin = user?.role === 'ADMIN';

    if (!tasks || tasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">✅</div>
          <p>No tasks found.</p>
        </div>`;
      return;
    }

    container.innerHTML = tasks.map(t => {
      const overdue = isOverdue(t.dueDate) && t.status !== 'DONE';
      const assigneeName = t.assignedTo?.name || '—';
      return `
        <div class="task-card" data-id="${t._id}">
          <div class="task-card-top">
            <span class="task-card-title">${esc(t.title)}</span>
            <div class="task-actions">
              ${isAdmin ? `
                <button class="btn-icon edit-task-btn" data-id="${t._id}" title="Edit">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-icon delete-task-btn" data-id="${t._id}" title="Delete">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>` : ''}
            </div>
          </div>
          ${t.description ? `<p class="task-card-desc">${esc(t.description)}</p>` : ''}
          <div class="task-card-meta">
            ${statusBadge(t.status)}
            ${priorityBadge(t.priority)}
          </div>
          <div class="task-card-footer">
            <div class="task-assignee">
              <div class="user-avatar" style="width:22px;height:22px;font-size:.65rem">${avatarLetter(assigneeName)}</div>
              ${esc(assigneeName)}
            </div>
            <span class="task-due ${overdue ? 'overdue' : ''}">
              ${overdue ? '⚠ ' : ''}${fmtDate(t.dueDate)}
            </span>
          </div>
          ${t.project?.title ? `<div style="margin-top:.4rem;font-size:.75rem;color:var(--muted)">📁 ${esc(t.project.title)}</div>` : ''}
          
          ${!isAdmin ? `
          <div style="margin-top:.75rem">
            <select class="status-select form-input" data-id="${t._id}" style="font-size:.8rem;padding:.35rem .6rem">
              <option value="TODO"        ${t.status==='TODO'?'selected':''}>To Do</option>
              <option value="IN_PROGRESS" ${t.status==='IN_PROGRESS'?'selected':''}>In Progress</option>
              <option value="DONE"        ${t.status==='DONE'?'selected':''}>Done</option>
            </select>
          </div>` : ''}
        </div>`;
    }).join('');

    // Admin: edit/delete
    container.querySelectorAll('.edit-task-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); openEditModal(btn.dataset.id, tasks); });
    });
    container.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        confirmAction('Delete this task permanently?', async () => {
          try {
            await Api.delete(`/tasks/${btn.dataset.id}`);
            showToast('Task deleted', 'success');
            load();
            Dashboard.load();
          } catch (err) { showToast(err.message, 'error'); }
        });
      });
    });

    // Member: inline status update
    container.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        try {
          await Api.patch(`/tasks/${sel.dataset.id}`, { status: sel.value });
          showToast('Status updated!', 'success');
          Dashboard.load();
        } catch (err) { showToast(err.message, 'error'); }
      });
    });
  }

  // ── Filters ──────────────────────────────────────────────
  document.getElementById('task-filter-status').addEventListener('change', load);
  document.getElementById('task-filter-priority').addEventListener('change', load);

  // ── Populate project & user selects ─────────────────────
  async function populateSelects(presetProjectId) {
    try {
      const [projRes, userRes] = await Promise.all([
        Api.get('/projects'),
        Api.get('/projects/users'),
      ]);
      _projects = projRes.data || [];
      _users    = userRes.data || [];
    } catch {
      _projects = [];
      _users = [];
    }

    const projSel = document.getElementById('task-project');
    projSel.innerHTML = '<option value="">— select project —</option>' +
      _projects.map(p => `<option value="${p._id}" ${p._id === presetProjectId ? 'selected' : ''}>${esc(p.title)}</option>`).join('');

    const userSel = document.getElementById('task-assignee');
    userSel.innerHTML = '<option value="">— select user —</option>' +
      _users.map(u => `<option value="${u._id}">${esc(u.name)} (${esc(u.email)})</option>`).join('');
  }

  // ── Open Create Modal ────────────────────────────────────
  async function openCreateModal(presetProjectId) {
    document.getElementById('modal-task-title').textContent = 'New Task';
    document.getElementById('task-form-id').value  = '';
    document.getElementById('task-title').value    = '';
    document.getElementById('task-desc').value     = '';
    document.getElementById('task-priority').value = 'MEDIUM';
    document.getElementById('task-status').value   = 'TODO';
    document.getElementById('task-due').value      = '';
    document.getElementById('task-form-submit').querySelector('.btn-text').textContent = 'Create Task';
    hideGlobalError('task-form-err');
    clearFieldErrors('task-title-err', 'task-project-err', 'task-assignee-err', 'task-due-err');
    await populateSelects(presetProjectId);
    openModal('modal-task');
  }

  // ── Open Edit Modal ──────────────────────────────────────
  async function openEditModal(id, tasks) {
    const t = tasks.find(x => x._id === id);
    if (!t) return;

    document.getElementById('modal-task-title').textContent = 'Edit Task';
    document.getElementById('task-form-id').value  = t._id;
    document.getElementById('task-title').value    = t.title;
    document.getElementById('task-desc').value     = t.description || '';
    document.getElementById('task-priority').value = t.priority;
    document.getElementById('task-status').value   = t.status;
    document.getElementById('task-due').value      = t.dueDate ? t.dueDate.split('T')[0] : '';
    document.getElementById('task-form-submit').querySelector('.btn-text').textContent = 'Save Changes';
    hideGlobalError('task-form-err');

    await populateSelects(t.project?._id || t.project);
    document.getElementById('task-project').value  = t.project?._id || t.project || '';
    document.getElementById('task-assignee').value = t.assignedTo?._id || t.assignedTo || '';
    openModal('modal-task');
  }

  // ── Task form submit ─────────────────────────────────────
  document.getElementById('task-form').addEventListener('submit', async e => {
    e.preventDefault();
    clearFieldErrors('task-title-err', 'task-project-err', 'task-assignee-err', 'task-due-err');
    hideGlobalError('task-form-err');

    const id         = document.getElementById('task-form-id').value;
    const title      = document.getElementById('task-title').value.trim();
    const description= document.getElementById('task-desc').value.trim();
    const project    = document.getElementById('task-project').value;
    const assignedTo = document.getElementById('task-assignee').value;
    const priority   = document.getElementById('task-priority').value;
    const status     = document.getElementById('task-status').value;
    const dueDate    = document.getElementById('task-due').value;

    let valid = true;
    if (!title)      { showFieldError('task-title-err', 'Title is required'); valid = false; }
    if (!project)    { showFieldError('task-project-err', 'Project is required'); valid = false; }
    if (!assignedTo) { showFieldError('task-assignee-err', 'Assignee is required'); valid = false; }
    if (!dueDate)    { showFieldError('task-due-err', 'Due date is required'); valid = false; }
    if (!valid) return;

    const payload = { title, description, project, assignedTo, priority, status, dueDate };
    const btn = document.getElementById('task-form-submit');
    setLoading(btn, true);
    try {
      if (id) {
        await Api.patch(`/tasks/${id}`, payload);
        showToast('Task updated!', 'success');
      } else {
        await Api.post('/tasks', payload);
        showToast('Task created!', 'success');
      }
      closeModal('modal-task');
      load();
      Dashboard.load();
    } catch (err) {
      showGlobalError('task-form-err', err.message);
    } finally {
      setLoading(btn, false);
    }
  });

  return { load, openCreateModal };
})();
