import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api/';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Response interceptor to handle auto-logout on 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Trigger a clean logout state in the client (can dispatch a custom event or let AuthContext handle it)
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);
