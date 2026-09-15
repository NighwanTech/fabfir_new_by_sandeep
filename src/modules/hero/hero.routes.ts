import { Router } from 'express';
import { HeroController } from './hero.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Heroes
 *   description: Hero section management endpoints
 */

/**
 * @swagger
 * /api/heroes:
 *   post:
 *     summary: Create a new hero section
 *     tags: [Heroes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               badge: { type: string }
 *               subtitle: { type: string }
 *               description: { type: string }
 *               primaryButtonText: { type: string }
 *               primaryButtonLink: { type: string }
 *               secondaryButtonText: { type: string }
 *               secondaryButtonLink: { type: string }
 *               backgroundImage: { type: string }
 *               foregroundImage: { type: string }
 *               status: { type: string, enum: [DRAFT, ACTIVE, INACTIVE] }
 *               displayOrder: { type: number }
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/', authenticateAdmin, HeroController.createHero);

/**
 * @swagger
 * /api/heroes:
 *   get:
 *     summary: Get all hero sections
 *     tags: [Heroes]
 *     responses:
 *       200:
 *         description: List of hero sections
 */
router.get('/', HeroController.getAllHeroes);

/**
 * @swagger
 * /api/heroes:
 *   delete:
 *     summary: Bulk soft delete hero sections
 *     tags: [Heroes]
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
 *         description: Bulk deleted successfully
 */
router.post('/bulk-delete', authenticateAdmin, HeroController.bulkDeleteHeroes);

/**
 * @swagger
 * /api/heroes/{id}:
 *   get:
 *     summary: Get hero section by ID
 *     tags: [Heroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hero section details
 */
router.get('/:id', HeroController.getHeroById);

/**
 * @swagger
 * /api/heroes/{id}:
 *   patch:
 *     summary: Update hero section
 *     tags: [Heroes]
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
 *               status: { type: string, enum: [DRAFT, ACTIVE, INACTIVE] }
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.patch('/:id', authenticateAdmin, HeroController.updateHero);

/**
 * @swagger
 * /api/heroes/{id}:
 *   delete:
 *     summary: Soft delete hero section
 *     tags: [Heroes]
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
router.delete('/:id', authenticateAdmin, HeroController.deleteHero);

export default router;
