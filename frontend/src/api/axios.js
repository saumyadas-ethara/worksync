import axios from "axios";

// In development: Vite proxy forwards /api → http://localhost:5000/api
// In production:  backend serves frontend from same origin, so /api works directly
// Override with VITE_API_URL only if you need to point to a separate backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // Don't redirect if it's a failed login attempt
    if (error.response?.status === 401 && !originalRequest.url.includes("/auth/login")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
