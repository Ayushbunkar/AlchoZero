import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'dev-secret';

export const requireAuth = (req, res, next) => {
  try {
    const hdr = req.headers.authorization || '';
    let token = hdr.split(' ')[1];
    // Allow token via query param for SSE (EventSource cannot send headers)
    if (!token && req.query && req.query.token) token = req.query.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, jwtSecret);
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
