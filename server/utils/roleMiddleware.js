export const requireRole = (...roles) => (req, res, next) => {
  const role = (req.userRole || '').toLowerCase();
  if (!roles.map(r=>r.toLowerCase()).includes(role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
