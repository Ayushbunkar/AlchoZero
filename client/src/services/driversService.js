import { api } from './api';

export const fetchDrivers = async (opts = {}) => {
  const params = {};
  if (opts.q) params.q = opts.q;
  if (opts.status) params.status = opts.status;
  if (opts.minRisk) params.minRisk = opts.minRisk;
  if (opts.maxRisk) params.maxRisk = opts.maxRisk;
  const res = await api.get('/drivers', { params });
  return Array.isArray(res.data) ? res.data : [];
};

export const getDriver = async (id) => {
  const res = await api.get(`/drivers/${encodeURIComponent(id)}`);
  return res.data;
};

export default { fetchDrivers, getDriver };
