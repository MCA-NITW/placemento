const Experience = require('../models/Experience');
const logger = require('../utils/logger');

const validateFields = (experience) => {
	const errorMessages = [];
	if (!experience.companyName) errorMessages.push('Company Name is required.');
	if (!experience.content) errorMessages.push("Content Can't be Empty.");
	return errorMessages;
};

// Add Experience
exports.postAddExperience = async (req, res) => {
	try {
		const errorMessages = validateFields(req.body);
		if (errorMessages.length > 0) {
			return res.status(400).json({ errors: errorMessages });
		}
		const newExperience = {
			companyName: req.body.companyName,
			studentDetails: {
				rollNo: req.user.rollNo,
				name: req.user.name,
				batch: req.user.batch
			},
			content: req.body.content,
			Comments: [],
			postDate: new Date(),
			editDate: new Date(),
			tags: [req.body.companyName, req.user.batch]
		};
		const experience = new Experience(newExperience);
		const savedExperience = await experience.save();
		logger.info(`New experience added: ${experience.companyName}`);
		res.status(200).json({ savedExperience, message: 'Experience Added Successfully' });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

// Get All Experience
exports.getAllExperience = async (req, res) => {
	try {
		const experiences = await Experience.find().sort({ postDate: -1 });
		res.status(200).json({ experiences });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

// Get Experience By Tag
exports.getExperienceByTag = async (req, res) => {
	try {
		const experiences = await Experience.find({ tags: req.params.tag }).sort({ postDate: -1 });
		res.status(200).json({ experiences });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

// Get Experience By User
exports.getExperienceByUser = async (req, res) => {
	try {
		const experiences = await Experience.find({ 'studentDetails.studentId': req.params.userId }).sort({ postDate: -1 });
		res.status(200).json({ experiences });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

// Add Comment
exports.postAddComment = async (req, res) => {
	try {
		const experience = await Experience.findById(req.params.id);
		if (!experience) {
			return res.status(404).json({ errors: ['Experience not found'] });
		}
		experience.Comments.push(req.body.comment);
		const savedExperience = await experience.save();
		logger.info(`New comment added to experience: ${experience.companyName}`);
		res.status(200).json({ savedExperience, message: 'Comment Added Successfully' });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

// Update Experience
exports.updateExperience = async (req, res) => {
	try {
		const errorMessages = validateFields(req.body);
		if (errorMessages.length > 0) {
			return res.status(400).json({ errors: errorMessages });
		}
		const experience = await Experience.findById(req.params.id);
		if (!experience) {
			return res.status(404).json({ errors: ['Experience not found'] });
		}
		experience.companyName = req.body.companyName;
		experience.content = req.body.content;
		experience.editDate = new Date();
		experience.tags = [req.body.companyName, req.user.batch];
		const savedExperience = await experience.save();
		logger.info(`Experience updated: ${savedExperience.companyName}`);
		res.status(200).json({ savedExperience, message: 'Experience Updated Successfully' });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

// Delete Experience
exports.deleteExperience = async (req, res) => {
	try {
		const experience = await Experience.findByIdAndDelete(req.params.id);
		if (!experience) {
			return res.status(404).json({ errors: ['Experience not found'] });
		}
		logger.info(`Experience deleted: ${experience.companyName}`);
		res.status(200).json({ message: 'Experience Deleted Successfully' });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

// Delete Comment
exports.deleteComment = async (req, res) => {
	try {
		const experience = await Experience.findById(req.params.id);
		if (!experience) {
			return res.status(404).json({ errors: ['Experience not found'] });
		}
		experience.Comments = experience.Comments.filter((comment, index) => index !== req.params.commentIndex);
		const savedExperience = await experience.save();
		logger.info(`Comment deleted from experience: ${experience.companyName}`);
		res.status(200).json({ savedExperience, message: 'Comment Deleted Successfully' });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};
