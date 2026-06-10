import { storage } from '../utils/storage.js';

const BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'authToken';

export const getToken = () => storage.get(TOKEN_KEY);
export const setToken = (token) => storage.set(TOKEN_KEY, token);
export const clearToken = () => storage.remove(TOKEN_KEY);

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const request = async (path, { method = 'GET', body, auth = false, signal } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    throw new ApiError(
      'Could not reach the server. Is the backend running on port 4000?',
      0,
      { cause: err.message },
    );
  }

  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      /* ignore parse errors */
    }
  }

  if (!res.ok) {
    throw new ApiError(
      data?.error || `Request failed with ${res.status}`,
      res.status,
      data,
    );
  }
  return data;
};

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
  isAuthenticated: () => Boolean(getToken()),
};

export { ApiError };
