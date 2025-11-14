export const statusFromConfidence = (confidence) => {
  const c = Number(confidence) || 0;
  if (c >= 0.7) return 'High Risk';
  if (c >= 0.4) return 'Possible Impairment';
  return 'Normal';
};

export default { statusFromConfidence };
