import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';

// No-op middleware for tests
const noop = (_req: Request, _res: Response, next: NextFunction) => next();

// General API limiter: 100 requests per 5 minutes
const limiter = isTest
	? noop
	: rateLimit({
			windowMs: 5 * 60 * 1000,
			max: 100,
			standardHeaders: true,
			legacyHeaders: false
		});

// Strict limiter for login/signup: 10 requests per 15 minutes
export const authLimiter = isTest
	? noop
	: rateLimit({
			windowMs: 15 * 60 * 1000,
			max: 10,
			standardHeaders: true,
			legacyHeaders: false,
			message: { errors: ['Too many attempts. Please try again later.'] }
		});

// Very strict limiter for OTP/password reset: 5 requests per 15 minutes
export const otpLimiter = isTest
	? noop
	: rateLimit({
			windowMs: 15 * 60 * 1000,
			max: 5,
			standardHeaders: true,
			legacyHeaders: false,
			message: { errors: ['Too many OTP requests. Please try again later.'] }
		});

export default limiter;
