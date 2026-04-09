const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });

  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Malformed token' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.requireAdmin = (req, res, next) => {
  // requireAuth must run before this
  if (!req.user) return res.status(401).json({ message: 'No user' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin required' });
  next();
};
