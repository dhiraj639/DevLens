const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretdevlenskey123456789');

      // Get user from the token, excluding password
      req.user = await User.findById(decoded.id).select('-password');
      
      // Fallback for development if mongo connection isn't present
      if (!req.user) {
        // Create a mock user so the local frontend doesn't crash on mock tests
        req.user = {
          _id: decoded.id,
          name: "Developer Guest",
          email: "guest@devlens.ai",
          targetRole: "MERN Developer"
        };
      }

      next();
    } catch (error) {
      console.error('JWT authentication error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
