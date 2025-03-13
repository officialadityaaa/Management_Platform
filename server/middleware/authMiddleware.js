// JWT authentication middleware
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
