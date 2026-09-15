import { Router } from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from './team-member.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/team-members:
 *   get:
 *     summary: Get all Team Members or active ones (public=true)
 *     tags: [TeamMember]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getTeamMembers);

/**
 * @swagger
 * /api/team-members/{id}:
 *   get:
 *     summary: Get Team Member by ID
 *     tags: [TeamMember]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', getTeamMemberById);

/**
 * @swagger
 * /api/team-members:
 *   post:
 *     summary: Create a new Team Member
 *     tags: [TeamMember]
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/', authenticateAdmin, createTeamMember);

/**
 * @swagger
 * /api/team-members/{id}:
 *   patch:
 *     summary: Update an existing Team Member
 *     tags: [TeamMember]
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.patch('/:id', authenticateAdmin, updateTeamMember);

/**
 * @swagger
 * /api/team-members/{id}:
 *   delete:
 *     summary: Soft delete a Team Member
 *     tags: [TeamMember]
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete('/:id', authenticateAdmin, deleteTeamMember);

export default router;
