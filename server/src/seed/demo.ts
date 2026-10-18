// pnpm demo: run the API against a throwaway in-memory MongoDB replica set
// loaded with the demo dataset. No Atlas, Docker, Gmail or .env needed.
// Data lives only as long as the process.
import crypto from 'node:crypto';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from './demoData';
import { seedDatabase } from './seedDatabase';

process.env.JWT_SECRET ||= crypto.randomBytes(32).toString('hex');
process.env.JWT_SALT_ROUNDS ||= '10';

const main = async () => {
	// Replica set, because placement updates run in a transaction
	const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
	await mongoose.connect(replSet.getUri('placemento-demo'));

	const summary = await seedDatabase();

	// Import after env defaults are set
	const { default: app } = await import('../app');
	const port = Number(process.env.PORT) || 5000;
	const server = app.listen(port, () => {
		console.log(`Placemento demo API on http://localhost:${port} (in-memory MongoDB, data resets on exit)`);
		console.log(
			`Seeded ${summary.users} users (${summary.placedStudents} placed), ${summary.companies} companies, ${summary.experiences} experiences`
		);
		console.log(`Demo logins (password ${DEMO_PASSWORD}):`);
		for (const account of DEMO_ACCOUNTS) console.log(`  ${account.role.padEnd(20)} ${account.email}`);
	});

	const shutdown = async () => {
		server.close();
		await mongoose.disconnect();
		await replSet.stop();
		process.exit(0);
	};
	process.on('SIGINT', shutdown);
	process.on('SIGTERM', shutdown);
};

main().catch((error) => {
	console.error(`Demo failed to start: ${error.message}`);
	process.exit(1);
});
