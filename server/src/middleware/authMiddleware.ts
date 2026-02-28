import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { type AuthRequest, type UserRole } from '../types';
import logger from '../utils/logger';

interface JwtPayload {
	id: string;
	role: UserRole;
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const token = req.headers['authorization']?.split(' ')[1];
		if (!token) {
			res.status(401).json({ errors: ['Missing authorization token'] });
			return;
		}

		// jwt.verify already checks expiration — no manual check needed
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

		const user = await User.findById(decoded.id);
		if (!user) {
			res.status(401).json({ errors: ['User not found'] });
			return;
		}
		if (!user.isVerified) {
			res.status(401).json({ errors: ['Account not verified. Contact admin.'] });
			return;
		}

		(req as unknown as AuthRequest).token = token;
		(req as unknown as AuthRequest).user = user;
		next();
	} catch (error: any) {
		if (error.name === 'TokenExpiredError') {
			res.status(401).json({ errors: ['Token expired. Please sign in again.'] });
		} else if (error.name === 'JsonWebTokenError') {
			res.status(401).json({ errors: ['Invalid token'] });
		} else {
			logger.error(`Auth error: ${error.message}`);
			res.status(401).json({ errors: ['Unauthorized'] });
		}
	}
};

export const checkUserRole = (allowedRoles: UserRole[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const user = (req as unknown as AuthRequest).user;
		if (allowedRoles.includes(user.role)) {
			next();
		} else {
			logger.warn(`Forbidden: ${user.email} (${user.role}) tried to access ${allowedRoles.join('/')}-only route`);
			res.status(403).json({ errors: ['Forbidden: insufficient permissions'] });
		}
	};
};
