import { api } from './api';

export const getDeviceStatus = async () => {
  // Approximate device "confidence" from most recent event's riskLevel
  const { data } = await api.get('/events');
  const events = Array.isArray(data) ? data : [];
  const latest = events[0];
  const confidence = typeof latest?.riskLevel === 'number' ? Number(latest.riskLevel.toFixed(2)) : 0;
  return { confidence };
};

export const getEvents = async () => {
  const { data } = await api.get('/events');
  const events = Array.isArray(data) ? data : [];
  return events.map((e) => {
    const risk = typeof e.riskLevel === 'number' ? Number(e.riskLevel.toFixed(2)) : 0;
    return {
      id: e._id,
      date: e.timestamp || e.createdAt || new Date().toISOString(),
      risk,
      status: risk >= 0.7 ? 'High Risk' : risk >= 0.4 ? 'Possible Impairment' : 'Normal',
      deviceId: e.deviceId || '—',
      action: risk >= 0.7 ? 'Suggested Pull Over' : 'Monitoring',
    };
  });
};
