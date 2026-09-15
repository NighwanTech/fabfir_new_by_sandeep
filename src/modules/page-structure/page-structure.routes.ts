import { Router } from 'express';
import * as PageStructureController from './page-structure.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// GET all page sections (Public or Admin, depending on usage. Assuming public for navbar)
router.get('/', PageStructureController.getSections);

// PUT bulk update (Admin only, requires authentication)
router.put('/bulk-update', authenticateAdmin, PageStructureController.bulkUpdateSections);

export default router;
