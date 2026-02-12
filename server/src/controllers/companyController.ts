import { Request, Response } from 'express';
import Company from '../models/Company';
import logger from '../utils/logger';

const validateFields = (company: any): string[] => {
	const errorMessages: string[] = [];
	if (!company.name) errorMessages.push('Name is required.');
	if (!company.status) errorMessages.push('Status is required.');
	if (!company.profileCategory) errorMessages.push('Profile Category is required.');
	if (!company.typeOfOffer) errorMessages.push('Type of Offer is required.');
	if (company.selectedStudentsRollNo) {
		for (const rollNo of company.selectedStudentsRollNo) {
			if (!rollNo.match(/^\d{2}MCF1R\d{2,}$/)) {
				errorMessages.push('Enter a valid roll number. (Eg: 21MCF1R01)');
				break;
			}
		}
	}
	return errorMessages;
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
			if (isNaN(date.getTime()) || allowedFields.dateOfOffer === 'NaN-NaN-NaN') {
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
		logger.info(`New company added: ${savedCompany.name}`);
		res.status(201).json(savedCompany);
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const putUpdateCompany = async (req: Request, res: Response): Promise<void> => {
	try {
		const allowedFields = pickCompanyFields(req.body);

		if (allowedFields.dateOfOffer) {
			const date = new Date(allowedFields.dateOfOffer);
			if (isNaN(date.getTime()) || allowedFields.dateOfOffer === 'NaN-NaN-NaN') {
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
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
	try {
		const deletedCompany = await Company.findByIdAndDelete(req.params.id);
		if (!deletedCompany) {
			res.status(404).json({ message: 'Company not found' });
			return;
		}
		logger.info(`Company deleted: ${deletedCompany.name}`);
		res.json(deletedCompany);
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const getViewCompanyById = async (req: Request, res: Response): Promise<void> => {
	try {
		const company = await Company.findById(req.params.id);
		if (!company) {
			res.status(404).json({ message: 'Company not found' });
			return;
		}
		logger.info(`Company viewed: ${company.name}`);
		res.json(company);
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const getViewCompany = async (_req: Request, res: Response): Promise<void> => {
	try {
		const companies = await Company.find().sort({ dateOfOffer: 1 });
		logger.info('All companies viewed');
		res.json(companies);
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
