// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes.js');
const companyRoutes = require('./routes/companyRoutes.js');
const { authenticateUser } = require('./middleware/authMiddleware.js');
const statsRoutes = require('./routes/statsRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const experienceRoutes = require('./routes/experienceRoutes.js');
const errorHandler = require('./middleware/errorHandler.js');

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_CONNECTION_STRING', 'JWT_SECRET', 'EMAIL_ID', 'EMAIL_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
	console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
	console.error('💡 Please check your .env file and ensure all required variables are set.');
	process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.DB_CONNECTION_STRING;
const localUri = process.env.LOCAL_DB_CONNECTION_STRING;

// MongoDB connection options
const mongoOptions = {
	serverSelectionTimeoutMS: 15000, // 15 seconds
	socketTimeoutMS: 45000, // 45 seconds
	maxPoolSize: 10
};

// Function to connect with retry logic
async function connectDatabase() {
	try {
		console.log('Attempting to connect to MongoDB Atlas...');
		await mongoose.connect(uri, mongoOptions);
		console.log('✅ Database connected successfully to MongoDB Atlas!');
		console.log('Connected to database:', mongoose.connection.name);
	} catch (atlasError) {
		console.error('❌ MongoDB Atlas connection failed:', atlasError.message);

		try {
			console.log('🔄 Trying local MongoDB fallback...');
			await mongoose.connect(localUri, mongoOptions);
			console.log('✅ Connected to local MongoDB!');
			console.log('Connected to database:', mongoose.connection.name);
		} catch (localError) {
			console.error('❌ Local MongoDB connection also failed:', localError.message);
			console.error('💡 Please ensure MongoDB is running or check your Atlas connection string');

			// Don't exit immediately, let the app try to continue
			console.log('⚠️  Server starting without database connection...');
		}
	}
}

// Connect to database
connectDatabase();

// Handle connection events
mongoose.connection.on('error', (err) => {
	console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
	console.log('MongoDB disconnected');
	// Attempt to reconnect after 5 seconds
	setTimeout(connectDatabase, 5000);
});

mongoose.connection.on('reconnected', () => {
	console.log('MongoDB reconnected');
});

app.use(express.json());
app.use(cors());

// Security middleware
const helmet = require('helmet');
app.use(helmet());

// Middleware to hide version information
app.disable('x-powered-by');

// Use the authRoutes only once
app.use('/auth', authRoutes);

// Use the companyRoutes only once
app.use('/companies', companyRoutes);

// Use the statsRoutes only once
app.use('/stats', statsRoutes);

// Use the userRoutes only once
app.use('/users', userRoutes);

// Use the experienceRoutes only once
app.use('/experiences', experienceRoutes);

app.get('/token-check', authenticateUser, (req, res) => {
	try {
		res.status(200).json({ isAuthenticated: true });
	} catch (error) {
		console.error('Token check error:', error.message);
		res.status(401).json({ isAuthenticated: false, error: 'Authentication failed' });
	}
});

// Global error handler - MUST BE LAST
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
