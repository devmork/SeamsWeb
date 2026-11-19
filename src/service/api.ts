import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://localhost:7122/api';

// The backend authenticates with an HttpOnly Identity cookie ("seams.auth"),
// so every request must carry credentials. There is no bearer token anymore.
declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Skip the global 401 → /login redirect (used by the login call itself). */
    skipAuthRedirect?: boolean;
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor — only needs to leave multipart uploads alone.
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Response interceptor — a 401 means the cookie session is gone.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const skipRedirect = error.config?.skipAuthRedirect;

    if (status === 401 && !skipRedirect) {
      window.localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
