import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IAcademicField {
	cgpa: number;
	percentage: number;
}

export interface IPlacedAt {
	companyId: string;
	companyName: string;
	ctc: number;
	ctcBase: number;
	profile: string;
	profileType: string;
	offer: string;
	location: string;
	bond: number;
}

export interface IUser extends Document {
	_id: Types.ObjectId;
	name: string;
	email: string;
	password: string;
	rollNo: string;
	batch: number;
	role: 'student' | 'placementCoordinator' | 'admin';
	isVerified: boolean;
	pg: IAcademicField;
	ug: IAcademicField;
	hsc: IAcademicField;
	ssc: IAcademicField;
	backlogs: number;
	totalGapInAcademics: number;
	placed: boolean;
	placedAt: IPlacedAt & { toObject: () => IPlacedAt };
	createdAt: Date;
	updatedAt: Date;
}

export interface ICutoffs {
	pg: IAcademicField;
	ug: IAcademicField;
	twelth: IAcademicField;
	tenth: IAcademicField;
}

export interface ICtcBreakup {
	base: number;
	other: number;
}

export interface ICompany extends Document {
	_id: Types.ObjectId;
	name: string;
	status: 'ongoing' | 'upcoming' | 'completed' | 'cancelled';
	interviewShortlist: number;
	selected: number;
	selectedStudentsRollNo: string[];
	dateOfOffer: Date;
	locations: string[];
	cutoffs: ICutoffs;
	typeOfOffer: 'PPO' | 'FTE' | '6M+FTE' | 'Intern';
	profile: string;
	profileCategory: 'Software' | 'Analyst' | 'Others';
	ctc: number;
	ctcBreakup: ICtcBreakup;
	bond: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface IExperience extends Document {
	_id: Types.ObjectId;
	companyName: string;
	studentDetails: {
		rollNo: string;
		name: string;
		batch: number;
	};
	content: string;
	Comments: string[];
	tags: string[];
	rating: number;
	interviewProcess: string;
	tips: string;
	difficulty: 'Easy' | 'Medium' | 'Hard';
	likes: number;
	likedBy: string[];
	isVerified: boolean;
	helpfulCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface IOtp extends Document {
	_id: Types.ObjectId;
	email: string;
	otp: string;
	createdAt: Date;
}

export interface AuthenticatedRequest extends Request {
	user: {
		id: string;
		role: 'student' | 'placementCoordinator' | 'admin';
		rollNo: string;
		name: string;
		batch: number;
	};
}

export type UserRole = 'student' | 'placementCoordinator' | 'admin';
