import { Router } from 'express';
import * as transformationController from './transformation.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Transformation Cards
 *   description: Transformation Cards management API (Main & Real Progress)
 */

/**
 * @swagger
 * /api/transformations:
 *   post:
 *     summary: Create a new transformation card
 *     tags: [Transformation Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticateAdmin, transformationController.createTransformation);

/**
 * @swagger
 * /api/transformations:
 *   get:
 *     summary: Get all transformation cards
 *     tags: [Transformation Cards]
 *     parameters:
 *       - in: query
 *         name: public
 *         schema:
 *           type: boolean
 *         description: If true, returns only ACTIVE and non-deleted cards
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', transformationController.getTransformations);

/**
 * @swagger
 * /api/transformations/{id}:
 *   get:
 *     summary: Get transformation card by ID
 *     tags: [Transformation Cards]
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
router.get('/:id', transformationController.getTransformationById);

/**
 * @swagger
 * /api/transformations/slug/{slug}:
 *   get:
 *     summary: Get transformation card by Slug
 *     tags: [Transformation Cards]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/slug/:slug', transformationController.getTransformationBySlug);

/**
 * @swagger
 * /api/transformations/{id}:
 *   patch:
 *     summary: Update a transformation card
 *     tags: [Transformation Cards]
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
 *     responses:
 *       200:
 *         description: Success
 */
router.patch('/:id', authenticateAdmin, transformationController.updateTransformation);

/**
 * @swagger
 * /api/transformations/{id}:
 *   delete:
 *     summary: Soft delete transformation card
 *     tags: [Transformation Cards]
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
router.delete('/:id', authenticateAdmin, transformationController.deleteTransformation);

export default router;
