/* ============================================================
   dashboard.js – Dashboard page
   ============================================================ */
const Dashboard = (() => {

  async function load() {
    try {
      const res = await Api.get('/dashboard');
      const { stats, recentTasks, overdueTasksList } = res.data;
      renderStats(stats);
      renderRecentTasks(recentTasks);
      renderOverdueTasks(overdueTasksList);
    } catch (err) {
      showToast('Failed to load dashboard: ' + err.message, 'error');
    }
  }

  function renderStats(stats) {
    const grid = document.getElementById('stats-grid');
    const items = [
      { label: 'Total Projects', value: stats.totalProjects,  icon: '📁' },
      { label: 'Total Tasks',    value: stats.totalTasks,     icon: '📋' },
      { label: 'Completed',      value: stats.completedTasks, icon: '✅' },
      { label: 'Pending',        value: stats.pendingTasks,   icon: '⏳' },
      { label: 'Overdue',        value: stats.overdueTasks,   icon: '⚠️' },
    ];
    grid.innerHTML = items.map(i => `
      <div class="stat-card">
        <span class="stat-label">${i.label}</span>
        <span class="stat-value">${i.value ?? 0}</span>
        <div class="stat-icon">${i.icon}</div>
      </div>
    `).join('');
  }

  function renderRecentTasks(tasks) {
    const el = document.getElementById('recent-tasks-list');
    if (!tasks || tasks.length === 0) {
      el.innerHTML = '<div class="empty-state small"><div class="empty-icon">📭</div>No tasks yet</div>';
      return;
    }
    el.innerHTML = tasks.map(t => `
      <div class="task-mini-item">
        <div>
          ${statusBadge(t.status)}
        </div>
        <span class="task-mini-title">${esc(t.title)}</span>
        <span class="task-mini-meta">${t.project?.title ? esc(t.project.title) : ''}</span>
      </div>
    `).join('');
  }

  function renderOverdueTasks(tasks) {
    const el = document.getElementById('overdue-tasks-list');
    if (!tasks || tasks.length === 0) {
      el.innerHTML = '<div class="empty-state small"><div class="empty-icon">🎉</div>No overdue tasks!</div>';
      return;
    }
    el.innerHTML = tasks.map(t => `
      <div class="task-mini-item">
        <span class="task-mini-title">${esc(t.title)}</span>
        <span class="task-mini-meta overdue" style="color:var(--danger)">${fmtDate(t.dueDate)}</span>
      </div>
    `).join('');
  }

  // XSS-safe escape
  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  return { load };
})();
