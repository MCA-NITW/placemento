import express, { type Router } from 'express';
import * as statsController from '../controllers/statsController';
import { authenticateUser } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/dashboard', authenticateUser, statsController.getDashboard);
router.get('/ctc', authenticateUser, statsController.getCTCStats);
router.get('/company', authenticateUser, statsController.getCompanyStats);
router.get('/student', authenticateUser, statsController.getStudentStats);

export default router;
