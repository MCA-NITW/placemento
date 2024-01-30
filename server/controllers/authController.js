const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const validateUser = require('../utils/validateUser');
const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.postSignup = async (req, res) => {
	try {
		const user = req.body;

		const validationError = validateUser(user);
		if (validationError.length > 0) return res.status(400).json({ errors: validationError });

		const existingUser = await User.findOne({ $or: [{ email: user.email }, { rollNo: user.rollNo }] });
		if (existingUser) return res.status(400).json({ errors: ['User with the same email or rollNo already exists'] });

		const hashedPassword = await bcrypt.hash(user.password, Number(process.env.JWT_SALT_ROUNDS));
		user.password = hashedPassword;

		await new User(user).save();
		logger.info(`New user created: ${user.email}`);

		res.status(201).json({
			messages: ['Reach out to the admin to verify your account. You will be able to login once your account is verified.']
		});
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

exports.getLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) return res.status(400).json({ status: false, errors: ['Email and Password required'] });
		if (!email.endsWith('@student.nitw.ac.in')) return res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });

		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ status: false, errors: ['User Not Found'] });
		if (!user.isVerified) return res.status(401).json({ status: false, errors: ['User Not Verified!! Please Contact Admin!!'] });
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) return res.status(401).json({ status: false, errors: ['Incorrect Password'] });

		const token = jwt.sign(
			{
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				pg: user.pg,
				ug: user.ug,
				hsc: user.hsc,
				ssc: user.ssc,
				rollNo: user.rollNo,
				totalGapInAcademics: user.totalGapInAcademics,
				backlogs: user.backlogs
			},
			process.env.JWT_SECRET,
			{ expiresIn: '7d' }
		);
		logger.info(`User logged in: ${email}`);
		res.json({ status: true, data: { token }, messages: ['Login Successful'] });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ status: false, messages: ['Internal server error'] });
	}
};

// postVerifyEmail with OTP
exports.postVerifyEmail = async (req, res) => {
	try {
		console.log(req.body);
		const { email } = req.body;

		// Generate a secure OTP
		const otp = crypto.randomInt(100000, 999999);

		// Rest of the code remains unchanged
		if (!email) return res.status(400).json({ status: false, errors: ['Email required'] });
		if (!email.endsWith('@student.nitw.ac.in')) return res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });

		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ status: false, errors: ['User Not Found'] });

		const existingOtp = await Otp.findOne({ email });
		if (existingOtp) await Otp.findByIdAndDelete(existingOtp._id);

		await new Otp({ email, otp }).save();

		logger.info(`OTP generated for ${email}: ${otp}`);

		// Create a nodemailer transporter
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_ID,
				pass: process.env.EMAIL_PASSWORD
			},
			secure: true
		});

		// Define email options
		let mailOptions = {
			from: 'NITW Placement Portal',
			to: email,
			subject: 'OTP for Verification',
			text: `Your OTP is: ${otp} use it to verify your account within 10 minutes.`
		};

		// Send email
		let info = await transporter.sendMail(mailOptions);
		console.log('Message sent: %s', info.messageId);

		res.status(200).json({
			status: true,
			messages: [`OTP sent to ${email}`]
		});
	} catch (error) {
		logger.error(error);
		res.status(500).json({ status: false, errors: ['Internal server error'] });
	}
};

// postVerifyOTP
exports.postVerifyOTP = async (req, res) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) return res.status(400).json({ status: false, errors: ['Email and OTP required'] });
		if (!email.endsWith('@student.nitw.ac.in')) return res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });

		const user = await User.findOne({ email });
		const existingOtp = await Otp.findOne({ email });
		if (!user) return res.status(401).json({ status: false, errors: ['User Not Found'] });
		if (!existingOtp) return res.status(401).json({ status: false, errors: ['OTP not generated'] });
		if (existingOtp.otp !== otp) return res.status(401).json({ status: false, errors: ['Incorrect OTP'] });

		// Check OTP expiry
		const otpExpiry = new Date(existingOtp.createdAt).getTime() + 600000;
		const currentTime = new Date().getTime();
		if (currentTime > otpExpiry) return res.status(401).json({ status: false, errors: ['OTP expired'] });

		await user.save();

		logger.info(`User verified: ${email}`);

		res.status(200).json({
			status: true,
			messages: ['Email verified successfully']
		});
	} catch (error) {
		logger.error(error);
		res.status(500).json({ status: false, errors: ['Internal server error'] });
	}
};

// postResetPassword
exports.postResetPassword = async (req, res) => {
	try {
		const { email, otp, newPassword } = req.body;
		if (!email || !newPassword) return res.status(400).json({ status: false, errors: ['Email and Password required'] });
		if (!email.endsWith('@student.nitw.ac.in')) return res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });

		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ status: false, errors: ['User Not Found'] });

		const existing = await Otp.findOne({ email });
		if (!existing) return res.status(401).json({ status: false, errors: ['OTP not generated'] });

		if (existing.otp !== otp) return res.status(401).json({ status: false, errors: ['Incorrect OTP'] });

		if (newPassword.length < 6 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword))
			return res.status(401).json({
				status: false,
				errors: ['Password must be atleast 6 characters long and contain atleast one uppercase, one lowercase and one numeric character.']
			});

		// Check OTP expiry
		const otpExpiry = new Date(existing.createdAt).getTime() + 600000;
		const currentTime = new Date().getTime();
		if (currentTime > otpExpiry) return res.status(401).json({ status: false, errors: ['OTP expired'] });

		const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.JWT_SALT_ROUNDS));
		user.password = hashedPassword;
		await user.save();

		await Otp.findByIdAndDelete(existing._id);

		logger.info(`Password reset for ${email}`);

		res.status(200).json({
			status: true,
			messages: ['Password reset successfully']
		});
	} catch (error) {
		console.log(error);
		logger.error(error);
		res.status(500).json({ status: false, errors: ['Internal server error'] });
	}
};
