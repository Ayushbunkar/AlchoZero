export const isValidThreshold = (val) => {
  const n = Number(val);
  return !Number.isNaN(n) && n >= 0 && n <= 1;
};

export const isNonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;
