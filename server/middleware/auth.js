import jwt from 'jsonwebtoken';

const SECRET = () => process.env.JWT_SECRET || 'dev-only-secret-change-me';

export const signToken = (payload) =>
  jwt.sign(payload, SECRET(), { expiresIn: '7d' });

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = jwt.verify(token, SECRET());
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    req.user = jwt.verify(token, SECRET());
  } catch {
    /* silently ignore invalid token */
  }
  next();
};
