import axios from 'axios';

// Base axios instance (endpoints are mocked / not real)
export const api = axios.create({
  baseURL: 'https://mock-detection.local/api',
  timeout: 5000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // swallow errors for mock environment
    return Promise.reject(err);
  }
);
