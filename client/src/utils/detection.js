export const statusFromConfidence = (c) => {
  if (c >= 0.7) return 'High Risk';
  if (c >= 0.4) return 'Possible Impairment';
  return 'Normal';
};
