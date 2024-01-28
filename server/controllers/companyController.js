const Company = require('../models/Company');
const logger = require('../utils/logger');

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
exports.postAddCompany = async (req, res) => {
	try {
		const newCompany = new Company(req.body);
		const errorMessages = validateFields(newCompany);
		if (errorMessages.length > 0) {
			return res.status(400).json({ errors: errorMessages });
		}
		const savedCompany = await newCompany.save();
		logger.info(`New company added: ${savedCompany.name}`);
		res.status(200).json(savedCompany);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

// Update Company
exports.putUpdateCompany = async (req, res) => {
	try {
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
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

// Delete Company
exports.deleteCompany = async (req, res) => {
	try {
		const deletedCompany = await Company.findByIdAndDelete(req.params.id);
		if (!deletedCompany) {
			return res.status(404).json({ message: 'Company not found' });
		}
		logger.info(`Company deleted: ${deletedCompany.name}`);
		res.json(deletedCompany);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// View Company by ID
exports.getViewCompanyById = async (req, res) => {
	try {
		const company = await Company.findById(req.params.id);
		if (!company) {
			return res.status(404).json({ message: 'Company not found' });
		}
		logger.info(`Company viewed: ${company.name}`);
		res.json(company);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// View All Companies
exports.getViewCompany = async (req, res) => {
	try {
		const companies = await Company.find();
		logger.info('All companies viewed');
		res.json(companies);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
