const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new Error('Invalid or missing Authorization header');
    }

    const token = authorizationHeader.replace('Bearer ', '');

    console.log('Received token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has expired
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error('Token has expired');
    }

    let user;
    try {
      user = await User.findOne({ _id: decoded.userId });
    } catch (error) {
      console.error('User lookup error:', error.message);
      throw new Error('Error looking up user');
    }

    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    console.error('Error in authenticateUser middleware:', error.message);

    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
};

const checkUserRole = allowedRoles => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    } catch (error) {
      console.error('Error in checkUserRole middleware:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};
module.exports = { authenticateUser, checkUserRole };
