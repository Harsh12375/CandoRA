const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - requires Bearer token
async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'Not authorized: Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Not authorized: User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized: Invalid token' });
  }
}

// Authorize by role
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    next();
  };
}

module.exports = { protect, authorize };
