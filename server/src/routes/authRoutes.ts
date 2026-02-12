import express from 'express';
import * as authController from '../controllers/authController';
import limiter from '../utils/limiter';

const router = express.Router();

router.post('/signup', limiter, authController.postSignup);
router.post('/login', limiter, authController.postLogin);
router.post('/verify-email', limiter, authController.postVerifyEmail);
router.post('/verify-otp', limiter, authController.postVerifyOTP);
router.post('/reset-password', limiter, authController.postResetPassword);

export default router;
