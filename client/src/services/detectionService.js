// Mock detection service functions

export const getDeviceStatus = async () => {
  // simulate latency
  await new Promise((r) => setTimeout(r, 300));
  const confidence = Number(Math.random().toFixed(2));
  return { confidence };
};

export const getEvents = async () => {
  await new Promise((r) => setTimeout(r, 300));
  // last 10 events mock
  const now = Date.now();
  const sample = Array.from({ length: 10 }).map((_, i) => {
    const risk = Number(Math.random().toFixed(2));
    return {
      id: `evt-${i}`,
      date: new Date(now - i * 3600_000).toISOString(),
      risk,
      status: risk >= 0.7 ? 'High Risk' : risk >= 0.4 ? 'Possible Impairment' : 'Normal',
      deviceId: `mock-${100 + i}`,
      action: risk >= 0.7 ? 'Suggested Pull Over' : 'Monitoring',
    };
  });
  return sample;
};
