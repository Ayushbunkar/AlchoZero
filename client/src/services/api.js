import axios from 'axios';

// Use Vite env or default to local backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4500/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // swallow errors for mock environment
    return Promise.reject(err);
  }
);

// Auth endpoints (mock-aware): attempt real backend, fallback to mock
export const registerUser = async (payload) => {
  try {
    const res = await api.post('/auth/register', payload);
    return res.data; // expected: { user, token }
  } catch (e) {
    // If backend responded, surface its message; else fallback mock
    if (e.response) {
      const msg = e.response.data?.message || e.response.statusText || 'Registration failed';
      throw new Error(msg);
    }
    return { user: { name: payload.name, email: payload.email, role: payload.role || 'Driver' }, token: 'mock-token' };
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // expected: { user, token }
  } catch (e) {
    if (e.response) {
      const msg = e.response.data?.message || e.response.statusText || 'Login failed';
      throw new Error(msg);
    }
    // Fallback mock response; infer name from email prefix
    const name = String(email || 'user').split('@')[0];
    return { user: { name, email, role: 'Driver' }, token: 'mock-token' };
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const res = await api.post('/auth/forgot', { email });
    return res.data; // expected: { message }
  } catch (e) {
    if (e.response) {
      const msg = e.response.data?.message || e.response.statusText || 'Request failed';
      throw new Error(msg);
    }
    // Fallback mock success
    return { message: 'If that email exists, a reset link was sent.' };
  }
};

export const me = async () => {
  const res = await api.get('/me');
  return res.data;
};

export const updateMe = async (payload) => {
  const res = await api.put('/me', payload);
  return res.data;
};

export const getMyEvents = async (opts = {}) => {
  const params = {};
  if (opts.limit) params.limit = opts.limit;
  if (opts.from) params.from = opts.from;
  if (opts.to) params.to = opts.to;
  const res = await api.get('/events/mine', { params });
  return Array.isArray(res.data) ? res.data : [];
};

export const getMyDriverStats = async () => {
  try {
    const res = await api.get('/drivers/me/stats');
    return res.data || {};
  } catch (e) {
    console.error('Failed to fetch driver stats', e?.response?.data || e.message);
    return {};
  }
};

export const refreshToken = async () => {
  const res = await api.post('/auth/refresh');
  if (res.data?.token) localStorage.setItem('auth_token', res.data.token);
  return res.data?.token;
};

export const bindDevice = async (deviceId) => {
  const res = await api.post('/devices/bind', { deviceId });
  return res.data;
};
