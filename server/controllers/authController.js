const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const validateUser = require('../utils/validateUser');

const saltRounds = 10;

exports.postSignup = async (req, res) => {
	try {
		const user = req.body;

		const validationError = validateUser(user);
		if (validationError.length > 0) return res.status(400).json({ errors: validationError });

		const existingUser = await User.findOne({ $or: [{ email: user.email }, { rollNo: user.rollNo }] });
		if (existingUser) return res.status(400).json({ errors: ['User with the same email or rollNo already exists'] });

		const hashedPassword = await bcrypt.hash(user.password, saltRounds);
		user.password = hashedPassword;

		await new User(user).save();
		logger.info(`New user created: ${user.email}`);

		res.status(201).json({
			messages: [
				'Reach out to the admin to verify your account. You will be able to login once your account is verified.',
			],
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
		if (!email.endsWith('@student.nitw.ac.in'))
			return res.status(400).json({ status: false, errors: ['Enter a valid NITW email'] });

		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ status: false, errors: ['User Not Found'] });
		if (!user.isVerified)
			return res.status(401).json({ status: false, errors: ['User Not Verified!! Please Contact Admin!!'] });
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
				backlogs: user.backlogs,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '7d' },
		);
		logger.info(`User logged in: ${email}`);
		res.json({ status: true, data: { token }, messages: ['Login Successful'] });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ status: false, messages: ['Internal server error'] });
	}
};
