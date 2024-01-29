const express = require('express');
const router = express.Router();
const { authenticateUser, checkUserRole } = require('../middleware/authMiddleware');
const companyController = require('../controllers/companyController');
const limiter = require('../utils/limiter');

// Add Company
router.post(
	'/add',
	authenticateUser,
	checkUserRole(['admin', 'placementCoordinator']),
	limiter,
	companyController.postAddCompany
);

// Update Company with rate limiting
router.put(
	'/update/:id',
	authenticateUser,
	checkUserRole(['admin', 'placementCoordinator']),
	limiter,
	companyController.putUpdateCompany
);

// Delete Company with rate limiting
router.delete(
	'/delete/:id',
	authenticateUser,
	checkUserRole(['admin', 'placementCoordinator']),
	limiter,
	companyController.deleteCompany
);

// View All Companies without rate limiting
router.get(
	'/view',
	authenticateUser,
	checkUserRole(['admin', 'placementCoordinator', 'student']),
	companyController.getViewCompany
);

// View Company by ID without rate limiting
router.get(
	'/view/:id',
	authenticateUser,
	checkUserRole(['admin', 'placementCoordinator', 'student']),
	companyController.getViewCompanyById
);

module.exports = router;
