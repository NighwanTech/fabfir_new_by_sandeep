import { Router } from 'express';
import { ProgramController } from './program.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Programs
 *   description: Program management endpoints
 */

/**
 * @swagger
 * /api/programs:
 *   post:
 *     summary: Create a new program
 *     tags: [Programs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               shortDescription: { type: string }
 *               image: { type: string }
 *               icon: { type: string }
 *               isFeatured: { type: boolean }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *               displayOrder: { type: number }
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/', authenticateAdmin, ProgramController.createProgram);

/**
 * @swagger
 * /api/programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     responses:
 *       200:
 *         description: List of programs
 */
router.get('/', ProgramController.getAllPrograms);

/**
 * @swagger
 * /api/programs/{id}:
 *   get:
 *     summary: Get program by ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Program details
 */
router.get('/:id', ProgramController.getProgramById);

/**
 * @swagger
 * /api/programs/{id}:
 *   patch:
 *     summary: Update a program
 *     tags: [Programs]
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
 *               shortDescription: { type: string }
 *               image: { type: string }
 *               icon: { type: string }
 *               isFeatured: { type: boolean }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *               displayOrder: { type: number }
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.patch('/:id', authenticateAdmin, ProgramController.updateProgram);

/**
 * @swagger
 * /api/programs/{id}:
 *   delete:
 *     summary: Soft delete program
 *     tags: [Programs]
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
router.delete('/:id', authenticateAdmin, ProgramController.deleteProgram);

export default router;
