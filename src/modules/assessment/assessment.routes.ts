import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { AssessmentController } from './assessment.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Assessments
 *   description: Assessment application endpoints
 */

/**
 * @swagger
 * /api/assessments:
 *   post:
 *     summary: Submit a new assessment
 *     tags: [Assessments]
 *     responses:
 *       201:
 *         description: Application submitted successfully
 */
router.post('/', upload.fields([{ name: 'bloodReport', maxCount: 1 }, { name: 'physiqueImage', maxCount: 1 }]), AssessmentController.createAssessment);

/**
 * @swagger
 * /api/assessments:
 *   get:
 *     summary: Get all assessments (admin)
 *     tags: [Assessments]
 *     responses:
 *       200:
 *         description: List of assessments
 */
router.get('/', authenticateAdmin, AssessmentController.getAllAssessments);

/**
 * @swagger
 * /api/assessments/{id}:
 *   get:
 *     summary: Get assessment by ID
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assessment details
 *       404:
 *         description: Assessment not found
 */
router.get('/:id', authenticateAdmin, AssessmentController.getAssessmentById);

/**
 * @swagger
 * /api/assessments/{id}:
 *   patch:
 *     summary: Update assessment status or notes
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assessment updated successfully
 */
router.patch('/:id', authenticateAdmin, AssessmentController.updateAssessment);

/**
 * @swagger
 * /api/assessments/{id}:
 *   delete:
 *     summary: Soft delete assessment
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assessment deleted successfully
 */
router.delete('/:id', authenticateAdmin, AssessmentController.deleteAssessment);
router.post('/bulk-delete', authenticateAdmin, AssessmentController.bulkDelete);

export default router;
