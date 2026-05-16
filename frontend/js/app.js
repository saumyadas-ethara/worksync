/* ============================================================
   app.js – Main application bootstrap
   ============================================================ */
const App = (() => {

  function boot() {
    navigateTo('dashboard');
    Dashboard.load();
    setupNav();
    setupSidebar();
  }

  function setupNav() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const page = item.dataset.page;

        // Close sidebar on mobile
        document.getElementById('sidebar').classList.remove('open');

        navigateTo(page);

        if (page === 'dashboard') Dashboard.load();
        if (page === 'projects')  Projects.load();
        if (page === 'tasks')     Tasks.load();
      });
    });
  }

  function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    document.getElementById('menu-toggle').addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    document.getElementById('sidebar-close').addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  async function init() {
    const loggedIn = await Auth.init();
    if (loggedIn) boot();
  }

  return { init, boot };
})();

// Bootstrap
document.addEventListener('DOMContentLoaded', () => App.init());
