const rateLimit = require('express-rate-limit');

// General API rate limiter
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 100 // Limit each IP to 100 requests per windowMs
});

// Stricter rate limiter for authentication routes
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Only 5 attempts per 15 minutes
	message: 'Too many authentication attempts. Please try again after 15 minutes.',
	standardHeaders: true,
	legacyHeaders: false
});

module.exports = { limiter, authLimiter };
