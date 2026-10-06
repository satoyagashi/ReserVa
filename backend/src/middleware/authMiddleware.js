export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized: Please log in' });
  }
  req.user = { id: req.session.userId };
  next();
};
