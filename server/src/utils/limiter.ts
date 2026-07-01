import rateLimit from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';

// Effectively unlimited in tests so throttling never breaks the suite,
// while keeping every route wrapped in a real rate-limiter instance.
const testMax = 1e9;

// General API limiter: 100 requests per 5 minutes
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: isTest ? testMax : 100,
	standardHeaders: true,
	legacyHeaders: false
});

// Strict limiter for login/signup: 10 requests per 15 minutes
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: isTest ? testMax : 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: { errors: ['Too many attempts. Please try again later.'] }
});

// Very strict limiter for OTP/password reset: 5 requests per 15 minutes
export const otpLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: isTest ? testMax : 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: { errors: ['Too many OTP requests. Please try again later.'] }
});

export default limiter;
