/* ============================================================
   api.js – Centralized API client
   ============================================================ */
const API_BASE = window.ENV_API_URL || 'http://localhost:5000/api';

const Api = (() => {
  function getToken() {
    return localStorage.getItem('ws_token') || '';
  }

  async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers, credentials: 'include' };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${path}`, opts);
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = json.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return json;
  }

  return {
    get:    (p)       => request('GET',    p),
    post:   (p, b)    => request('POST',   p, b),
    patch:  (p, b)    => request('PATCH',  p, b),
    delete: (p)       => request('DELETE', p),
  };
})();
