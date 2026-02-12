import express from 'express';
import * as companyController from '../controllers/companyController';
import { authenticateUser, checkUserRole } from '../middleware/authMiddleware';
import limiter from '../utils/limiter';

const router = express.Router();

router.post('/add', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), limiter, companyController.postAddCompany);
router.put('/update/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), limiter, companyController.putUpdateCompany);
router.delete('/delete/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), limiter, companyController.deleteCompany);
router.get('/view', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), companyController.getViewCompany);
router.get('/view/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), companyController.getViewCompanyById);

export default router;
