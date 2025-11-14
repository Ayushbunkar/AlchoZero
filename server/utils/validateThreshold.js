export const isHighRisk = (confidence, threshold = 0.7) => {
  const c = Number(confidence);
  const t = Number(threshold);
  if (Number.isNaN(c) || Number.isNaN(t)) return false;
  return c > t;
};

export default { isHighRisk };
