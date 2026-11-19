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

// SeamsApp validates every unsafe method with AutoValidateAntiforgeryToken:
// the JavaScript-readable XSRF-TOKEN cookie must be echoed back in the
// X-XSRF-TOKEN header. ASP.NET writes that cookie URL-encoded, so decode it.
const XSRF_COOKIE = 'XSRF-TOKEN';
const XSRF_HEADER = 'X-XSRF-TOKEN';

function readXsrfToken(): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${XSRF_COOKIE}=([^;]*)`),
  );
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

let xsrfRequest: Promise<unknown> | null = null;

/** Fetch a token once before the first mutating request (login included). */
function ensureXsrfToken(): Promise<unknown> | null {
  if (readXsrfToken()) return null;
  xsrfRequest ??= api
    .get('/auth/csrf-token')
    .catch(() => undefined)
    .finally(() => {
      xsrfRequest = null;
    });
  return xsrfRequest;
}

// Request interceptor — leaves multipart uploads alone and attaches the
// antiforgery header to every mutating request.
api.interceptors.request.use(async (config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const method = (config.method ?? 'get').toLowerCase();
  if (method === 'get' || method === 'head' || method === 'options') {
    return config;
  }

  await ensureXsrfToken();
  const token = readXsrfToken();
  if (token) config.headers[XSRF_HEADER] = token;

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
