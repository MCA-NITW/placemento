const logger = require('../utils/logger');
const Company = require('../models/Company');
const User = require('../models/User');

const filterValidCompanies = (companies) => companies.filter((company) => company.status !== 'cancelled');

const getTotalCompaniesByStatus = (companies, status) => companies.filter((company) => company.status === status).length;

const getTotalCompaniesByProfileCategory = (companies, profileCategory) =>
	companies.filter((company) => company.profileCategory === profileCategory).length;

const calculateTotalPlacedStudents = (companies) =>
	companies.reduce((acc, company) => (company.selectedStudentsRollNo[0] !== '' ? acc + company.selectedStudentsRollNo.length : acc), 0);

const calculateTotalPlacedStudentsCTC = (companies) =>
	companies.reduce((acc, company) => (company.selectedStudentsRollNo[0] !== '' ? acc + company.selectedStudentsRollNo.length * company.ctc : acc), 0);

const getHighestCTC = (companies) => Math.max(...companies.map((company) => company.ctc));

const getHighestCTCPlaced = (companies) => Math.max(...companies.map((company) => (company.selectedStudentsRollNo.length > 0 ? company.ctc : 0)));

const getHighestCTCCompany = (companies, highestCTC) => companies.find((company) => (company.ctc === highestCTC ? company : ''));

const getHighestCTCPlacedCompany = (companies, highestCTCPlaced) =>
	companies.find((company) => (company.selectedStudentsRollNo.length > 0 ? company.ctc === highestCTCPlaced : ''));

const getHighestCTCStudent = (students, companies, highestCTCPlacedCompany) =>
	students.find((student) =>
		companies.find((company) => company.name === highestCTCPlacedCompany && company.selectedStudentsRollNo.includes(student.rollNo))
	);

const getTopLocations = (companies) => {
	const locations = companies.reduce((acc, company) => {
		const companyLocations = company.locations;
		companyLocations.forEach((location) => {
			if (acc.has(location)) {
				acc.set(location, acc.get(location) + 1);
			} else {
				acc.set(location, 1);
			}
		});
		return acc;
	}, new Map());

	const sortedLocations = Array.from(locations.entries()).sort((a, b) => b[1] - a[1]);
	const topLocations = sortedLocations.map(([location, count]) => ({ location, count }));

	return topLocations;
};

exports.getCTCStats = async (req, res) => {
	try {
		const students = await User.find();
		const companies = await Company.find();
		const filterCompanies = filterValidCompanies(companies);

		const highestCTCOffered = getHighestCTC(filterCompanies);
		const highestCTCOfferedCompany = getHighestCTCCompany(filterCompanies, highestCTCOffered);
		const highestCTCPlaced = getHighestCTCPlaced(filterCompanies);
		const highestCTCPlacedCompany = getHighestCTCPlacedCompany(filterCompanies, highestCTCPlaced);
		const highestCTCPlacedStudent = getHighestCTCStudent(students, filterCompanies, highestCTCPlacedCompany.name);
		const totalPlacedStudentsCTC = calculateTotalPlacedStudentsCTC(filterCompanies);
		const avgCTC = totalPlacedStudentsCTC / calculateTotalPlacedStudents(filterCompanies);

		logger.info('CTC Stats fetched successfully');

		res.status(200).json({
			highestCTCOffered,
			highestCTCOfferedCompany: highestCTCOfferedCompany.name,
			highestCTCPlaced,
			highestCTCPlacedCompany: highestCTCPlacedCompany.name,
			highestCTCPlacedStudent: highestCTCPlacedStudent.name,
			totalPlacedStudentsCTC,
			avgCTC
		});
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({ message: 'Internal server error' });
	}
};

exports.getCompanyStats = async (req, res) => {
	try {
		const companies = await Company.find();
		const filterCompanies = filterValidCompanies(companies);
		const totalCompanies = companies.length;
		const totalOngoingCompanies = getTotalCompaniesByStatus(companies, 'ongoing');
		const totalCompletedCompanies = getTotalCompaniesByStatus(companies, 'completed');
		const totalCancelledCompanies = getTotalCompaniesByStatus(companies, 'cancelled');
		const totalValidCompanies = totalOngoingCompanies + totalCompletedCompanies;
		const totalSoftwareCompanies = getTotalCompaniesByProfileCategory(filterCompanies, 'Software');
		const totalAnalystCompanies = getTotalCompaniesByProfileCategory(filterCompanies, 'Analyst');
		const totalOthersCompanies = getTotalCompaniesByProfileCategory(filterCompanies, 'Others');
		const totalPPOs = filterCompanies.filter((company) => company.typeOfOffer === 'PPO').length;
		const totalFTEs = filterCompanies.filter((company) => company.typeOfOffer === 'FTE').length;
		const total6MFTEs = filterCompanies.filter((company) => company.typeOfOffer === '6M+FTE').length;
		const totalInterns = filterCompanies.filter((company) => company.typeOfOffer === 'Intern').length;
		const topLocations = getTopLocations(filterCompanies);

		logger.info('Company Stats fetched successfully');

		res.status(200).json({
			totalCompanies,
			totalOngoingCompanies,
			totalCompletedCompanies,
			totalCancelledCompanies,
			totalValidCompanies,
			totalSoftwareCompanies,
			totalAnalystCompanies,
			totalOthersCompanies,
			totalPPOs,
			totalFTEs,
			total6MFTEs,
			totalInterns,
			topLocations
		});
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({ message: 'Internal server error' });
	}
};

exports.getStudentStats = async (req, res) => {
	try {
		const students = await User.find();
		const companies = await Company.find();
		const filterCompanies = filterValidCompanies(companies);
		const totalStudents = students.length;
		const totalEligibleStudents = students.filter((student) => (student.pg.cgpa >= 6.5 && student.backlogs === 0) || student.placed).length;
		const totalPlacedStudents = calculateTotalPlacedStudents(filterCompanies);
		const totalVerifiedStudents = students.filter((student) => student.isVerified === true).length;
		const totalUnverifiedStudents = students.filter((student) => student.isVerified === false).length;
		const totalAdmins = students.filter((student) => student.role === 'admin').length;
		const totalPlacementCoordinators = students.filter((student) => student.role === 'placementCoordinator').length;

		logger.info('Student Stats fetched successfully');

		res.status(200).json({
			totalStudents,
			totalEligibleStudents,
			totalPlacedStudents,
			totalVerifiedStudents,
			totalUnverifiedStudents,
			totalAdmins,
			totalPlacementCoordinators
		});
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({ message: 'Internal server error' });
	}
};
