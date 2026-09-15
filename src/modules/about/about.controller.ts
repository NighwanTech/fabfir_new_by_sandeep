import { Request, Response, NextFunction } from 'express';
import { AboutService } from './about.service';
import { createAboutSchema, updateAboutSchema } from './about.validation';
import { sendSuccess } from '../../utils/response';

export class AboutController {
  static async getActiveAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const about = await AboutService.getActiveAbout();
      return sendSuccess(res, 200, 'Active About retrieved successfully', about);
    } catch (error) {
      next(error);
    }
  }

  static async getAllAbouts(req: Request, res: Response, next: NextFunction) {
    try {
      const abouts = await AboutService.getAllAbouts();
      return sendSuccess(res, 200, 'All About entries retrieved successfully', abouts);
    } catch (error) {
      next(error);
    }
  }

  static async getAboutById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const about = await AboutService.getAboutById(id as string);
      if (!about) {
        return res.status(404).json({ success: false, message: 'About entry not found' });
      }
      return sendSuccess(res, 200, 'About entry retrieved successfully', about);
    } catch (error) {
      next(error);
    }
  }

  static async createAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createAboutSchema.parse(req.body);
      const about = await AboutService.createAbout(validatedData as any);
      return sendSuccess(res, 201, 'About entry created successfully', about);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async updateAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateAboutSchema.parse(req.body);
      const about = await AboutService.updateAbout(id as string, validatedData as any);
      return sendSuccess(res, 200, 'About entry updated successfully', about);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async deleteAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AboutService.deleteAbout(id as string);
      return sendSuccess(res, 200, 'About entry deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
