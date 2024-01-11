const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const saltRounds = 10;

const validateFields = (name, rollNo, email, password) => {
  if (!name || !email || !password || !rollNo) return 'All fields are required';
  if (!email.endsWith('@student.nitw.ac.in')) return 'Enter a valid College Mail Id.';
  if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
    return 'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, and one digit.';
  if (!rollNo.match(/^[0-9]{2}MCF1R[0-9]{2,}$/)) return 'Enter a valid Roll No. (Ex: 21MCF1R47).';
  return null;
};

exports.postSignup = async (req, res) => {
  try {
    const { name, rollNo, email, password, role } = req.body;

    const validationError = validateFields(name, rollNo, email, password);
    if (validationError) return res.status(400).json({ message: validationError });

    const existingUser = await User.findOne({ $or: [{ email }, { rollNo }] });
    if (existingUser) return res.status(400).json({ message: 'User with the same email or rollNo already exists' });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await new User({ name, email, password: hashedPassword, rollNo, role }).save();
    logger.info(`New user created: ${email}`);

    res.status(201).json({
      message:
        'Reach out to the admin to verify your account. You will be able to login once your account is verified.',
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)) || !user.isVerified) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log(token);

    logger.info(`User logged in: ${email}`);
    res.json({ status: true, data: { user: { email: user.email }, token } });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};
