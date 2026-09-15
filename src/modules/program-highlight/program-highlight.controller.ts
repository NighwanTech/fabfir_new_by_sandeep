import { Request, Response, NextFunction } from 'express';
import { ProgramHighlightService } from './program-highlight.service';
import { createProgramHighlightSchema, updateProgramHighlightSchema } from './program-highlight.validation';
import { sendSuccess } from '../../utils/response';

export class ProgramHighlightController {
  static async createHighlight(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createProgramHighlightSchema.parse(req.body);
      const highlight = await ProgramHighlightService.createHighlight(validatedData as any);
      return sendSuccess(res, 201, 'Program highlight created successfully', highlight);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async getAllHighlights(req: Request, res: Response, next: NextFunction) {
    try {
      const highlights = await ProgramHighlightService.getAllHighlights();
      return sendSuccess(res, 200, 'Program highlights retrieved successfully', highlights);
    } catch (error) {
      next(error);
    }
  }

  static async getHighlightById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const highlight = await ProgramHighlightService.getHighlightById(id as string);
      if (!highlight) {
        return res.status(404).json({ success: false, message: 'Program highlight not found' });
      }
      return sendSuccess(res, 200, 'Program highlight retrieved successfully', highlight);
    } catch (error) {
      next(error);
    }
  }

  static async updateHighlight(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateProgramHighlightSchema.parse(req.body);
      const highlight = await ProgramHighlightService.updateHighlight(id as string, validatedData as any);
      return sendSuccess(res, 200, 'Program highlight updated successfully', highlight);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async deleteHighlight(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ProgramHighlightService.deleteHighlight(id as string);
      return sendSuccess(res, 200, 'Program highlight deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
