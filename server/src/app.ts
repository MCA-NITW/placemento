import cors from 'cors';
import express, { type Express, type Router, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { authenticateUser } from './middleware/authMiddleware';
import authRoutes from './routes/authRoutes';
import companyRoutes from './routes/companyRoutes';
import experienceRoutes from './routes/experienceRoutes';
import statsRoutes from './routes/statsRoutes';
import userRoutes from './routes/userRoutes';
import logger from './utils/logger';

const app: Express = express();

// Security
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
		credentials: true
	})
);

// Health check (no auth required)
app.get('/health', (_req: Request, res: Response) => {
	const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
	res.status(200).json({
		status: 'ok',
		uptime: Math.floor(process.uptime()),
		database: dbState[mongoose.connection.readyState] || 'unknown',
		timestamp: new Date().toISOString()
	});
});

// API v1 routes
const v1: Router = express.Router();
v1.use('/auth', authRoutes);
v1.use('/companies', companyRoutes);
v1.use('/stats', statsRoutes);
v1.use('/users', userRoutes);
v1.use('/experiences', experienceRoutes);
v1.get('/token-check', authenticateUser, (_req: Request, res: Response) => {
	res.status(200).json({ isAuthenticated: true });
});

app.use('/api/v1', v1);

// Backward-compatible routes (mirror to v1) — can be removed once client is updated
app.use('/auth', authRoutes);
app.use('/companies', companyRoutes);
app.use('/stats', statsRoutes);
app.use('/users', userRoutes);
app.use('/experiences', experienceRoutes);
app.get('/token-check', authenticateUser, (_req: Request, res: Response) => {
	res.status(200).json({ isAuthenticated: true });
});

// 404
app.use((_req: Request, res: Response) => {
	res.status(404).json({ errors: ['Route not found'] });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	logger.error(err.stack || err.message);
	res.status(500).json({ errors: ['Internal server error'] });
});

export default app;
