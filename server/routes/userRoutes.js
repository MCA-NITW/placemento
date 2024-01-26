const express = require('express');
const router = express.Router();
const { authenticateUser, checkUserRole } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// View all users
router.get('/view', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), userController.viewAllUsers);

// View a single user by ID
router.get(
	'/view/:id',
	authenticateUser,
	checkUserRole(['admin', 'placementCoordinator']),
	userController.viewSingleUser,
);

// Update a User
router.put(
	'/update/:id',
	authenticateUser,
	checkUserRole(['admin', 'placementCoordinator']),
	userController.updateUser,
);

module.exports = router;
