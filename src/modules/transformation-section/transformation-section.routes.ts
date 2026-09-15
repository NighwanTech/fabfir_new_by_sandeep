import { Router } from 'express';
import { getSections, getSectionById, createSection, updateSection, deleteSection } from './transformation-section.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Transformation Section
 *   description: Transformation Section management API
 */

/**
 * @swagger
 * /api/transformation-section:
 *   get:
 *     summary: Get transformation sections
 *     tags: [Transformation Section]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getSections);

/**
 * @swagger
 * /api/transformation-section/{id}:
 *   get:
 *     summary: Get section by ID
 *     tags: [Transformation Section]
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
router.get('/:id', getSectionById);

/**
 * @swagger
 * /api/transformation-section:
 *   post:
 *     summary: Create new transformation section
 *     tags: [Transformation Section]
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticateAdmin, createSection);

/**
 * @swagger
 * /api/transformation-section/{id}:
 *   patch:
 *     summary: Update transformation section
 *     tags: [Transformation Section]
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
router.patch('/:id', authenticateAdmin, updateSection);

/**
 * @swagger
 * /api/transformation-section/{id}:
 *   delete:
 *     summary: Delete transformation section
 *     tags: [Transformation Section]
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
router.delete('/:id', authenticateAdmin, deleteSection);

export default router;
