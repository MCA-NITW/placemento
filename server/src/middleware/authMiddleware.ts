import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { UserRole } from '../types';
import logger from '../utils/logger';

interface JwtPayload {
	id: string;
	role: UserRole;
	exp: number;
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const token = req.headers['authorization']?.split(' ')[1];

		if (!token) throw new Error('Invalid or missing Authorization header');
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

		if (decoded.exp * 1000 < Date.now()) throw new Error('Token has expired');

		const user = await User.findOne({ _id: decoded.id });

		if (!user) throw new Error('User not found');
		if (user.isVerified === false) throw new Error('User not verified');

		(req as any).token = token;
		(req as any).user = user;
		logger.info(`User ${user.email} authenticated`);
		next();
	} catch (error: any) {
		logger.error(error.message);
		if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
			res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
		} else {
			res.status(401).json({ message: 'Unauthorized' });
		}
	}
};

export const checkUserRole = (allowedRoles: UserRole[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		try {
			const userRole = (req as any).user.role;

			logger.info(`User ${(req as any).user.email} has role ${userRole}`);

			if (allowedRoles.includes(userRole)) {
				logger.info(`User ${(req as any).user.email} authorized`);
				next();
			} else {
				logger.info(`User ${(req as any).user.email} forbidden`);
				res.status(403).json({ message: 'Forbidden' });
			}
		} catch (error: any) {
			logger.error(error.message);
			res.status(500).json({ message: 'Internal server error' });
		}
	};
};
