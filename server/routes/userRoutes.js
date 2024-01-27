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

// Update Verification Status of a User
router.put('/verify/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), userController.verify);

// Update Role of a User
router.put('/role/:id', authenticateUser, checkUserRole(['admin']), userController.updateRole);

module.exports = router;
