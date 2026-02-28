import { Request, Response } from 'express';
import Company from '../models/Company';
import User from '../models/User';
import logger from '../utils/logger';

// Lean query results — plain objects, not Mongoose documents
type CompanyData = {
	name: string;
	status: string;
	profileCategory: string;
	typeOfOffer: string;
	ctc: number;
	ctcBreakup: { base: number };
	selectedStudentsRollNo: string[];
	locations: string[];
};
type StudentData = { name: string; rollNo: string; pg: { cgpa: number }; backlogs: number; placed: boolean };

const filterValidCompanies = (companies: CompanyData[]) => companies.filter((c) => c.status !== 'cancelled');

const getTotalCompaniesByStatus = (companies: CompanyData[], status: string) => companies.filter((c) => c.status === status).length;

const getTotalCompaniesByProfileCategory = (companies: CompanyData[], cat: string) => companies.filter((c) => c.profileCategory === cat).length;

const calculateTotalPlacedStudents = (companies: CompanyData[]) =>
	companies.reduce((acc, c) => acc + c.selectedStudentsRollNo.filter((r) => r && r.trim() !== '').length, 0);

const calculateTotalPlacedStudentsCTC = (companies: CompanyData[]) =>
	companies.reduce((acc, c) => acc + c.selectedStudentsRollNo.filter((r) => r && r.trim() !== '').length * (c.ctc || 0), 0);

const getHighestCTC = (companies: CompanyData[]) => (companies.length === 0 ? 0 : Math.max(...companies.map((c) => c.ctc || 0)));

const getHighestCTCPlaced = (companies: CompanyData[]) => {
	const placed = companies.filter((c) => c.selectedStudentsRollNo.length > 0);
	return placed.length === 0 ? 0 : Math.max(...placed.map((c) => c.ctc || 0));
};

const getHighestCTCCompany = (companies: CompanyData[], ctc: number) => companies.find((c) => c.ctc === ctc) || null;

const getHighestCTCPlacedCompany = (companies: CompanyData[], ctc: number) =>
	companies.find((c) => c.selectedStudentsRollNo.length > 0 && c.ctc === ctc) || null;

const getHighestCTCStudent = (students: StudentData[], companies: CompanyData[], companyName: string | undefined) => {
	if (!companyName) return null;
	return students.find((s) => companies.find((c) => c.name === companyName && c.selectedStudentsRollNo.includes(s.rollNo))) || null;
};

const getTopLocations = (companies: CompanyData[]) => {
	const map = new Map<string, number>();
	companies.forEach((c) => c.locations.forEach((l) => map.set(l, (map.get(l) || 0) + 1)));
	return Array.from(map.entries())
		.sort((a, b) => b[1] - a[1])
		.map(([location, count]) => ({ location, count }));
};

export const getCTCStats = async (_req: Request, res: Response): Promise<void> => {
	try {
		const students = await User.find().lean();
		const companies = await Company.find().lean();
		const filterCompanies = filterValidCompanies(companies);

		if (filterCompanies.length === 0) {
			res.status(200).json({
				highestCTCOffered: 0,
				highestCTCOfferedCompany: 'N/A',
				highestCTCPlaced: 0,
				highestCTCPlacedCompany: 'N/A',
				highestCTCPlacedStudent: 'N/A',
				totalPlacedStudentsCTC: 0,
				avgCTC: 0
			});
			return;
		}

		const highestCTCOffered = getHighestCTC(filterCompanies);
		const highestCTCOfferedCompany = getHighestCTCCompany(filterCompanies, highestCTCOffered);
		const highestCTCPlaced = getHighestCTCPlaced(filterCompanies);
		const highestCTCPlacedCompany = getHighestCTCPlacedCompany(filterCompanies, highestCTCPlaced);
		const highestCTCPlacedStudent = getHighestCTCStudent(students, filterCompanies, highestCTCPlacedCompany?.name);
		const totalPlacedStudentsCTC = calculateTotalPlacedStudentsCTC(filterCompanies);
		const totalPlacedStudents = calculateTotalPlacedStudents(filterCompanies);
		const avgCTC = totalPlacedStudents > 0 ? totalPlacedStudentsCTC / totalPlacedStudents : 0;

		logger.info('CTC Stats fetched successfully');

		res.status(200).json({
			highestCTCOffered: highestCTCOffered || 0,
			highestCTCOfferedCompany: highestCTCOfferedCompany?.name || 'N/A',
			highestCTCPlaced: highestCTCPlaced || 0,
			highestCTCPlacedCompany: highestCTCPlacedCompany?.name || 'N/A',
			highestCTCPlacedStudent: highestCTCPlacedStudent?.name || 'N/A',
			totalPlacedStudentsCTC,
			avgCTC
		});
	} catch (error: any) {
		logger.error(error.message);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const getCompanyStats = async (_req: Request, res: Response): Promise<void> => {
	try {
		const companies = await Company.find().lean();
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
	} catch (error: any) {
		logger.error(error.message);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const getStudentStats = async (_req: Request, res: Response): Promise<void> => {
	try {
		const students = await User.find().lean();
		const companies = await Company.find().lean();
		const filterCompanies = filterValidCompanies(companies);
		const totalStudents = students.length;
		const totalEligibleStudents = students.filter((student) => (student.pg.cgpa >= 6.5 && student.backlogs === 0) || student.placed).length;
		const totalPlacedStudents = calculateTotalPlacedStudents(filterCompanies);
		const totalVerifiedStudents = students.filter((student) => student.isVerified === true).length;
		const totalUnverifiedStudents = students.filter((student) => student.isVerified === false).length;
		const totalAdmins = students.filter((student) => student.role === 'admin').length;
		const totalPlacementCoordinators = students.filter((student) => student.role === 'placementCoordinator').length;

		logger.info('Student Stats fetched successfully');

		const placementPercentage = totalEligibleStudents > 0 ? ((totalPlacedStudents / totalEligibleStudents) * 100).toFixed(1) : '0';

		res.status(200).json({
			totalStudents,
			totalEligibleStudents,
			totalPlacedStudents,
			placementPercentage,
			totalVerifiedStudents,
			totalUnverifiedStudents,
			totalAdmins,
			totalPlacementCoordinators
		});
	} catch (error: any) {
		logger.error(error.message);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

// Combined dashboard — single call for Home page
export const getDashboard = async (_req: Request, res: Response): Promise<void> => {
	try {
		const [students, companies] = await Promise.all([User.find().lean(), Company.find().lean()]);
		const valid = filterValidCompanies(companies);
		const totalPlaced = calculateTotalPlacedStudents(valid);
		const eligible = students.filter((s) => (s.pg.cgpa >= 6.5 && s.backlogs === 0) || s.placed).length;
		const highestCTC = valid.length > 0 ? Math.max(...valid.map((c) => c.ctc || 0)) : 0;
		const totalCTC = calculateTotalPlacedStudentsCTC(valid);
		const avgCTC = totalPlaced > 0 ? totalCTC / totalPlaced : 0;

		res.status(200).json({
			students: {
				total: students.length,
				placed: totalPlaced,
				percentage: eligible > 0 ? ((totalPlaced / eligible) * 100).toFixed(1) : '0'
			},
			companies: {
				total: companies.length,
				active: companies.filter((c) => c.status === 'ongoing').length
			},
			ctc: {
				highest: highestCTC,
				average: Number(avgCTC.toFixed(2))
			}
		});
	} catch (error: any) {
		logger.error(`getDashboard: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};
