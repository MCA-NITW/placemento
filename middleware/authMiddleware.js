const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new Error('Invalid or missing Authorization header');
    }

    const token = authorizationHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    try {
      user = await User.findOne({ _id: decoded.userId }).maxTimeMS(20000);
    } catch (error) {
      console.error('User lookup error:', error.message);
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        throw new Error('User not found');
      } else if (error instanceof mongoose.Error.MaxTimeMSExpired) {
        throw new Error('User lookup timed out');
      } else {
        throw new Error('Error looking up user');
      }
    }

    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const checkUserRole = (allowedRoles) => {
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
