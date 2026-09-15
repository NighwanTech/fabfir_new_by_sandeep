import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from './assessment.service';
import { sendSuccess } from '../../utils/response';
import { createAssessmentSchema, updateAssessmentSchema } from './assessment.validation';
import { sendAssessmentEmail } from '../../utils/mailer';

export class AssessmentController {
  
  static async createAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = { ...req.body };
      
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000'; 
        if (files['bloodReport'] && files['bloodReport'].length > 0) {
          data.bloodReportUrl = `${baseUrl}/uploads/${files['bloodReport'][0].filename}`;
        }
        if (files['physiqueImage'] && files['physiqueImage'].length > 0) {
          data.physiqueImageUrl = `${baseUrl}/uploads/${files['physiqueImage'][0].filename}`;
        }
      }

      const validatedData = createAssessmentSchema.parse(data);
      const newAssessment = await AssessmentService.createAssessment(validatedData);
      
      // Fire and forget email notification
      sendAssessmentEmail(newAssessment).catch(console.error);

      return sendSuccess(res, 201, 'Application submitted successfully!', newAssessment);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async getAllAssessments(req: Request, res: Response, next: NextFunction) {
    try {
      const assessments = await AssessmentService.getAllAssessments();
      return sendSuccess(res, 200, 'Assessments retrieved successfully', assessments);
    } catch (error) {
      next(error);
    }
  }

  static async getAssessmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const assessment = await AssessmentService.getAssessmentById(id as string);
      return sendSuccess(res, 200, 'Assessment retrieved successfully', assessment);
    } catch (error: any) {
      if (error.message === 'Assessment not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async updateAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateAssessmentSchema.parse(req.body);
      const updatedAssessment = await AssessmentService.updateAssessment(id as string, validatedData);
      return sendSuccess(res, 200, 'Application updated successfully!', updatedAssessment);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      if (error.message === 'Assessment not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async deleteAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AssessmentService.deleteAssessment(id as string);
      return sendSuccess(res, 200, 'Application deleted successfully!');
    } catch (error: any) {
      if (error.message === 'Assessment not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Please provide an array of IDs to delete' });
      }

      await AssessmentService.bulkDeleteAssessments(ids);
      return sendSuccess(res, 200, `${ids.length} applications deleted successfully!`);
    } catch (error: any) {
      next(error);
    }
  }
}
