import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Otp from '../models/Otp';
import User from '../models/User';
import logger from '../utils/logger';
import validateUser from '../utils/validateUser';

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

		const admissionYear = 2000 + Number.parseInt((user.rollNo as string).slice(0, 2), 10);
		user.batch = admissionYear + 3;

		const existingUser = await User.findOne({
			$or: [{ email: (user.email as string).toString() }, { rollNo: (user.rollNo as string).toString() }]
		});
		if (existingUser) {
			res.status(400).json({
				errors: ['User with the same email or rollNo already exists']
			});
			return;
		}

		const hashedPassword = await bcrypt.hash(user.password as string, Number(process.env.JWT_SALT_ROUNDS));
		user.password = hashedPassword;

		await new User(user).save();
		logger.info(`New user created: ${user.email}`);

		res.status(201).json({
			messages: ['Reach out to the admin to verify your account. You will be able to login once your account is verified.']
		});
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const postLogin = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({ status: false, errors: ['Email and Password required'] });
			return;
		}
		if (!email.endsWith('@student.nitw.ac.in')) {
			res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });
			return;
		}

		const user = await User.findOne({ email: email.toString() });
		if (!user) {
			res.status(404).json({ status: false, errors: ['User Not Found'] });
			return;
		}
		if (!user.isVerified) {
			res.status(401).json({
				status: false,
				errors: ['User Not Verified!! Please Contact Admin!!']
			});
			return;
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			res.status(401).json({ status: false, errors: ['Incorrect Password'] });
			return;
		}

		const token = jwt.sign(
			{
				id: user._id,
				role: user.role
			},
			process.env.JWT_SECRET!,
			{ expiresIn: '7d' }
		);
		logger.info(`User logged in: ${email}`);
		res.json({ status: true, data: { token }, messages: ['Login Successful'] });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ status: false, errors: ['Internal server error'] });
	}
};

export const postVerifyEmail = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email } = req.body;

		const otp = crypto.randomInt(100000, 999999);

		if (!email) {
			res.status(400).json({ status: false, errors: ['Email required'] });
			return;
		}
		if (!email.endsWith('@student.nitw.ac.in')) {
			res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });
			return;
		}

		const user = await User.findOne({ email: email.toString() });
		if (!user) {
			res.status(404).json({ status: false, errors: ['User Not Found'] });
			return;
		}

		const existingOtp = await Otp.findOne({ email: email.toString() });
		if (existingOtp) await Otp.findByIdAndDelete(existingOtp._id);

		await new Otp({ email, otp: String(otp) }).save();

		logger.info(`OTP generated for ${email}`);

		const mailOptions = {
			from: 'NITW Placement Portal',
			to: email,
			subject: 'OTP for Verification',
			text: `Your OTP is: ${otp} use it to verify your account within 10 minutes.`
		};

		await transporter.sendMail(mailOptions);
		logger.info(`Verification email sent to ${email}`);

		res.status(200).json({
			status: true,
			messages: [`OTP sent to ${email}`]
		});
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ status: false, errors: ['Internal server error'] });
	}
};

export const postVerifyOTP = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			res.status(400).json({ status: false, errors: ['Email and OTP required'] });
			return;
		}
		if (!email.endsWith('@student.nitw.ac.in')) {
			res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });
			return;
		}

		const user = await User.findOne({ email: email.toString() });
		const existingOtp = await Otp.findOne({ email: email.toString() });
		if (!user) {
			res.status(404).json({ status: false, errors: ['User Not Found'] });
			return;
		}
		if (!existingOtp) {
			res.status(400).json({ status: false, errors: ['OTP not generated'] });
			return;
		}
		if (String(existingOtp.otp) !== String(otp)) {
			res.status(401).json({ status: false, errors: ['Incorrect OTP'] });
			return;
		}

		const otpExpiry = new Date(existingOtp.createdAt).getTime() + 600000;
		const currentTime = new Date().getTime();
		if (currentTime > otpExpiry) {
			res.status(401).json({ status: false, errors: ['OTP expired'] });
			return;
		}

		await Otp.findByIdAndDelete(existingOtp._id);

		logger.info(`User verified: ${email}`);

		res.status(200).json({
			status: true,
			messages: ['Email verified successfully']
		});
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ status: false, errors: ['Internal server error'] });
	}
};

export const postResetPassword = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, otp, newPassword } = req.body;
		if (!email || !newPassword) {
			res.status(400).json({ status: false, errors: ['Email and Password required'] });
			return;
		}
		if (!email.endsWith('@student.nitw.ac.in')) {
			res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });
			return;
		}

		const user = await User.findOne({ email: email.toString() });
		if (!user) {
			res.status(404).json({ status: false, errors: ['User Not Found'] });
			return;
		}

		const existing = await Otp.findOne({ email: email.toString() });
		if (!existing) {
			res.status(400).json({ status: false, errors: ['OTP not generated'] });
			return;
		}

		if (String(existing.otp) !== String(otp)) {
			res.status(401).json({ status: false, errors: ['Incorrect OTP'] });
			return;
		}

		if (newPassword.length < 6 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
			res.status(400).json({
				status: false,
				errors: ['Password must be atleast 6 characters long and contain atleast one uppercase, one lowercase and one numeric character.']
			});
			return;
		}

		const otpExpiry = new Date(existing.createdAt).getTime() + 600000;
		const currentTime = new Date().getTime();
		if (currentTime > otpExpiry) {
			res.status(401).json({ status: false, errors: ['OTP expired'] });
			return;
		}

		const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.JWT_SALT_ROUNDS));
		user.password = hashedPassword;
		await user.save();

		await Otp.findByIdAndDelete(existing._id);

		logger.info(`Password reset for ${email}`);

		res.status(200).json({
			status: true,
			messages: ['Password reset successfully']
		});
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ status: false, errors: ['Internal server error'] });
	}
};
