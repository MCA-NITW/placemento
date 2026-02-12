import { Request, Response } from 'express';
import Company from '../models/Company';
import User from '../models/User';
import { ICompany, IUser } from '../types';
import logger from '../utils/logger';

const filterValidCompanies = (companies: ICompany[]) => companies.filter((company) => company.status !== 'cancelled');

const getTotalCompaniesByStatus = (companies: ICompany[], status: string) =>
	companies.filter((company) => company.status === status).length;

const getTotalCompaniesByProfileCategory = (companies: ICompany[], profileCategory: string) =>
	companies.filter((company) => company.profileCategory === profileCategory).length;

const calculateTotalPlacedStudents = (companies: ICompany[]) =>
	companies.reduce((acc, company) => {
		const validRollNos = company.selectedStudentsRollNo.filter((rollNo) => rollNo && rollNo.trim() !== '');
		return acc + validRollNos.length;
	}, 0);

const calculateTotalPlacedStudentsCTC = (companies: ICompany[]) =>
	companies.reduce((acc, company) => {
		const validRollNos = company.selectedStudentsRollNo.filter((rollNo) => rollNo && rollNo.trim() !== '');
		return acc + validRollNos.length * (company.ctc || 0);
	}, 0);

const getHighestCTC = (companies: ICompany[]) => {
	if (companies.length === 0) return 0;
	return Math.max(...companies.map((company) => company.ctc || 0));
};

const getHighestCTCPlaced = (companies: ICompany[]) => {
	const placedCompanies = companies.filter((company) => company.selectedStudentsRollNo.length > 0);
	if (placedCompanies.length === 0) return 0;
	return Math.max(...placedCompanies.map((company) => company.ctc || 0));
};

const getHighestCTCCompany = (companies: ICompany[], highestCTC: number) =>
	companies.find((company) => company.ctc === highestCTC) || null;

const getHighestCTCPlacedCompany = (companies: ICompany[], highestCTCPlaced: number) =>
	companies.find((company) => company.selectedStudentsRollNo.length > 0 && company.ctc === highestCTCPlaced) || null;

const getHighestCTCStudent = (students: IUser[], companies: ICompany[], highestCTCPlacedCompanyName: string | undefined) => {
	if (!highestCTCPlacedCompanyName) return null;
	return (
		students.find((student) =>
			companies.find(
				(company) => company.name === highestCTCPlacedCompanyName && company.selectedStudentsRollNo.includes(student.rollNo)
			)
		) || null
	);
};

const getTopLocations = (companies: ICompany[]) => {
	const locations = companies.reduce((acc, company) => {
		company.locations.forEach((location) => {
			acc.set(location, (acc.get(location) || 0) + 1);
		});
		return acc;
	}, new Map<string, number>());

	const sortedLocations = Array.from(locations.entries()).sort((a, b) => b[1] - a[1]);
	return sortedLocations.map(([location, count]) => ({ location, count }));
};

export const getCTCStats = async (_req: Request, res: Response): Promise<void> => {
	try {
		const students = await User.find();
		const companies = await Company.find();
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
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const getCompanyStats = async (_req: Request, res: Response): Promise<void> => {
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
	} catch (error: any) {
		logger.error(error.message);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const getStudentStats = async (_req: Request, res: Response): Promise<void> => {
	try {
		const students = await User.find();
		const companies = await Company.find();
		const filterCompanies = filterValidCompanies(companies);
		const totalStudents = students.length;
		const totalEligibleStudents = students.filter(
			(student) => (student.pg.cgpa >= 6.5 && student.backlogs === 0) || student.placed
		).length;
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
	} catch (error: any) {
		logger.error(error.message);
		res.status(500).json({ message: 'Internal server error' });
	}
};
