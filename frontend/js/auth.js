/* ============================================================
   auth.js – Authentication module
   ============================================================ */
const Auth = (() => {
  let _user = null;

  function getUser() { return _user; }
  function setUser(u) {
    _user = u;
    if (u) {
      localStorage.setItem('ws_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('ws_user');
      localStorage.removeItem('ws_token');
    }
  }
  function getToken() { return localStorage.getItem('ws_token') || ''; }
  function setToken(t) { localStorage.setItem('ws_token', t); }

  function isLoggedIn() { return !!getToken() && !!_user; }

  function updateSidebarUser(user) {
    document.getElementById('sidebar-avatar').textContent = avatarLetter(user.name);
    document.getElementById('sidebar-name').textContent   = user.name;
    const roleEl = document.getElementById('sidebar-role');
    roleEl.textContent  = user.role;
    roleEl.className    = `user-role badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-member'}`;
  }

  function showApp(user) {
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('app-shell').classList.remove('hidden');
    updateSidebarUser(user);
  }

  function showAuth() {
    document.getElementById('auth-screen').classList.add('active');
    document.getElementById('app-shell').classList.add('hidden');
  }

  async function init() {
    const stored = localStorage.getItem('ws_user');
    const token  = getToken();
    if (stored && token) {
      _user = JSON.parse(stored);
      try {
        const res = await Api.get('/auth/me');
        _user = res.data;
        setUser(_user);
        showApp(_user);
        return true;
      } catch {
        setUser(null);
        showAuth();
        return false;
      }
    }
    showAuth();
    return false;
  }

  // ── Login form ───────────────────────────────────────────
  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    clearFieldErrors('login-email-err', 'login-password-err');
    hideGlobalError('login-global-err');

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    let valid = true;

    if (!email) { showFieldError('login-email-err', 'Email is required'); valid = false; }
    if (!password) { showFieldError('login-password-err', 'Password is required'); valid = false; }
    if (!valid) return;

    const btn = document.getElementById('login-btn');
    setLoading(btn, true);
    try {
      const res = await Api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      showApp(res.data.user);
      showToast('Welcome back, ' + res.data.user.name + '!', 'success');
      App.boot();
    } catch (err) {
      showGlobalError('login-global-err', err.message);
    } finally {
      setLoading(btn, false);
    }
  });

  // ── Signup form ──────────────────────────────────────────
  document.getElementById('signup-form').addEventListener('submit', async e => {
    e.preventDefault();
    clearFieldErrors('signup-name-err', 'signup-email-err', 'signup-password-err');
    hideGlobalError('signup-global-err');

    const name     = document.getElementById('signup-name').value.trim();
    const email    = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const role     = document.querySelector('input[name="signup-role"]:checked')?.value || 'MEMBER';
    let valid = true;

    if (!name)     { showFieldError('signup-name-err', 'Name is required'); valid = false; }
    if (!email)    { showFieldError('signup-email-err', 'Email is required'); valid = false; }
    if (!password) { showFieldError('signup-password-err', 'Password is required'); valid = false; }
    else if (password.length < 6) { showFieldError('signup-password-err', 'Min 6 characters'); valid = false; }
    if (!valid) return;

    const btn = document.getElementById('signup-btn');
    setLoading(btn, true);
    try {
      const res = await Api.post('/auth/signup', { name, email, password, role });
      setToken(res.data.token);
      setUser(res.data.user);
      showApp(res.data.user);
      showToast('Account created! Welcome, ' + res.data.user.name, 'success');
      App.boot();
    } catch (err) {
      showGlobalError('signup-global-err', err.message);
    } finally {
      setLoading(btn, false);
    }
  });

  // ── Panel toggle ─────────────────────────────────────────
  document.getElementById('go-signup').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('login-panel').classList.remove('active');
    document.getElementById('signup-panel').classList.add('active');
  });
  document.getElementById('go-login').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('signup-panel').classList.remove('active');
    document.getElementById('login-panel').classList.add('active');
  });

  // ── Logout ───────────────────────────────────────────────
  document.getElementById('logout-btn').addEventListener('click', async () => {
    try { await Api.post('/auth/logout'); } catch {}
    setUser(null);
    showAuth();
    showToast('You have been logged out', 'info');
  });

  return { init, getUser, isLoggedIn };
})();
