const Experience = require('../models/Experience');
const logger = require('../utils/logger');
const asyncHandler = require('../middleware/asyncHandler');

const validateFields = (experience) => {
	const errorMessages = [];
	if (!experience.companyName) errorMessages.push('Company Name is required.');
	if (!experience.content) errorMessages.push("Content Can't be Empty.");
	return errorMessages;
};

// Add Experience
exports.postAddExperience = asyncHandler(async (req, res) => {
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
		tags: [req.body.companyName, req.user.batch]
	};
	const experience = new Experience(newExperience);
	const savedExperience = await experience.save();
	logger.info(`New experience added: ${experience.companyName}`);
	res.status(200).json({ savedExperience, message: 'Experience Added Successfully' });
});

// Get All Experience
exports.getAllExperience = asyncHandler(async (req, res) => {
	const experiences = await Experience.find().sort({ createdAt: -1 });
	res.status(200).json({ experiences });
});

// Get Experience By Tag
exports.getExperienceByTag = asyncHandler(async (req, res) => {
	const experiences = await Experience.find({ tags: req.params.tag }).sort({ createdAt: -1 });
	res.status(200).json({ experiences });
});

// Get Experience By User
exports.getExperienceByUser = asyncHandler(async (req, res) => {
	const experiences = await Experience.find({ 'studentDetails.studentId': req.params.userId }).sort({ createdAt: -1 });
	res.status(200).json({ experiences });
});

// Add Comment
exports.postAddComment = asyncHandler(async (req, res) => {
	const experience = await Experience.findById(req.params.id);
	if (!experience) {
		return res.status(404).json({ errors: ['Experience not found'] });
	}
	experience.Comments.push(req.body.comment);
	const savedExperience = await experience.save();
	logger.info(`New comment added to experience: ${experience.companyName}`);
	res.status(200).json({ savedExperience, message: 'Comment Added Successfully' });
});

// Update Experience
exports.updateExperience = asyncHandler(async (req, res) => {
	const errorMessages = validateFields(req.body);
	if (errorMessages.length > 0) {
		return res.status(400).json({ errors: errorMessages });
	}
	const experience = await Experience.findById(req.params.id);
	if (!experience) {
		return res.status(404).json({ errors: ['Experience not found'] });
	}
	if (experience.studentDetails.rollNo !== req.user.rollNo) {
		return res.status(403).json({ errors: ['Forbidden'] });
	}
	experience.companyName = req.body.companyName;
	experience.content = req.body.content;
	experience.tags = [req.body.companyName, req.user.batch];
	const savedExperience = await experience.save();
	logger.info(`Experience updated: ${savedExperience.companyName}`);
	res.status(200).json({ savedExperience, message: 'Experience Updated Successfully' });
});

// Delete Experience
exports.deleteExperience = asyncHandler(async (req, res) => {
	const experience = await Experience.findByIdAndDelete(req.params.id);
	if (!experience) {
		return res.status(404).json({ errors: ['Experience not found'] });
	}

	if (experience.studentDetails.rollNo !== req.user.rollNo) {
		return res.status(403).json({ errors: ['Forbidden'] });
	}

	logger.info(`Experience deleted: ${experience.companyName}`);
	res.status(200).json({ message: 'Experience Deleted Successfully' });
});

// Delete Comment
exports.deleteComment = asyncHandler(async (req, res) => {
	const experience = await Experience.findById(req.params.id);
	if (!experience) {
		return res.status(404).json({ errors: ['Experience not found'] });
	}
	experience.Comments = experience.Comments.filter((comment, index) => index !== req.params.commentIndex);
	const savedExperience = await experience.save();
	logger.info(`Comment deleted from experience: ${experience.companyName}`);
	res.status(200).json({ savedExperience, message: 'Comment Deleted Successfully' });
});
