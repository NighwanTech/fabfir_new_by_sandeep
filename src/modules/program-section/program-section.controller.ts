import { Request, Response, NextFunction } from 'express';
import { ProgramSectionService } from './program-section.service';
import { createProgramSectionSchema, updateProgramSectionSchema } from './program-section.validation';
import { sendSuccess } from '../../utils/response';

export class ProgramSectionController {
  static async createSection(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createProgramSectionSchema.parse(req.body);
      const section = await ProgramSectionService.createSection(validatedData as any);
      return sendSuccess(res, 201, 'Program section created successfully', section);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async getAllSections(req: Request, res: Response, next: NextFunction) {
    try {
      const sections = await ProgramSectionService.getAllSections();
      return sendSuccess(res, 200, 'Program sections retrieved successfully', sections);
    } catch (error) {
      next(error);
    }
  }

  static async getSectionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const section = await ProgramSectionService.getSectionById(id as string);
      if (!section) {
        return res.status(404).json({ success: false, message: 'Program section not found' });
      }
      return sendSuccess(res, 200, 'Program section retrieved successfully', section);
    } catch (error) {
      next(error);
    }
  }

  static async updateSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateProgramSectionSchema.parse(req.body);
      const section = await ProgramSectionService.updateSection(id as string, validatedData as any);
      return sendSuccess(res, 200, 'Program section updated successfully', section);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async deleteSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ProgramSectionService.deleteSection(id as string);
      return sendSuccess(res, 200, 'Program section deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
