import express, { type Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticateUser, checkUserRole } from '../middleware/authMiddleware';
import limiter from '../utils/limiter';

const router: Router = express.Router();

router.get('/view', authenticateUser, checkUserRole(['student', 'admin', 'placementCoordinator']), userController.viewAllUsers);
router.get('/view/:id', authenticateUser, checkUserRole(['student', 'admin', 'placementCoordinator']), userController.viewSingleUser);
router.put('/update/:id', authenticateUser, checkUserRole(['student', 'admin', 'placementCoordinator']), limiter, userController.updateUser);
router.put('/verify/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), limiter, userController.verify);
router.put('/role/:id', authenticateUser, checkUserRole(['admin']), limiter, userController.updateRole);
router.delete('/delete/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), limiter, userController.deleteUser);
router.put('/company/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator']), limiter, userController.updateCompany);
router.put(
	'/companyLocation/:id',
	authenticateUser,
	checkUserRole(['admin', 'student', 'placementCoordinator']),
	limiter,
	userController.updateCompanyLocation
);
router.put('/change-password', authenticateUser, checkUserRole(['student', 'admin', 'placementCoordinator']), limiter, userController.changePassword);

export default router;
