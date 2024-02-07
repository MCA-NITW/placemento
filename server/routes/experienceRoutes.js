const express = require('express');
const router = express.Router();
const { authenticateUser, checkUserRole } = require('../middleware/authMiddleware');
const limiter = require('../utils/limiter');
const experienceController = require('../controllers/experienceController');

// Add Experience
router.post('/add', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), limiter, experienceController.postAddExperience);

// Get All Experience
router.get('/view', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), experienceController.getAllExperience);

// Get Experience By Tag
router.get('/view/:tag', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), experienceController.getExperienceByTag);

// Get Experience By User
router.get('/user/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), experienceController.getExperienceByUser);

// Add Comment
router.post(
	'/comment/add',
	authenticateUser,
	checkUserRole(['admin', 'placementCoordinator', 'student']),
	limiter,
	experienceController.postAddComment
);

// Update Experience
router.put(
	'/update/:id',
	authenticateUser,
	checkUserRole(['admin', 'placementCoordinator', 'student']),
	limiter,
	experienceController.updateExperience
);

// Delete Experience
router.delete('/delete/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), experienceController.deleteExperience);

// Delete Comment
router.delete(
	'/comment/delete/:id/:commentId',
	authenticateUser,
	checkUserRole(['admin', 'placementCoordinator', 'student']),
	experienceController.deleteComment
);

module.exports = router;
