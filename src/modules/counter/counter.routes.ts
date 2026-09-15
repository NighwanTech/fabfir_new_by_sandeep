import { Router } from 'express';
import * as counterController from './counter.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Counters
 *   description: Counter management endpoints
 */

/**
 * @swagger
 * /api/counters:
 *   post:
 *     summary: Create a new counter
 *     tags: [Counters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - value
 *             properties:
 *               label:
 *                 type: string
 *               value:
 *                 type: string
 *               suffix:
 *                 type: string
 *               icon:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, ACTIVE, INACTIVE]
 *               displayOrder:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Counter created successfully
 */
router.post('/', authenticateAdmin, counterController.createCounter);

/**
 * @swagger
 * /api/counters:
 *   get:
 *     summary: Get all counters
 *     tags: [Counters]
 *     responses:
 *       200:
 *         description: List of counters
 */
router.get('/', counterController.getAllCounters);

/**
 * @swagger
 * /api/counters/{id}:
 *   get:
 *     summary: Get counter by ID
 *     tags: [Counters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Counter details
 *       404:
 *         description: Counter not found
 */
router.get('/:id', counterController.getCounterById);

/**
 * @swagger
 * /api/counters/{id}:
 *   put:
 *     summary: Update a counter
 *     tags: [Counters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               value:
 *                 type: string
 *               suffix:
 *                 type: string
 *               icon:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, ACTIVE, INACTIVE]
 *               displayOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Counter updated successfully
 *       404:
 *         description: Counter not found
 */
router.put('/:id', authenticateAdmin, counterController.updateCounter);

/**
 * @swagger
 * /api/counters/{id}:
 *   delete:
 *     summary: Delete a counter (soft delete)
 *     tags: [Counters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Counter deleted successfully
 *       404:
 *         description: Counter not found
 */

/**
 * @swagger
 * /api/counters/bulk-delete:
 *   post:
 *     summary: Bulk delete counters
 *     tags: [Counters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Counter deleted successfully
 *       400:
 *         description: Bad request
 */
router.post('/bulk-delete', authenticateAdmin, counterController.bulkDelete);
router.delete('/:id', authenticateAdmin, counterController.deleteCounter);

export default router;
