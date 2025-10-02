/**
 * Attach User Middleware
 * Fetches full user details and attaches to request object
 * Eliminates duplicate User.findById calls in controllers
 *
 * Usage:
 * router.get('/profile', authenticateUser, attachUser, (req, res) => {
 *   res.json({ user: req.fullUser }); // User already fetched!
 * });
 */

const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

const attachUser = asyncHandler(async (req, res, next) => {
	// Fetch user without password field
	// Use _id since req.user is a Mongoose document
	const userId = req.user._id || req.user.id;
	req.fullUser = await User.findById(userId).select('-password').lean();

	if (!req.fullUser) {
		const error = new Error('User not found');
		error.statusCode = 404;
		throw error;
	}

	next();
});

module.exports = attachUser;
