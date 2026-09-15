import { Router } from 'express';
import { VisitorController } from './visitor.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', authenticateAdmin, VisitorController.getDashboardStats);
router.post('/visit', VisitorController.trackVisitor);
router.post('/reset', authenticateAdmin, VisitorController.resetVisitors);

export default router;
