/**
 * Global Error Handler Middleware
 * Provides consistent error responses across the application
 * Must be added at the end of middleware chain in index.js
 */

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
	// Log the error
	logger.error({
		message: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method,
		ip: req.ip
	});

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		return res.status(400).json({
			success: false,
			message: 'Validation Error',
			errors: Object.values(err.errors).map((e) => e.message)
		});
	}

	// Mongoose cast error (invalid ObjectId)
	if (err.name === 'CastError') {
		return res.status(404).json({
			success: false,
			message: 'Resource not found',
			errors: ['Invalid ID format']
		});
	}

	// Mongoose duplicate key error
	if (err.code === 11000) {
		const field = Object.keys(err.keyPattern)[0];
		return res.status(400).json({
			success: false,
			message: `Duplicate ${field}`,
			errors: [`${field} already exists`]
		});
	}

	// JWT errors
	if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			success: false,
			message: 'Invalid token',
			errors: ['Authentication token is invalid']
		});
	}

	if (err.name === 'TokenExpiredError') {
		return res.status(401).json({
			success: false,
			message: 'Token expired',
			errors: ['Authentication token has expired']
		});
	}

	// Default error response
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		success: false,
		message,
		errors: [message],
		...(process.env.NODE_ENV === 'development' && { stack: err.stack })
	});
};

module.exports = errorHandler;
