const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const saltRounds = 10;

const validateFields = (user) => {
	const errorMessages = [];
	if (!user.name) errorMessages.push('Name is required.');
	if (!user.email.endsWith('@student.nitw.ac.in')) errorMessages.push('Enter a valid NITW email.');
	if (
		user.password.length < 6 ||
		!/[a-z]/.test(user.password) ||
		!/[A-Z]/.test(user.password) ||
		!/\d/.test(user.password)
	)
		errorMessages.push(
			'Password must be atleast 6 characters long and contain atleast one uppercase, one lowercase and one numeric character.',
		);
	if (!user.rollNo.match(/^\d{2}MCF1R\d{2,}$/)) errorMessages.push('Enter a valid roll number. (Eg: 21MCF1R01)');
	if (
		user.pg.cgpa < 0 ||
		user.pg.cgpa > 10 ||
		user.ug.cgpa < 0 ||
		user.ug.cgpa > 10 ||
		user.hsc.cgpa < 0 ||
		user.hsc.cgpa > 10 ||
		user.ssc.cgpa < 0 ||
		user.ssc.cgpa > 10 ||
		user.pg.cgpa == null ||
		user.ug.cgpa == null ||
		user.hsc.cgpa == null ||
		user.ssc.cgpa == null
	)
		errorMessages.push('All CGPA fields must be between 0 and 10.');
	if (
		user.pg.percentage < 0 ||
		user.pg.percentage > 100 ||
		user.ug.percentage < 0 ||
		user.ug.percentage > 100 ||
		user.hsc.percentage < 0 ||
		user.hsc.percentage > 100 ||
		user.ssc.percentage < 0 ||
		user.ssc.percentage > 100 ||
		user.pg.percentage == null ||
		user.ug.percentage == null ||
		user.hsc.percentage == null ||
		user.ssc.percentage == null
	)
		errorMessages.push('All percentage fields must be between 0 and 100.');

	if (user.totalGapInAcademics < 0 || user.totalGapInAcademics == null || user.totalGapInAcademics > 10)
		errorMessages.push('Total gap in academics must be greater than or equal to 0.');

	if (user.backlogs < 0 || user.backlogs == null || user.backlogs > 10)
		errorMessages.push('Backlogs must be greater than or equal to 0.');

	return errorMessages;
};

exports.postSignup = async (req, res) => {
	try {
		const user = req.body;

		const validationError = validateFields(user);
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
		res.status(500).json({ messages: ['Internal server error'] });
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

		const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
		logger.info(`User logged in: ${email}`);
		res.json({ status: true, data: { user: { email: user.email }, token }, messages: ['Login Successful'] });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ status: false, messages: ['Internal server error'] });
	}
};
