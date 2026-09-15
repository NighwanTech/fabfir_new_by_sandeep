import { Router } from 'express';
import {
  getTeamSections,
  getTeamSectionById,
  createTeamSection,
  updateTeamSection,
  deleteTeamSection
} from './team-section.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/team-section:
 *   get:
 *     summary: Get all Team Sections or active one (public=true)
 *     tags: [TeamSection]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getTeamSections);

/**
 * @swagger
 * /api/team-section/{id}:
 *   get:
 *     summary: Get Team Section by ID
 *     tags: [TeamSection]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', getTeamSectionById);

/**
 * @swagger
 * /api/team-section:
 *   post:
 *     summary: Create a new Team Section
 *     tags: [TeamSection]
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/', authenticateAdmin, createTeamSection);

/**
 * @swagger
 * /api/team-section/{id}:
 *   patch:
 *     summary: Update an existing Team Section
 *     tags: [TeamSection]
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.patch('/:id', authenticateAdmin, updateTeamSection);

/**
 * @swagger
 * /api/team-section/{id}:
 *   delete:
 *     summary: Soft delete a Team Section
 *     tags: [TeamSection]
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete('/:id', authenticateAdmin, deleteTeamSection);

export default router;
