const express = require('express');
const router = express.Router();
const { authenticateUser, checkUserRole } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const limiter = require('../utils/limiter');

// View all users without rate limiting
router.get('/view', authenticateUser, checkUserRole(['student', 'admin', 'placementCoordinator']), userController.viewAllUsers);

// View a single user by ID with rate limiting
router.get('/view/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), userController.viewSingleUser);

// Update a User with rate limiting
router.put('/update/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), limiter, userController.updateUser);

// Update Verification Status of a User with rate limiting
router.put('/verify/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), limiter, userController.verify);

// Update Role of a User with rate limiting
router.put('/role/:id', authenticateUser, checkUserRole(['admin']), limiter, userController.updateRole);

// Delete a User with rate limiting
router.delete('/delete/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), limiter, userController.deleteUser);

module.exports = router;
