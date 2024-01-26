const User = require('../models/User');
const logger = require('../utils/logger');

// View all users
exports.viewAllUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).json({ users });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error });
	}
};

// View a single user by ID
exports.viewSingleUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(200).json({ user });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error });
	}
};

// Update a User
exports.updateUser = async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		logger.info(`User updated: ${updatedUser.name}`);
		res.status(200).json(updatedUser);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
