import { Router } from 'express';
import { MembershipPlanController } from './membership-plan.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new MembershipPlanController();

// --- PLANS ---
router.post('/', authenticateAdmin, controller.createPlan.bind(controller));
router.get('/', controller.getPlans.bind(controller));
router.get('/:id', controller.getPlanById.bind(controller));
router.patch('/:id', authenticateAdmin, controller.updatePlan.bind(controller));
router.delete('/:id', authenticateAdmin, controller.deletePlan.bind(controller));

router.get('/:planId/features', controller.getFeatures.bind(controller));
router.post('/:planId/features', authenticateAdmin, controller.createFeature.bind(controller));
router.patch('/:planId/features/:featureId', authenticateAdmin, controller.updateFeature.bind(controller));
router.delete('/:planId/features/:featureId', authenticateAdmin, controller.deleteFeature.bind(controller));

export const membershipPlanRoutes = router;
