import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll } from 'vitest';

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
	// Set test environment variables
	process.env.NODE_ENV = 'test';
	process.env.JWT_SECRET = 'test-jwt-secret';
	process.env.JWT_SALT_ROUNDS = '4';
	process.env.CORS_ORIGIN = 'http://localhost:3000';

	// Use replica set to support transactions
	mongoServer = await MongoMemoryReplSet.create({
		replSet: { count: 1 },
		binary: { version: '7.0.0' }
	});
	const mongoUri = mongoServer.getUri();

	// Disconnect any existing connection first
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	await mongoose.connect(mongoUri);
});

afterEach(async () => {
	// Clear all collections between tests
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		await collections[key].deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});
