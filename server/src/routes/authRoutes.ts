import express, { type Router } from 'express';
import * as authController from '../controllers/authController';
import { authLimiter, otpLimiter } from '../utils/limiter';

const router: Router = express.Router();

router.post('/signup', authLimiter, authController.postSignup);
router.post('/login', authLimiter, authController.postLogin);
router.post('/verify-email', otpLimiter, authController.postVerifyEmail);
router.post('/verify-otp', otpLimiter, authController.postVerifyOTP);
router.post('/reset-password', otpLimiter, authController.postResetPassword);

export default router;
