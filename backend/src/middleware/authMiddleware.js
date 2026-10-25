export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized: Please log in' });
  }
  req.user = { id: req.session.userId, role: req.session.userRole };
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized: Please log in' });
  }
  if (req.session.userRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  req.user = { id: req.session.userId, role: req.session.userRole };
  next();
};
