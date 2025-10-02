const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const validateUser = require('../utils/validateUser');
const Otp = require('../models/Otp');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const { sendEmail } = require('../utils/emailService');

exports.postSignup = asyncHandler(async (req, res) => {
	const user = req.body;
	const validationError = validateUser(user);
	if (validationError.length > 0) return res.status(400).json({ errors: validationError });

	user.batch = parseInt('20' + (parseInt(user.rollNo.slice(0, 2)) + 3).toString());
	const existingUser = await User.findOne({
		$or: [{ email: user.email.toString() }, { rollNo: user.rollNo.toString() }]
	});
	if (existingUser)
		return res.status(400).json({
			errors: ['User with the same email or rollNo already exists']
		});

	const hashedPassword = await bcrypt.hash(user.password, Number(process.env.JWT_SALT_ROUNDS));
	user.password = hashedPassword;

	await new User(user).save();
	logger.info(`New user created: ${user.email}`);

	res.status(201).json({
		messages: ['Reach out to the admin to verify your account. You will be able to login once your account is verified.']
	});
});

exports.getLogin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) return res.status(400).json({ status: false, errors: ['Email and Password required'] });
	if (!email.endsWith('@student.nitw.ac.in')) return res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });

	const user = await User.findOne({ email: email.toString() });
	if (!user) return res.status(401).json({ status: false, errors: ['User Not Found'] });
	if (!user.isVerified)
		return res.status(401).json({
			status: false,
			errors: ['User Not Verified!! Please Contact Admin!!']
		});

	const passwordMatch = await bcrypt.compare(password, user.password);
	if (!passwordMatch) return res.status(401).json({ status: false, errors: ['Incorrect Password'] });

	const token = jwt.sign(
		{
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			batch: user.batch,
			pg: user.pg,
			ug: user.ug,
			hsc: user.hsc,
			ssc: user.ssc,
			rollNo: user.rollNo,
			totalGapInAcademics: user.totalGapInAcademics,
			backlogs: user.backlogs,
			companyId: user.placedAt.companyId
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
	);
	logger.info(`User logged in: ${email}`);
	res.json({ status: true, data: { token }, messages: ['Login Successful'] });
});

// postVerifyEmail with OTP
exports.postVerifyEmail = asyncHandler(async (req, res) => {
	const { email } = req.body;

	// Generate a secure OTP
	const otp = crypto.randomInt(100000, 999999);

	if (!email) return res.status(400).json({ status: false, errors: ['Email required'] });
	if (!email.endsWith('@student.nitw.ac.in')) return res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });

	const user = await User.findOne({ email: email.toString() });
	if (!user) return res.status(401).json({ status: false, errors: ['User Not Found'] });

	const existingOtp = await Otp.findOne({ email: email.toString() });
	if (existingOtp) await Otp.findByIdAndDelete(existingOtp._id);

	await new Otp({ email, otp }).save();

	logger.info(`OTP generated for ${email}: ${otp}`);

	// Send email using unified email service
	await sendEmail(email, 'verification', otp);

	res.status(200).json({
		status: true,
		messages: [`OTP sent to ${email}`]
	});
});

// postVerifyOTP
exports.postVerifyOTP = asyncHandler(async (req, res) => {
	const { email, otp } = req.body;

	if (!email || !otp) return res.status(400).json({ status: false, errors: ['Email and OTP required'] });
	if (!email.endsWith('@student.nitw.ac.in')) return res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });

	const user = await User.findOne({ email: email.toString() });
	const existingOtp = await Otp.findOne({ email: email.toString() });
	if (!user) return res.status(401).json({ status: false, errors: ['User Not Found'] });
	if (!existingOtp) return res.status(401).json({ status: false, errors: ['OTP not generated'] });
	if (existingOtp.otp !== otp) return res.status(401).json({ status: false, errors: ['Incorrect OTP'] });

	// Check OTP expiry
	const otpExpiry = new Date(existingOtp.createdAt).getTime() + 600000;
	const currentTime = new Date().getTime();
	if (currentTime > otpExpiry) return res.status(401).json({ status: false, errors: ['OTP expired'] });

	logger.info(`User verified: ${email}`);

	res.status(200).json({
		status: true,
		messages: ['Email verified successfully']
	});
});

// postResetPassword
exports.postResetPassword = asyncHandler(async (req, res) => {
	const { email, otp, newPassword } = req.body;
	if (!email || !newPassword) return res.status(400).json({ status: false, errors: ['Email and Password required'] });
	if (!email.endsWith('@student.nitw.ac.in')) return res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });

	const user = await User.findOne({ email: email.toString() });
	if (!user) return res.status(401).json({ status: false, errors: ['User Not Found'] });

	const existing = await Otp.findOne({ email: email.toString() });
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
});
