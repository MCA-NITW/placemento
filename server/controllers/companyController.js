const Company = require('../models/Company');
const logger = require('../utils/logger');
const asyncHandler = require('../middleware/asyncHandler');

const validateFields = (company) => {
	const errorMessages = [];
	if (!company.name) errorMessages.push('Name is required.');
	if (!company.status) errorMessages.push('Status is required.');
	if (!company.profileCategory) errorMessages.push('Profile Category is required.');
	if (!company.typeOfOffer) errorMessages.push('Type of Offer is required.');
	for (const rollNo of company.selectedStudentsRollNo) {
		if (!rollNo.match(/^\d{2}MCF1R\d{2,}$/)) {
			errorMessages.push('Enter a valid roll number. (Eg: 21MCF1R01)');
			break;
		}
	}
	return errorMessages;
};

// Add Company
exports.postAddCompany = asyncHandler(async (req, res) => {
	// Validate and fix date if needed
	if (req.body.dateOfOffer) {
		const date = new Date(req.body.dateOfOffer);
		if (isNaN(date.getTime()) || req.body.dateOfOffer === 'NaN-NaN-NaN') {
			req.body.dateOfOffer = new Date(); // Use current date if invalid
		}
	}

	const newCompany = new Company(req.body);
	const errorMessages = validateFields(newCompany);
	if (errorMessages.length > 0) {
		return res.status(400).json({ errors: errorMessages });
	}
	const savedCompany = await newCompany.save();
	logger.info(`New company added: ${savedCompany.name}`);
	res.status(200).json(savedCompany);
});

// Update Company
exports.putUpdateCompany = asyncHandler(async (req, res) => {
	// Validate and fix date if needed
	if (req.body.dateOfOffer) {
		const date = new Date(req.body.dateOfOffer);
		if (isNaN(date.getTime()) || req.body.dateOfOffer === 'NaN-NaN-NaN') {
			req.body.dateOfOffer = new Date(); // Use current date if invalid
		}
	}

	const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
	if (!updatedCompany) {
		return res.status(404).json({ errors: ['Company not found'] });
	}
	const errorMessages = validateFields(updatedCompany);
	if (errorMessages.length > 0) {
		return res.status(400).json({ errors: errorMessages });
	}
	logger.info(`Company updated: ${updatedCompany.name}`);
	res.status(200).json(updatedCompany);
});

// Delete Company
exports.deleteCompany = asyncHandler(async (req, res) => {
	const deletedCompany = await Company.findByIdAndDelete(req.params.id);
	if (!deletedCompany) {
		return res.status(404).json({ message: 'Company not found' });
	}
	logger.info(`Company deleted: ${deletedCompany.name}`);
	res.json(deletedCompany);
});

// View Company by ID
exports.getViewCompanyById = asyncHandler(async (req, res) => {
	const company = await Company.findById(req.params.id);
	if (!company) {
		return res.status(404).json({ message: 'Company not found' });
	}
	logger.info(`Company viewed: ${company.name}`);
	res.json(company);
});

// View All Companies
exports.getViewCompany = asyncHandler(async (req, res) => {
	const companies = await Company.find().sort({ dateOfOffer: 1 });
	logger.info('All companies viewed');
	res.json(companies);
});
