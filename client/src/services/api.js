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
