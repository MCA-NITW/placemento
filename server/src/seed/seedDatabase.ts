import bcrypt from 'bcrypt';
import Company from '../models/Company';
import Experience from '../models/Experience';
import Otp from '../models/Otp';
import User from '../models/User';
import { buildDemoData, DEMO_CREDENTIAL } from './demoData';

export interface SeedSummary {
	users: number;
	verifiedUsers: number;
	placedStudents: number;
	companies: number;
	experiences: number;
}

// Replaces every User, Company, Experience and Otp document with the demo dataset.
// Callers decide whether wiping is allowed (see seed.ts for the guard).
export const seedDatabase = async (): Promise<SeedSummary> => {
	const { users, companies, experiences } = buildDemoData();
	const rounds = Number(process.env.JWT_SALT_ROUNDS) || 10;
	const password = await bcrypt.hash(DEMO_CREDENTIAL, rounds);

	await Promise.all([User.deleteMany({}), Company.deleteMany({}), Experience.deleteMany({}), Otp.deleteMany({})]);

	const savedCompanies = await Company.insertMany(companies);
	const idByName = new Map(savedCompanies.map((c) => [c.name, String(c._id)]));

	await User.insertMany(
		users.map((u) => ({
			...u,
			password,
			placedAt: { ...u.placedAt, companyId: u.placed ? idByName.get(u.placedAt.companyName)! : 'np' }
		}))
	);
	await Experience.insertMany(experiences);

	return {
		users: users.length,
		verifiedUsers: users.filter((u) => u.isVerified).length,
		placedStudents: users.filter((u) => u.placed).length,
		companies: companies.length,
		experiences: experiences.length
	};
};
