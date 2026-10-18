// pnpm seed: load the demo dataset into the database from server/.env.
// Refuses to touch a database that already has users unless --reset is passed,
// so it cannot wipe a real batch by accident.
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from './demoData';
import { seedDatabase } from './seedDatabase';

dotenv.config();

const main = async () => {
	const uri = process.env.DB_CONNECTION_STRING || process.env.LOCAL_DB_CONNECTION_STRING || 'mongodb://localhost:27017/placemento';
	const reset = process.argv.includes('--reset');

	await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
	console.log(`Connected to database "${mongoose.connection.name}"`);

	const existing = await User.countDocuments();
	if (existing > 0 && !reset) {
		console.error(`Refusing to seed: "${mongoose.connection.name}" already has ${existing} users. Re-run with --reset to replace all data.`);
		process.exitCode = 1;
		return;
	}

	const summary = await seedDatabase();
	console.log(
		`Seeded ${summary.users} users (${summary.verifiedUsers} verified, ${summary.placedStudents} placed), ${summary.companies} companies, ${summary.experiences} experiences`
	);
	console.log(`Demo logins (password ${DEMO_PASSWORD}):`);
	for (const account of DEMO_ACCOUNTS) console.log(`  ${account.role.padEnd(20)} ${account.email}`);
};

main()
	.catch((error) => {
		console.error(`Seed failed: ${error.message}`);
		process.exitCode = 1;
	})
	.finally(() => mongoose.disconnect());
