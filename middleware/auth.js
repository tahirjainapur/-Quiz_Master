// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}

module.exports = requireAuth;

