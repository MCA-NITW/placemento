import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import logger from './utils/logger';

dotenv.config();

// Validate required environment variables at startup
const required = ['DB_CONNECTION_STRING', 'JWT_SECRET', 'JWT_SALT_ROUNDS'];
for (const key of required) {
	if (!process.env[key]) {
		logger.error(`Missing required environment variable: ${key}`);
		process.exit(1);
	}
}

const PORT = process.env.PORT || 5000;

const uri = process.env.DB_CONNECTION_STRING!;
const localUri = process.env.LOCAL_DB_CONNECTION_STRING || 'mongodb://localhost:27017/mca-placement';

const mongoOptions = {
	serverSelectionTimeoutMS: 15000,
	socketTimeoutMS: 45000,
	maxPoolSize: 10
};

async function connectDatabase(): Promise<void> {
	try {
		logger.info('Attempting to connect to MongoDB Atlas...');
		await mongoose.connect(uri, mongoOptions);
		logger.info('Database connected successfully to MongoDB Atlas!');
		logger.info(`Connected to database: ${mongoose.connection.name}`);
	} catch (atlasError: any) {
		logger.error(`MongoDB Atlas connection failed: ${atlasError.message}`);

		try {
			logger.info('Trying local MongoDB fallback...');
			await mongoose.connect(localUri, mongoOptions);
			logger.info('Connected to local MongoDB!');
			logger.info(`Connected to database: ${mongoose.connection.name}`);
		} catch (localError: any) {
			logger.error(`Local MongoDB connection also failed: ${localError.message}`);
			logger.warn('Server starting without database connection...');
		}
	}
}

connectDatabase();

mongoose.connection.on('error', (err) => {
	logger.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
	logger.info('MongoDB disconnected');
	setTimeout(connectDatabase, 5000);
});

mongoose.connection.on('reconnected', () => {
	logger.info('MongoDB reconnected');
});

app.listen(PORT, () => {
	logger.info(`Server is running on port ${PORT}`);
});

export default app;
