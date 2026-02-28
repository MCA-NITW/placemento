import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import Otp from '../models/Otp';
import User from '../models/User';
import logger from '../utils/logger';
import validateUser from '../utils/validateUser';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_ID,
		pass: process.env.EMAIL_PASSWORD
	},
	secure: true
});

export const postSignup = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, email, password, rollNo, pg, ug, hsc, ssc, totalGapInAcademics, backlogs } = req.body;
		const user: Record<string, unknown> = { name, email, password, rollNo, pg, ug, hsc, ssc, totalGapInAcademics, backlogs };

		const validationError = validateUser(user);
		if (validationError.length > 0) {
			res.status(400).json({ errors: validationError });
			return;
		}

		const admissionYear = 2000 + Number.parseInt((rollNo as string).slice(0, 2), 10);
		user.batch = admissionYear + 3;

		const existingUser = await User.findOne({ $or: [{ email }, { rollNo }] });
		if (existingUser) {
			logger.warn(`Duplicate signup attempt: ${email}`);
			res.status(400).json({ errors: ['User with the same email or roll number already exists'] });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, Number(process.env.JWT_SALT_ROUNDS));
		user.password = hashedPassword;

		await new User(user).save();
		logger.info(`New user created: ${email}`);
		res.status(201).json({ messages: ['Account created. Contact admin to verify your account before signing in.'] });
	} catch (error: any) {
		logger.error(`Signup error: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const postLogin = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({ errors: ['Email and password are required'] });
			return;
		}
		if (!email.endsWith('@student.nitw.ac.in')) {
			res.status(400).json({ errors: ['Enter a valid NITW email'] });
			return;
		}

		const user = await User.findOne({ email });
		if (!user) {
			logger.warn(`Login attempt for non-existent user: ${email}`);
			res.status(404).json({ errors: ['User not found'] });
			return;
		}
		if (!user.isVerified) {
			res.status(401).json({ errors: ['Account not verified. Please contact admin.'] });
			return;
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			logger.warn(`Failed login attempt: ${email}`);
			res.status(401).json({ errors: ['Incorrect password'] });
			return;
		}

		const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
		logger.info(`User logged in: ${email}`);
		res.json({ data: { token }, messages: ['Login successful'] });
	} catch (error: any) {
		logger.error(`Login error: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const postVerifyEmail = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email } = req.body;

		if (!email) {
			res.status(400).json({ errors: ['Email is required'] });
			return;
		}
		if (!email.endsWith('@student.nitw.ac.in')) {
			res.status(400).json({ errors: ['Enter a valid NITW email'] });
			return;
		}

		const user = await User.findOne({ email });
		if (!user) {
			res.status(404).json({ errors: ['User not found'] });
			return;
		}

		// Delete any existing OTP for this email
		await Otp.deleteMany({ email });

		const otp = crypto.randomInt(100000, 999999);
		// Hash OTP before storing
		const hashedOtp = await bcrypt.hash(String(otp), 8);
		await new Otp({ email, otp: hashedOtp }).save();

		logger.info(`OTP generated for ${email}`);

		await transporter.sendMail({
			from: 'NITW Placement Portal',
			to: email,
			subject: 'OTP for Verification',
			text: `Your OTP is: ${otp}\n\nUse it to verify your account within 10 minutes.`
		});
		logger.info(`Verification email sent to ${email}`);
		res.status(200).json({ messages: [`OTP sent to ${email}`] });
	} catch (error: any) {
		logger.error(`Verify email error: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const postVerifyOTP = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			res.status(400).json({ errors: ['Email and OTP are required'] });
			return;
		}
		if (!email.endsWith('@student.nitw.ac.in')) {
			res.status(400).json({ errors: ['Enter a valid NITW email'] });
			return;
		}

		const user = await User.findOne({ email });
		if (!user) {
			res.status(404).json({ errors: ['User not found'] });
			return;
		}

		const existingOtp = await Otp.findOne({ email });
		if (!existingOtp) {
			res.status(400).json({ errors: ['No OTP generated. Request a new one.'] });
			return;
		}

		// Check expiry (10 minutes)
		const otpAge = Date.now() - new Date(existingOtp.createdAt).getTime();
		if (otpAge > 600000) {
			await Otp.deleteMany({ email });
			res.status(401).json({ errors: ['OTP expired. Request a new one.'] });
			return;
		}

		// Compare hashed OTP
		const match = await bcrypt.compare(String(otp), existingOtp.otp);
		if (!match) {
			logger.warn(`Invalid OTP attempt for ${email}`);
			res.status(401).json({ errors: ['Incorrect OTP'] });
			return;
		}

		await Otp.deleteMany({ email });
		logger.info(`Email verified: ${email}`);
		res.status(200).json({ messages: ['Email verified successfully'] });
	} catch (error: any) {
		logger.error(`Verify OTP error: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const postResetPassword = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, otp, newPassword } = req.body;
		if (!email || !newPassword) {
			res.status(400).json({ errors: ['Email and new password are required'] });
			return;
		}
		if (!email.endsWith('@student.nitw.ac.in')) {
			res.status(400).json({ errors: ['Enter a valid NITW email'] });
			return;
		}
		// Use centralized password validation regex
		if (!PASSWORD_REGEX.test(newPassword)) {
			res.status(400).json({
				errors: ['Password must be at least 6 characters with one uppercase, one lowercase, and one number']
			});
			return;
		}

		const user = await User.findOne({ email });
		if (!user) {
			res.status(404).json({ errors: ['User not found'] });
			return;
		}

		const existing = await Otp.findOne({ email });
		if (!existing) {
			res.status(400).json({ errors: ['No OTP generated. Request a new one.'] });
			return;
		}

		// Check expiry
		const otpAge = Date.now() - new Date(existing.createdAt).getTime();
		if (otpAge > 600000) {
			await Otp.deleteMany({ email });
			res.status(401).json({ errors: ['OTP expired. Request a new one.'] });
			return;
		}

		const match = await bcrypt.compare(String(otp), existing.otp);
		if (!match) {
			logger.warn(`Invalid OTP in password reset for ${email}`);
			res.status(401).json({ errors: ['Incorrect OTP'] });
			return;
		}

		user.password = await bcrypt.hash(newPassword, Number(process.env.JWT_SALT_ROUNDS));
		await user.save();
		await Otp.deleteMany({ email });

		logger.info(`Password reset for ${email}`);
		res.status(200).json({ messages: ['Password reset successfully'] });
	} catch (error: any) {
		logger.error(`Reset password error: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};
