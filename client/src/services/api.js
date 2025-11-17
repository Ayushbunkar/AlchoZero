import axios from 'axios';

// Use Vite env or default to local backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4500/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
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
