import { Router } from 'express';
import { ProgramHighlightController } from './program-highlight.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Program Highlights
 *   description: Program Highlights management endpoints
 */

/**
 * @swagger
 * /api/program-highlights:
 *   post:
 *     summary: Create a new program highlight
 *     tags: [Program Highlights]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               icon: { type: string }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *               displayOrder: { type: number }
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/', authenticateAdmin, ProgramHighlightController.createHighlight);

/**
 * @swagger
 * /api/program-highlights:
 *   get:
 *     summary: Get all program highlights
 *     tags: [Program Highlights]
 *     responses:
 *       200:
 *         description: List of program highlights
 */
router.get('/', ProgramHighlightController.getAllHighlights);

/**
 * @swagger
 * /api/program-highlights/{id}:
 *   get:
 *     summary: Get program highlight by ID
 *     tags: [Program Highlights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Program highlight details
 */
router.get('/:id', ProgramHighlightController.getHighlightById);

/**
 * @swagger
 * /api/program-highlights/{id}:
 *   patch:
 *     summary: Update a program highlight
 *     tags: [Program Highlights]
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
 *               title: { type: string }
 *               description: { type: string }
 *               icon: { type: string }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *               displayOrder: { type: number }
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.patch('/:id', authenticateAdmin, ProgramHighlightController.updateHighlight);

/**
 * @swagger
 * /api/program-highlights/{id}:
 *   delete:
 *     summary: Soft delete program highlight
 *     tags: [Program Highlights]
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
router.delete('/:id', authenticateAdmin, ProgramHighlightController.deleteHighlight);

export default router;
