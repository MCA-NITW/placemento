const User = require('../models/User');
const Company = require('../models/Company');
const logger = require('../utils/logger');
const { isValidObjectId } = require('mongoose');

// View all users
exports.viewAllUsers = async (req, res) => {
	try {
		const users = req.user.role === 'student' ? await User.find({ isVerified: true }) : await User.find();
		if (!users) {
			return res.status(404).json({ message: 'No users found' });
		}
		logger.info(`All users Viewed`);
		users.forEach((user) => {
			user.password = null;
			if (req.user.role === 'student') {
				user.pg = null;
				user.ug = null;
				user.hsc = null;
				user.ssc = null;
				user.backlogs = null;
				user.totalGapInAcademics = null;
			}
		});
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
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		logger.info(`User Viewed: ${user.name}`);
		user.password = null;
		res.status(200).json(user);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error });
	}
};

// Update a User
exports.updateUser = async (req, res) => {
	try {
		if (!isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: 'Invalid user ID' });
		}

		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (req.user.role === 'student' && req.params.id !== req.user.id) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		const updatedData = req.body;
		if (req.user.role === 'student') {
			delete updatedData.name;
			delete updatedData.email;
			delete updatedData.rollNo;
			delete updatedData.role;
			delete updatedData.batch;
			delete updatedData.password;
			delete updatedData.isVerified;
			delete updatedData.placed;
			delete updatedData.placedAt.companyId;
			delete updatedData.placedAt.companyName;
			delete updatedData.placedAt.ctc;
			delete updatedData.placedAt.ctcBase;
			delete updatedData.placedAt.profile;
			delete updatedData.placedAt.profileType;
			delete updatedData.placedAt.offer;
		}

		const updatedUser = await User.findByIdAndUpdate(req.params.id, { ...user.toObject(), ...updatedData }, { new: true });
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

// Update Verification Status of a User
exports.verify = async (req, res) => {
	try {
		if (!isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: 'Invalid user ID' });
		}
		if (req.params.id === req.user.id) {
			return res.status(400).json({ message: 'You cannot verify your own account' });
		}

		const user = await User.findById(req.params.id);

		const updatedUser = await User.findByIdAndUpdate(req.params.id, { isVerified: !user.isVerified }, { new: true });
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		logger.info(`User verified: ${updatedUser.name}`);
		res.status(200).json({
			message: `${updatedUser.name} ${updatedUser.isVerified ? 'Verified' : 'Unverified'} Successfully`
		});
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Update Role of a User
exports.updateRole = async (req, res) => {
	try {
		if (!isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: 'Invalid user ID' });
		}
		console.log(req.body.role);
		if (req.body.role !== 'admin' && req.body.role !== 'student' && req.body.role !== 'placementCoordinator') {
			return res.status(400).json({ message: 'Invalid role' });
		}
		if (req.params.id === req.user.id) {
			return res.status(400).json({ message: 'You cannot change your own role' });
		}
		const updatedUser = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		logger.info(`User role updated: ${updatedUser.name}`);
		res.status(200).json({ message: `Role of ${updatedUser.name} updated Successfully` });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Delete a User
exports.deleteUser = async (req, res) => {
	try {
		if (!isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: 'Invalid user ID' });
		}
		if (req.params.id === req.user.id) {
			return res.status(400).json({ message: 'You cannot delete your own account' });
		}
		const deletedUser = await User.findByIdAndDelete(req.params.id);
		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		logger.info(`User deleted: ${deletedUser.name}`);
		res.status(200).json({ message: `Student ${deletedUser.name} deleted Successfully` });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Update Compay of a User
exports.updateCompany = async (req, res) => {
	try {
		if (!isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: 'Invalid user ID' });
		}
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		let placedAt = {
			companyId: 'np',
			companyName: 'Not Placed',
			ctc: 0,
			ctcBase: 0,
			profile: 'N/A',
			profileType: 'N/A',
			offer: 'N/A',
			location: 'N/A',
			bond: 0
		};

		if (user.placedAt.companyId !== 'np') {
			const company = await Company.findById(user.placedAt.companyId);
			const index = company.selectedStudentsRollNo.indexOf(user.rollNo);
			if (index > -1) {
				company.selectedStudentsRollNo.splice(index, 1);
			}
			await company.save();
		}
		console.log(req.body.companyId);

		if (req.body.companyId !== 'np') {
			const company = await Company.findById(req.body.companyId);
			placedAt = {
				companyId: company._id,
				companyName: company.name,
				ctc: company.ctc,
				ctcBase: company.ctcBreakup.base,
				profile: company.profile,
				profileType: company.profileCategory,
				offer: company.typeOfOffer,
				location: 'N/A',
				bond: company.bond
			};
			if (!company.selectedStudentsRollNo.includes(user.rollNo)) {
				company.selectedStudentsRollNo.push(user.rollNo);
				await company.save();
			}
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				placedAt,
				placed: req.body.companyId !== 'np'
			},
			{ new: true }
		);
		logger.info(`User company updated: ${updatedUser.name}`);
		res.status(200).json({ message: `Company of ${updatedUser.name} updated Successfully` });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Update Users Company Location by Default 'N/A'
exports.updateCompanyLocation = async (req, res) => {
	try {
		if (!isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: 'Invalid user ID' });
		}
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				'placedAt.location': req.body.location
			},
			{ new: true }
		);
		logger.info(`User company location updated: ${updatedUser.name}`);
		res.status(200).json({
			message: `Company location of ${updatedUser.name} updated Successfully`
		});
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
