/**
 * Async Handler Middleware
 * Wraps async route handlers to automatically catch errors
 * Eliminates the need for try-catch blocks in every controller
 *
 * Usage:
 * const asyncHandler = require('../middleware/asyncHandler');
 *
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 */

const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
