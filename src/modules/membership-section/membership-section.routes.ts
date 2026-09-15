import { Router } from 'express';
import { MembershipSectionController } from './membership-section.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: MembershipSection
 *   description: Membership section management
 */

/**
 * @swagger
 * /api/membership-section:
 *   get:
 *     summary: Get the active membership section
 *     tags: [MembershipSection]
 *     responses:
 *       200:
 *         description: Active membership section retrieved successfully
 */
router.get('/', MembershipSectionController.getActiveSection);

/**
 * @swagger
 * /api/membership-section:
 *   post:
 *     summary: Create a new membership section
 *     tags: [MembershipSection]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - badge
 *               - title
 *               - description
 *             properties:
 *               badge:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       201:
 *         description: Membership section created successfully
 */
router.post('/', authenticateAdmin, MembershipSectionController.createSection);

/**
 * @swagger
 * /api/membership-section/{id}:
 *   patch:
 *     summary: Update an existing membership section
 *     tags: [MembershipSection]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The section id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               badge:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Membership section updated successfully
 */
router.patch('/:id', authenticateAdmin, MembershipSectionController.updateSection);

/**
 * @swagger
 * /api/membership-section/{id}:
 *   delete:
 *     summary: Soft delete a membership section
 *     tags: [MembershipSection]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The section id
 *     responses:
 *       200:
 *         description: Membership section deleted successfully
 */
router.delete('/:id', authenticateAdmin, MembershipSectionController.deleteSection);

export default router;
