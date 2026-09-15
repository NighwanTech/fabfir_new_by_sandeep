import { Router } from 'express';
import { GalleryController } from './gallery.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Gallery
 *   description: API for managing gallery images
 */

/**
 * @openapi
 * /api/gallery:
 *   post:
 *     summary: Create a new gallery image record
 *     tags: [Gallery]
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticateAdmin, GalleryController.createGallery);

/**
 * @openapi
 * /api/gallery:
 *   get:
 *     summary: Get all gallery images
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', GalleryController.getAllGallery);

/**
 * @openapi
 * /api/gallery/preview:
 *   get:
 *     summary: Get a preview of gallery images
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/preview', GalleryController.getPreviewGallery);

/**
 * @openapi
 * /api/gallery/bulk-delete:
 *   post:
 *     summary: Bulk delete gallery images
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/bulk-delete', authenticateAdmin, GalleryController.bulkDelete);

/**
 * @openapi
 * /api/gallery/{id}:
 *   get:
 *     summary: Get a gallery image by ID
 *     tags: [Gallery]
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
router.get('/:id', GalleryController.getGalleryById);

/**
 * @openapi
 * /api/gallery/{id}:
 *   patch:
 *     summary: Update a gallery image
 *     tags: [Gallery]
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
router.patch('/:id', authenticateAdmin, GalleryController.updateGallery);

/**
 * @openapi
 * /api/gallery/{id}:
 *   delete:
 *     summary: Delete a gallery image
 *     tags: [Gallery]
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
router.delete('/:id', authenticateAdmin, GalleryController.deleteGallery);

export default router;
