import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import Company from '../models/Company';
import User from '../models/User';
import logger from '../utils/logger';

const validateAcademicField = (field: { cgpa?: number; percentage?: number }, label: string): string[] => {
	const errors: string[] = [];
	if (field.cgpa !== undefined && (field.cgpa < 0 || field.cgpa > 10)) {
		errors.push(`${label} CGPA must be between 0 and 10`);
	}
	if (field.percentage !== undefined && (field.percentage < 0 || field.percentage > 100)) {
		errors.push(`${label} percentage must be between 0 and 100`);
	}
	return errors;
};

export const viewAllUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const user = (req as any).user;
		const users =
			user.role === 'student'
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
			res.status(404).json({ message: 'No users found' });
			return;
		}
		logger.info('All users Viewed');
		res.status(200).json({ users });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const viewSingleUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const authUser = (req as any).user;
		const user = await User.findById(req.params.id);
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}
		if (authUser.role === 'student' && req.params.id !== authUser.id) {
			res.status(403).json({ message: 'Forbidden' });
			return;
		}
		logger.info(`User Viewed: ${user.name}`);
		const userObj = user.toObject();
		(userObj as any).password = null;
		res.status(200).json(userObj);
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ message: 'Invalid user ID' });
			return;
		}

		const authUser = (req as any).user;
		const user = await User.findById(req.params.id);
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		if (authUser.role === 'student' && req.params.id !== authUser.id) {
			res.status(403).json({ message: 'Forbidden' });
			return;
		}

		const validationErrors = [
			...validateAcademicField(req.body.pg || {}, 'PG'),
			...validateAcademicField(req.body.ug || {}, 'UG'),
			...validateAcademicField(req.body.hsc || {}, 'HSC'),
			...validateAcademicField(req.body.ssc || {}, 'SSC')
		];
		if (req.body.backlogs !== undefined && (req.body.backlogs < 0 || !Number.isInteger(req.body.backlogs))) {
			validationErrors.push('Backlogs must be a non-negative integer');
		}
		if (req.body.totalGapInAcademics !== undefined && (req.body.totalGapInAcademics < 0 || !Number.isInteger(req.body.totalGapInAcademics))) {
			validationErrors.push('Total gap in academics must be a non-negative integer');
		}
		if (validationErrors.length > 0) {
			res.status(400).json({ message: validationErrors.join(', ') });
			return;
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				placedAt: {
					...user.placedAt.toObject(),
					location: req.body.placedAt?.location ?? user.placedAt.location
				},
				pg: {
					cgpa: req.body.pg?.cgpa ?? user.pg.cgpa,
					percentage: req.body.pg?.percentage ?? user.pg.percentage
				},
				ug: {
					cgpa: req.body.ug?.cgpa ?? user.ug.cgpa,
					percentage: req.body.ug?.percentage ?? user.ug.percentage
				},
				hsc: {
					cgpa: req.body.hsc?.cgpa ?? user.hsc.cgpa,
					percentage: req.body.hsc?.percentage ?? user.hsc.percentage
				},
				ssc: {
					cgpa: req.body.ssc?.cgpa ?? user.ssc.cgpa,
					percentage: req.body.ssc?.percentage ?? user.ssc.percentage
				},
				backlogs: req.body.backlogs ?? user.backlogs,
				totalGapInAcademics: req.body.totalGapInAcademics ?? user.totalGapInAcademics
			},
			{ new: true }
		);
		if (!updatedUser) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		logger.info(`User updated: ${updatedUser.name}`);
		res.status(200).json(updatedUser);
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const verify = async (req: Request, res: Response): Promise<void> => {
	try {
		const authUser = (req as any).user;
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ message: 'Invalid user ID' });
			return;
		}
		if (req.params.id === authUser.id) {
			res.status(400).json({ message: 'You cannot verify your own account' });
			return;
		}

		const user = await User.findById(req.params.id);

		const updatedUser = await User.findByIdAndUpdate(req.params.id, { isVerified: !user?.isVerified }, { new: true });
		if (!updatedUser) {
			res.status(404).json({ message: 'User not found' });
			return;
		}
		logger.info(`User verified: ${updatedUser.name}`);
		res.status(200).json({
			message: `${updatedUser.name} ${updatedUser.isVerified ? 'Verified' : 'Unverified'} Successfully`
		});
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
	try {
		const authUser = (req as any).user;
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ message: 'Invalid user ID' });
			return;
		}
		if (!['admin', 'student', 'placementCoordinator'].includes(req.body.role)) {
			res.status(400).json({ message: 'Invalid role' });
			return;
		}
		if (req.params.id === authUser.id) {
			res.status(400).json({ message: 'You cannot change your own role' });
			return;
		}
		const updatedUser = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
		if (!updatedUser) {
			res.status(404).json({ message: 'User not found' });
			return;
		}
		logger.info(`User role updated: ${updatedUser.name}`);
		res.status(200).json({ message: `Role of ${updatedUser.name} updated Successfully` });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const authUser = (req as any).user;
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ message: 'Invalid user ID' });
			return;
		}
		if (req.params.id === authUser.id) {
			res.status(400).json({ message: 'You cannot delete your own account' });
			return;
		}
		const deletedUser = await User.findByIdAndDelete(req.params.id);
		if (!deletedUser) {
			res.status(404).json({ message: 'User not found' });
			return;
		}
		logger.info(`User deleted: ${deletedUser.name}`);
		res.status(200).json({ message: `Student ${deletedUser.name} deleted Successfully` });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const updateCompany = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ message: 'Invalid user ID' });
			return;
		}
		const user = await User.findById(req.params.id);
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
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
			if (company) {
				const index = company.selectedStudentsRollNo.indexOf(user.rollNo);
				if (index > -1) {
					company.selectedStudentsRollNo.splice(index, 1);
				}
				await company.save();
			}
		}
		if (req.body.companyId !== 'np') {
			const company = await Company.findById(req.body.companyId);
			if (company) {
				placedAt = {
					companyId: String(company._id),
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
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				placedAt,
				placed: req.body.companyId !== 'np'
			},
			{ new: true }
		);
		logger.info(`User company updated: ${updatedUser?.name}`);
		res.status(200).json({ message: `Company of ${updatedUser?.name} updated Successfully` });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const updateCompanyLocation = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ message: 'Invalid user ID' });
			return;
		}
		const user = await User.findById(req.params.id);
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}
		if (typeof req.body.location !== 'string' || req.body.location === null) {
			res.status(400).json({ message: 'Invalid location value' });
			return;
		}
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				'placedAt.location': req.body.location
			},
			{ new: true }
		);

		if (!updatedUser) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		logger.info(`User company location updated: ${updatedUser.name}`);
		res.status(200).json({
			message: `Company location of ${updatedUser.name} updated Successfully`
		});
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
