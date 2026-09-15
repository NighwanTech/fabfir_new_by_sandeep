import { Router } from 'express';
import {
  getHeadCoaches,
  getHeadCoachById,
  createHeadCoach,
  updateHeadCoach,
  deleteHeadCoach
} from './head-coach.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Head Coach
 *   description: Head Coach management APIs
 */

/**
 * @swagger
 * /api/head-coach:
 *   get:
 *     summary: Get all non-deleted Head Coaches or active one
 *     tags: [Head Coach]
 *     parameters:
 *       - in: query
 *         name: public
 *         schema:
 *           type: boolean
 *         description: Pass true to get only the active head coach
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getHeadCoaches);

/**
 * @swagger
 * /api/head-coach/{id}:
 *   get:
 *     summary: Get Head Coach by ID
 *     tags: [Head Coach]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', getHeadCoachById);

/**
 * @swagger
 * /api/head-coach:
 *   post:
 *     summary: Create a new Head Coach record
 *     tags: [Head Coach]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coachName:
 *                 type: string
 *               label:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               heading:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               badgeText:
 *                 type: string
 *               ctaText:
 *                 type: string
 *               ctaLink:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, ACTIVE, INACTIVE]
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/', authenticateAdmin, createHeadCoach);

/**
 * @swagger
 * /api/head-coach/{id}:
 *   patch:
 *     summary: Update a Head Coach
 *     tags: [Head Coach]
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
 *               coachName:
 *                 type: string
 *               label:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               heading:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               badgeText:
 *                 type: string
 *               ctaText:
 *                 type: string
 *               ctaLink:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.patch('/:id', authenticateAdmin, updateHeadCoach);

/**
 * @swagger
 * /api/head-coach/{id}:
 *   delete:
 *     summary: Soft delete a Head Coach
 *     tags: [Head Coach]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete('/:id', authenticateAdmin, deleteHeadCoach);

export default router;
