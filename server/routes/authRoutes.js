const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { limiter, authLimiter } = require('../utils/limiter');

// Signup route with stricter rate limiting
router.post('/signup', authLimiter, authController.postSignup);

// Login route with stricter rate limiting
router.post('/login', authLimiter, authController.getLogin);

// Verify email route with rate limiting
router.post('/verify-email', limiter, authController.postVerifyEmail);

// Verify OTP route with stricter rate limiting
router.post('/verify-otp', authLimiter, authController.postVerifyOTP);

// Reset password route with stricter rate limiting
router.post('/reset-password', authLimiter, authController.postResetPassword);

module.exports = router;
