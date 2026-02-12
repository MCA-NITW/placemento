import express from 'express';
import * as experienceController from '../controllers/experienceController';
import { authenticateUser, checkUserRole } from '../middleware/authMiddleware';
import limiter from '../utils/limiter';

const router = express.Router();

router.post('/add', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), limiter, experienceController.postAddExperience);
router.get('/view', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), experienceController.getAllExperience);
router.get('/view/:tag', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), experienceController.getExperienceByTag);
router.get('/user/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), experienceController.getExperienceByUser);
router.post('/comment/add/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), limiter, experienceController.postAddComment);
router.put('/update/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), limiter, experienceController.updateExperience);
router.delete('/delete/:id', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), experienceController.deleteExperience);
router.delete('/comment/delete/:id/:commentId', authenticateUser, checkUserRole(['admin', 'placementCoordinator', 'student']), experienceController.deleteComment);

export default router;
