const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authController = require('../controllers/authController');

// Define rate limiting options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});

// Signup route with rate limiting
router.post('/signup', limiter, authController.postSignup);

// Login route with rate limiting
router.post('/login', limiter, authController.getLogin);

module.exports = router;
