import { Router } from 'express';
import { TestimonialController } from './testimonial.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new TestimonialController();

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', authenticateAdmin, controller.create.bind(controller));
router.patch('/:id', authenticateAdmin, controller.update.bind(controller));
router.delete('/:id', authenticateAdmin, controller.delete.bind(controller));

export const testimonialRoutes = router;
