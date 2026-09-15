import { Router } from 'express';
import {
  getServices,
  getServiceByIdOrSlug,
  createService,
  updateService,
  deleteService
} from './service.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all Services or active ones (public=true)
 *     tags: [Service]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get Service by ID or Slug
 *     tags: [Service]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', getServiceByIdOrSlug);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new Service
 *     tags: [Service]
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/', authenticateAdmin, createService);

/**
 * @swagger
 * /api/services/{id}:
 *   patch:
 *     summary: Update an existing Service
 *     tags: [Service]
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.patch('/:id', authenticateAdmin, updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Soft delete a Service
 *     tags: [Service]
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete('/:id', authenticateAdmin, deleteService);

export default router;
