import { Request, Response } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import Company from '../models/Company';
import User from '../models/User';
import logger from '../utils/logger';

const validateFields = (company: any): string[] => {
	const errors: string[] = [];
	if (!company.name) errors.push('Name is required.');
	if (!company.status) errors.push('Status is required.');
	if (!company.profileCategory) errors.push('Profile category is required.');
	if (!company.typeOfOffer) errors.push('Type of offer is required.');
	if (company.selectedStudentsRollNo) {
		for (const rollNo of company.selectedStudentsRollNo) {
			if (!rollNo.match(/^\d{2}MCF1R\d{2,}$/)) {
				errors.push('Enter a valid roll number. (e.g. 21MCF1R01)');
				break;
			}
		}
	}
	return errors;
};

const pickCompanyFields = (body: any) => ({
	name: body.name,
	status: body.status,
	interviewShortlist: body.interviewShortlist,
	selected: body.selected,
	selectedStudentsRollNo: body.selectedStudentsRollNo,
	dateOfOffer: body.dateOfOffer,
	locations: body.locations,
	cutoffs: body.cutoffs,
	typeOfOffer: body.typeOfOffer,
	profile: body.profile,
	profileCategory: body.profileCategory,
	ctc: body.ctc,
	ctcBreakup: body.ctcBreakup,
	bond: body.bond
});

export const postAddCompany = async (req: Request, res: Response): Promise<void> => {
	try {
		const allowedFields = pickCompanyFields(req.body);

		if (allowedFields.dateOfOffer) {
			const date = new Date(allowedFields.dateOfOffer);
			if (Number.isNaN(date.getTime())) {
				allowedFields.dateOfOffer = new Date();
			}
		}

		const newCompany = new Company(allowedFields);
		const errorMessages = validateFields(newCompany);
		if (errorMessages.length > 0) {
			res.status(400).json({ errors: errorMessages });
			return;
		}
		const savedCompany = await newCompany.save();
		logger.info(`Company added: ${savedCompany.name}`);
		res.status(201).json(savedCompany);
	} catch (error: any) {
		logger.error(`postAddCompany: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const putUpdateCompany = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid company ID'] });
			return;
		}
		const allowedFields = pickCompanyFields(req.body);

		if (allowedFields.dateOfOffer) {
			const date = new Date(allowedFields.dateOfOffer);
			if (Number.isNaN(date.getTime())) {
				allowedFields.dateOfOffer = new Date();
			}
		}

		const errorMessages = validateFields(allowedFields);
		if (errorMessages.length > 0) {
			res.status(400).json({ errors: errorMessages });
			return;
		}

		const updatedCompany = await Company.findByIdAndUpdate(req.params.id, allowedFields, { new: true });
		if (!updatedCompany) {
			res.status(404).json({ errors: ['Company not found'] });
			return;
		}
		logger.info(`Company updated: ${updatedCompany.name}`);
		res.status(200).json(updatedCompany);
	} catch (error: any) {
		logger.error(`putUpdateCompany: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
	const session = await mongoose.startSession();
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid company ID'] });
			return;
		}

		session.startTransaction();

		const deletedCompany = await Company.findByIdAndDelete(req.params.id, { session });
		if (!deletedCompany) {
			await session.abortTransaction();
			res.status(404).json({ errors: ['Company not found'] });
			return;
		}

		// Cascade: reset all students placed at this company
		const notPlaced = {
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
		await User.updateMany({ 'placedAt.companyId': String(deletedCompany._id) }, { placed: false, placedAt: notPlaced }, { session });

		await session.commitTransaction();
		logger.info(`Company deleted (cascaded): ${deletedCompany.name}`);
		res.status(200).json({ message: `${deletedCompany.name} deleted successfully` });
	} catch (error: any) {
		await session.abortTransaction();
		logger.error(`deleteCompany: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	} finally {
		session.endSession();
	}
};

export const getViewCompanyById = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid company ID'] });
			return;
		}
		const company = await Company.findById(req.params.id).lean();
		if (!company) {
			res.status(404).json({ errors: ['Company not found'] });
			return;
		}
		res.status(200).json(company);
	} catch (error: any) {
		logger.error(`getViewCompanyById: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const getViewCompany = async (_req: Request, res: Response): Promise<void> => {
	try {
		const companies = await Company.find().sort({ dateOfOffer: 1 }).lean();
		res.status(200).json({ companies });
	} catch (error: any) {
		logger.error(`getViewCompany: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};
