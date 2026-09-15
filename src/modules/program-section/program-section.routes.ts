import { Router } from 'express';
import { ProgramSectionController } from './program-section.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Program Section
 *   description: Program Section content endpoints
 */

/**
 * @swagger
 * /api/program-section:
 *   post:
 *     summary: Create a new program section config
 *     tags: [Program Section]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               badge: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/', authenticateAdmin, ProgramSectionController.createSection);

/**
 * @swagger
 * /api/program-section:
 *   get:
 *     summary: Get all program sections
 *     tags: [Program Section]
 *     responses:
 *       200:
 *         description: List of program sections
 */
router.get('/', ProgramSectionController.getAllSections);

/**
 * @swagger
 * /api/program-section/{id}:
 *   get:
 *     summary: Get program section by ID
 *     tags: [Program Section]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Program section details
 */
router.get('/:id', ProgramSectionController.getSectionById);

/**
 * @swagger
 * /api/program-section/{id}:
 *   patch:
 *     summary: Update a program section
 *     tags: [Program Section]
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
 *               badge: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.patch('/:id', authenticateAdmin, ProgramSectionController.updateSection);

/**
 * @swagger
 * /api/program-section/{id}:
 *   delete:
 *     summary: Soft delete program section
 *     tags: [Program Section]
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
router.delete('/:id', authenticateAdmin, ProgramSectionController.deleteSection);

export default router;
