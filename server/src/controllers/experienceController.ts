import { Request, Response } from 'express';
import Experience from '../models/Experience';
import logger from '../utils/logger';

const validateFields = (experience: any): string[] => {
	const errorMessages: string[] = [];
	if (!experience.companyName) errorMessages.push('Company Name is required.');
	if (!experience.content) errorMessages.push("Content Can't be Empty.");
	return errorMessages;
};

export const postAddExperience = async (req: Request, res: Response): Promise<void> => {
	try {
		const errorMessages = validateFields(req.body);
		if (errorMessages.length > 0) {
			res.status(400).json({ errors: errorMessages });
			return;
		}
		const user = (req as any).user;
		const newExperience = {
			companyName: req.body.companyName,
			studentDetails: {
				rollNo: user.rollNo,
				name: user.name,
				batch: user.batch
			},
			content: req.body.content,
			Comments: [],
			tags: [req.body.companyName, user.batch]
		};
		const experience = new Experience(newExperience);
		const savedExperience = await experience.save();
		logger.info(`New experience added: ${experience.companyName}`);
		res.status(201).json({ savedExperience, message: 'Experience Added Successfully' });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const getAllExperience = async (_req: Request, res: Response): Promise<void> => {
	try {
		const experiences = await Experience.find().sort({ createdAt: -1 });
		res.status(200).json({ experiences });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const getExperienceByTag = async (req: Request, res: Response): Promise<void> => {
	try {
		const experiences = await Experience.find({ tags: req.params.tag }).sort({ createdAt: -1 });
		res.status(200).json({ experiences });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const getExperienceByUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const experiences = await Experience.find({ 'studentDetails.studentId': req.params.userId }).sort({ createdAt: -1 });
		res.status(200).json({ experiences });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const postAddComment = async (req: Request, res: Response): Promise<void> => {
	try {
		const experience = await Experience.findById(req.params.id);
		if (!experience) {
			res.status(404).json({ errors: ['Experience not found'] });
			return;
		}
		experience.Comments.push(req.body.comment);
		const savedExperience = await experience.save();
		logger.info(`New comment added to experience: ${experience.companyName}`);
		res.status(200).json({ savedExperience, message: 'Comment Added Successfully' });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const updateExperience = async (req: Request, res: Response): Promise<void> => {
	try {
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
		const user = (req as any).user;
		if (experience.studentDetails.rollNo !== user.rollNo) {
			res.status(403).json({ errors: ['Forbidden'] });
			return;
		}
		experience.companyName = req.body.companyName;
		experience.content = req.body.content;
		experience.tags = [req.body.companyName, user.batch];
		const savedExperience = await experience.save();
		logger.info(`Experience updated: ${savedExperience.companyName}`);
		res.status(200).json({ savedExperience, message: 'Experience Updated Successfully' });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
	try {
		const experience = await Experience.findById(req.params.id);
		if (!experience) {
			res.status(404).json({ errors: ['Experience not found'] });
			return;
		}

		const user = (req as any).user;
		if (experience.studentDetails.rollNo !== user.rollNo) {
			res.status(403).json({ errors: ['Forbidden'] });
			return;
		}

		await Experience.findByIdAndDelete(req.params.id);
		logger.info(`Experience deleted: ${experience.companyName}`);
		res.status(200).json({ message: 'Experience Deleted Successfully' });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
	try {
		const experience = await Experience.findById(req.params.id);
		if (!experience) {
			res.status(404).json({ errors: ['Experience not found'] });
			return;
		}
		const commentId = Number.parseInt(String(req.params.commentId), 10);
		experience.Comments = experience.Comments.filter(
			(_comment: string, index: number) => index !== commentId
		);
		const savedExperience = await experience.save();
		logger.info(`Comment deleted from experience: ${experience.companyName}`);
		res.status(200).json({ savedExperience, message: 'Comment Deleted Successfully' });
	} catch (error: any) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};
