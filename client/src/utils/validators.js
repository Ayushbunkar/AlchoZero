export const isNonEmpty = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidThreshold = (value) => {
  const n = typeof value === 'string' ? Number(value) : value;
  return typeof n === 'number' && !Number.isNaN(n) && n >= 0 && n <= 1;
};

export default { isNonEmpty, isValidThreshold };
