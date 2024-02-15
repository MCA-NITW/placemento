const User = require('../models/User');
const Company = require('../models/Company');
const logger = require('../utils/logger');
const { isValidObjectId } = require('mongoose');

// View all users
exports.viewAllUsers = async (req, res) => {
	try {
		const users =
			req.user.role === 'student'
				? await User.find({ isVerified: true }).select({
						password: 0,
						pg: 0,
						ug: 0,
						hsc: 0,
						ssc: 0,
						backlogs: 0,
						totalGapInAcademics: 0
					})
				: await User.find().select({ password: 0 }).sort({ rollNo: 1 });
		if (!users) {
			return res.status(404).json({ message: 'No users found' });
		}
		logger.info(`All users Viewed`);
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
		if (req.user.role === 'student' && req.params.id !== req.user.id) {
			return res.status(403).json({ message: 'Forbidden' });
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

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				placedAt: {
					...user.placedAt,
					location: req.body.placedAt.location
				},
				pg: {
					cgpa: req.body.pg.cgpa,
					percentage: req.body.pg.percentage
				},
				ug: {
					cgpa: req.body.ug.cgpa,
					percentage: req.body.ug.percentage
				},
				hsc: {
					cgpa: req.body.hsc.cgpa,
					percentage: req.body.hsc.percentage
				},
				ssc: {
					cgpa: req.body.ssc.cgpa,
					percentage: req.body.ssc.percentage
				},
				backlogs: req.body.backlogs,
				totalGapInAcademics: req.body.totalGapInAcademics
			},
			{ new: true }
		);
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
		if (!['admin', 'student', 'placementCoordinator'].includes(req.body.role)) {
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

		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		logger.info(`User company location updated: ${updatedUser.name}`);
		res.status(200).json({
			message: `Company location of ${updatedUser.name} updated Successfully`
		});
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
