// routes/companies.js
const express = require('express');
const router = express.Router();
const { authenticateUser, checkUserRole } = require('../middleware/authMiddleware');
const companyController = require('../controllers/companyController');

// Add Company
router.post(
  '/add',
  authenticateUser,
  checkUserRole(['admin', 'placementCoordinator']),
  companyController.postAddCompany,
);

// Update Company
router.put(
  '/update/:id',
  authenticateUser,
  checkUserRole(['admin', 'placementCoordinator']),
  companyController.putUpdateCompany,
);

// Delete Company
router.delete(
  '/delete/:id',
  authenticateUser,
  checkUserRole(['admin', 'placementCoordinator']),
  companyController.deleteCompany,
);

// View All Companies
router.get(
  '/view',
  authenticateUser,
  checkUserRole(['admin', 'placementCoordinator', 'student']),
  companyController.getViewCompany,
);

// View Company by ID
router.get(
  '/view/:id',
  authenticateUser,
  checkUserRole(['admin', 'placementCoordinator', 'student']),
  companyController.getViewCompanyById,
);

module.exports = router;
