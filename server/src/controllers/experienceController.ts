import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import Experience from '../models/Experience';
import { type AuthRequest } from '../types';
import logger from '../utils/logger';

const ROLL_NO_REGEX = /^\d{2}MCF1R\d{2,}$/;

const validateFields = (experience: any): string[] => {
	const errors: string[] = [];
	if (!experience.companyName) errors.push('Company name is required.');
	if (!experience.content) errors.push('Content is required.');
	if (experience.rating !== undefined && (experience.rating < 1 || experience.rating > 5)) {
		errors.push('Rating must be between 1 and 5.');
	}
	if (experience.difficulty && !['Easy', 'Medium', 'Hard'].includes(experience.difficulty)) {
		errors.push('Difficulty must be Easy, Medium, or Hard.');
	}
	return errors;
};

export const postAddExperience = async (req: Request, res: Response): Promise<void> => {
	try {
		const errorMessages = validateFields(req.body);
		if (errorMessages.length > 0) {
			res.status(400).json({ errors: errorMessages });
			return;
		}
		const user = (req as unknown as AuthRequest).user;
		const userTags = Array.isArray(req.body.tags) && req.body.tags.length > 0 ? req.body.tags : ['General'];
		const newExperience = {
			companyName: req.body.companyName,
			studentDetails: { rollNo: user.rollNo, name: user.name, batch: user.batch },
			content: req.body.content,
			Comments: [],
			tags: userTags,
			rating: req.body.rating,
			interviewProcess: req.body.interviewProcess,
			tips: req.body.tips,
			difficulty: req.body.difficulty
		};
		const experience = new Experience(newExperience);
		const savedExperience = await experience.save();
		logger.info(`Experience added: ${experience.companyName} by ${user.rollNo}`);
		res.status(201).json({ savedExperience, message: 'Experience added successfully' });
	} catch (error: any) {
		logger.error(`postAddExperience: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const getAllExperience = async (_req: Request, res: Response): Promise<void> => {
	try {
		const experiences = await Experience.find().sort({ createdAt: -1 }).lean();
		res.status(200).json({ experiences });
	} catch (error: any) {
		logger.error(`getAllExperience: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const getExperienceByTag = async (req: Request, res: Response): Promise<void> => {
	try {
		const experiences = await Experience.find({ tags: req.params.tag }).sort({ createdAt: -1 }).lean();
		res.status(200).json({ experiences });
	} catch (error: any) {
		logger.error(`getExperienceByTag: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const getExperienceByUser = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!ROLL_NO_REGEX.test(String(req.params.userId))) {
			res.status(400).json({ errors: ['Invalid roll number format'] });
			return;
		}
		const experiences = await Experience.find({ 'studentDetails.rollNo': req.params.userId }).sort({ createdAt: -1 }).lean();
		res.status(200).json({ experiences });
	} catch (error: any) {
		logger.error(`getExperienceByUser: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const postAddComment = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid experience ID'] });
			return;
		}
		if (!req.body.comment || typeof req.body.comment !== 'string' || !req.body.comment.trim()) {
			res.status(400).json({ errors: ['Comment cannot be empty'] });
			return;
		}
		const experience = await Experience.findById(req.params.id);
		if (!experience) {
			res.status(404).json({ errors: ['Experience not found'] });
			return;
		}
		experience.Comments.push(req.body.comment.trim());
		const savedExperience = await experience.save();
		logger.info(`Comment added to: ${experience.companyName}`);
		res.status(200).json({ savedExperience, message: 'Comment added successfully' });
	} catch (error: any) {
		logger.error(`postAddComment: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const updateExperience = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid experience ID'] });
			return;
		}
		const errorMessages = validateFields(req.body);
		if (errorMessages.length > 0) {
			res.status(400).json({ errors: errorMessages });
			return;
		}
		const experience = await Experience.findById(req.params.id);
		if (!experience) {
			res.status(404).json({ errors: ['Experience not found'] });
			return;
		}
		const user = (req as unknown as AuthRequest).user;
		if (experience.studentDetails.rollNo !== user.rollNo) {
			res.status(403).json({ errors: ['Forbidden: you can only edit your own experiences'] });
			return;
		}
		experience.companyName = req.body.companyName;
		experience.content = req.body.content;
		experience.tags = Array.isArray(req.body.tags) && req.body.tags.length > 0 ? req.body.tags : experience.tags;
		if (req.body.rating !== undefined) experience.rating = req.body.rating;
		if (req.body.interviewProcess !== undefined) experience.interviewProcess = req.body.interviewProcess;
		if (req.body.tips !== undefined) experience.tips = req.body.tips;
		if (req.body.difficulty !== undefined) experience.difficulty = req.body.difficulty;
		const savedExperience = await experience.save();
		logger.info(`Experience updated: ${savedExperience.companyName}`);
		res.status(200).json({ savedExperience, message: 'Experience updated successfully' });
	} catch (error: any) {
		logger.error(`updateExperience: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid experience ID'] });
			return;
		}
		const experience = await Experience.findById(req.params.id);
		if (!experience) {
			res.status(404).json({ errors: ['Experience not found'] });
			return;
		}
		const user = (req as unknown as AuthRequest).user;
		if (experience.studentDetails.rollNo !== user.rollNo) {
			res.status(403).json({ errors: ['Forbidden: you can only delete your own experiences'] });
			return;
		}
		await Experience.findByIdAndDelete(req.params.id);
		logger.info(`Experience deleted: ${experience.companyName}`);
		res.status(200).json({ message: 'Experience deleted successfully' });
	} catch (error: any) {
		logger.error(`deleteExperience: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isValidObjectId(req.params.id)) {
			res.status(400).json({ errors: ['Invalid experience ID'] });
			return;
		}
		const experience = await Experience.findById(req.params.id);
		if (!experience) {
			res.status(404).json({ errors: ['Experience not found'] });
			return;
		}
		const commentIndex = Number.parseInt(String(req.params.commentId), 10);
		if (Number.isNaN(commentIndex) || commentIndex < 0 || commentIndex >= experience.Comments.length) {
			res.status(400).json({ errors: ['Invalid comment index'] });
			return;
		}
		experience.Comments.splice(commentIndex, 1);
		const savedExperience = await experience.save();
		logger.info(`Comment deleted from: ${experience.companyName}`);
		res.status(200).json({ savedExperience, message: 'Comment deleted successfully' });
	} catch (error: any) {
		logger.error(`deleteComment: ${error.message}`);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};
