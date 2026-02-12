import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { authenticateUser } from './middleware/authMiddleware';
import authRoutes from './routes/authRoutes';
import companyRoutes from './routes/companyRoutes';
import experienceRoutes from './routes/experienceRoutes';
import statsRoutes from './routes/statsRoutes';
import userRoutes from './routes/userRoutes';
import logger from './utils/logger';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
		credentials: true
	})
);

app.use('/auth', authRoutes);
app.use('/companies', companyRoutes);
app.use('/stats', statsRoutes);
app.use('/users', userRoutes);
app.use('/experiences', experienceRoutes);

app.get('/token-check', authenticateUser, (_req: Request, res: Response) => {
	try {
		res.status(200).json({ isAuthenticated: true });
	} catch {
		res.status(401).json({ isAuthenticated: false });
	}
});

// 404 handler
app.use((_req: Request, res: Response) => {
	res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	logger.error(err.stack || err.message);
	res.status(500).json({ message: 'Internal server error' });
});

export default app;
