export const isNonEmpty = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidThreshold = (value) => {
  const n = typeof value === 'string' ? Number(value) : value;
  return typeof n === 'number' && !Number.isNaN(n) && n >= 0 && n <= 1;
};

export const isValidEmail = (value) => {
  if (typeof value !== 'string') return false;
  return /\S+@\S+\.\S+/.test(value.trim());
};

export const isValidPhone = (value) => {
  if (!value) return true; // optional
  if (typeof value !== 'string') return false;
  // Simple international or Indian phone formats (digits, spaces, +, -)
  return /^[+]?[- 0-9]{7,15}$/.test(value.trim());
};

export default { isNonEmpty, isValidThreshold, isValidEmail, isValidPhone };
