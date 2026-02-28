import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import Company from '../models/Company';
import User from '../models/User';
import { type AuthRequest } from '../types';
import logger from '../utils/logger';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

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

// Strip password from user object before sending
const sanitizeUser = (user: any) => {
	const obj = user.toObject ? user.toObject() : { ...user };
	delete obj.password;
	return obj;
};

export const viewAllUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const authUser = (req as unknown as AuthRequest).user;
		const users =
			authUser.role === 'student'
				? await User.find({ isVerified: true }).select('-password -pg -ug -hsc -ssc -backlogs -totalGapInAcademics').lean()
				: await User.find().select('-password').sort({ rollNo: 1 }).lean();
		res.status(200).json({ users });
	} catch (error: any) {
		logger.error(`viewAllUsers: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const viewSingleUser = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid user ID'] });
			return;
		}
		const authUser = (req as unknown as AuthRequest).user;
		const user = await User.findById(req.params.id);
		if (!user) {
			res.status(404).json({ errors: ['User not found'] });
			return;
		}
		if (authUser.role === 'student' && req.params.id !== String(authUser._id)) {
			res.status(403).json({ errors: ['Forbidden'] });
			return;
		}
		res.status(200).json(sanitizeUser(user));
	} catch (error: any) {
		logger.error(`viewSingleUser: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid user ID'] });
			return;
		}

		const authUser = (req as unknown as AuthRequest).user;
		const user = await User.findById(req.params.id);
		if (!user) {
			res.status(404).json({ errors: ['User not found'] });
			return;
		}

		if (authUser.role === 'student' && req.params.id !== String(authUser._id)) {
			res.status(403).json({ errors: ['Forbidden'] });
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
			res.status(400).json({ errors: validationErrors });
			return;
		}

		// Whitelist: only allow academic fields and location to be updated
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
			res.status(404).json({ errors: ['User not found'] });
			return;
		}

		logger.info(`User updated: ${updatedUser.name}`);
		res.status(200).json(sanitizeUser(updatedUser));
	} catch (error: any) {
		logger.error(`updateUser: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const verify = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid user ID'] });
			return;
		}
		const authUser = (req as unknown as AuthRequest).user;
		if (req.params.id === String(authUser._id)) {
			res.status(400).json({ errors: ['You cannot verify your own account'] });
			return;
		}

		const user = await User.findById(req.params.id);
		if (!user) {
			res.status(404).json({ errors: ['User not found'] });
			return;
		}

		const updatedUser = await User.findByIdAndUpdate(req.params.id, { isVerified: !user.isVerified }, { new: true });
		logger.info(`User ${updatedUser!.isVerified ? 'verified' : 'unverified'}: ${updatedUser!.name}`);
		res.status(200).json({ message: `${updatedUser!.name} ${updatedUser!.isVerified ? 'verified' : 'unverified'} successfully` });
	} catch (error: any) {
		logger.error(`verify: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid user ID'] });
			return;
		}
		const authUser = (req as unknown as AuthRequest).user;
		if (!['admin', 'student', 'placementCoordinator'].includes(req.body.role)) {
			res.status(400).json({ errors: ['Invalid role'] });
			return;
		}
		if (req.params.id === String(authUser._id)) {
			res.status(400).json({ errors: ['You cannot change your own role'] });
			return;
		}
		const updatedUser = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
		if (!updatedUser) {
			res.status(404).json({ errors: ['User not found'] });
			return;
		}
		logger.info(`Role updated for ${updatedUser.name} to ${updatedUser.role}`);
		res.status(200).json({ message: `Role of ${updatedUser.name} updated successfully` });
	} catch (error: any) {
		logger.error(`updateRole: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid user ID'] });
			return;
		}
		const authUser = (req as unknown as AuthRequest).user;
		if (req.params.id === String(authUser._id)) {
			res.status(400).json({ errors: ['You cannot delete your own account'] });
			return;
		}
		const deletedUser = await User.findByIdAndDelete(req.params.id);
		if (!deletedUser) {
			res.status(404).json({ errors: ['User not found'] });
			return;
		}
		logger.info(`User deleted: ${deletedUser.name}`);
		res.status(200).json({ message: `${deletedUser.name} deleted successfully` });
	} catch (error: any) {
		logger.error(`deleteUser: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const updateCompany = async (req: Request, res: Response): Promise<void> => {
	// Uses transaction since it modifies both User and Company documents
	const session = await mongoose.startSession();
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid user ID'] });
			return;
		}
		if (req.body.companyId !== 'np' && !isValidObjectId(req.body.companyId)) {
			res.status(400).json({ errors: ['Invalid company ID'] });
			return;
		}

		session.startTransaction();

		const user = await User.findById(req.params.id).session(session);
		if (!user) {
			await session.abortTransaction();
			res.status(404).json({ errors: ['User not found'] });
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

		// Remove from previous company
		if (user.placedAt.companyId !== 'np' && isValidObjectId(user.placedAt.companyId)) {
			await Company.findByIdAndUpdate(user.placedAt.companyId, { $pull: { selectedStudentsRollNo: user.rollNo } }, { session });
		}

		// Add to new company
		if (req.body.companyId !== 'np') {
			const company = await Company.findById(req.body.companyId).session(session);
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
				await Company.findByIdAndUpdate(company._id, { $addToSet: { selectedStudentsRollNo: user.rollNo } }, { session });
			}
		}

		const updatedUser = await User.findByIdAndUpdate(req.params.id, { placedAt, placed: req.body.companyId !== 'np' }, { new: true, session });

		await session.commitTransaction();
		logger.info(`Company updated for ${updatedUser?.name}`);
		res.status(200).json({ message: `Company of ${updatedUser?.name} updated successfully` });
	} catch (error: any) {
		await session.abortTransaction();
		logger.error(`updateCompany: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	} finally {
		session.endSession();
	}
};

export const updateCompanyLocation = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid user ID'] });
			return;
		}
		if (typeof req.body.location !== 'string' || !req.body.location) {
			res.status(400).json({ errors: ['Invalid location value'] });
			return;
		}
		const updatedUser = await User.findByIdAndUpdate(req.params.id, { 'placedAt.location': req.body.location }, { new: true });
		if (!updatedUser) {
			res.status(404).json({ errors: ['User not found'] });
			return;
		}
		logger.info(`Location updated for ${updatedUser.name}`);
		res.status(200).json({ message: `Location of ${updatedUser.name} updated successfully` });
	} catch (error: any) {
		logger.error(`updateCompanyLocation: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
	try {
		const authUser = (req as unknown as AuthRequest).user;
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			res.status(400).json({ errors: ['Current password and new password are required'] });
			return;
		}
		if (!PASSWORD_REGEX.test(newPassword)) {
			res.status(400).json({ errors: ['Password must be at least 6 characters with one uppercase, one lowercase, and one number'] });
			return;
		}

		const user = await User.findById(authUser._id);
		if (!user) {
			res.status(404).json({ errors: ['User not found'] });
			return;
		}

		const match = await bcrypt.compare(currentPassword, user.password);
		if (!match) {
			logger.warn(`Failed password change attempt: ${user.email}`);
			res.status(401).json({ errors: ['Current password is incorrect'] });
			return;
		}

		user.password = await bcrypt.hash(newPassword, Number(process.env.JWT_SALT_ROUNDS));
		await user.save();
		logger.info(`Password changed for ${user.email}`);
		res.status(200).json({ message: 'Password changed successfully' });
	} catch (error: any) {
		logger.error(`changePassword: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};
