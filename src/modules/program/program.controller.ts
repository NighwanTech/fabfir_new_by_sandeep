import { Request, Response, NextFunction } from 'express';
import { ProgramService } from './program.service';
import { createProgramSchema, updateProgramSchema } from './program.validation';
import { sendSuccess } from '../../utils/response';

export class ProgramController {
  static async createProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createProgramSchema.parse(req.body);
      const program = await ProgramService.createProgram(validatedData as any);
      return sendSuccess(res, 201, 'Program created successfully', program);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async getAllPrograms(req: Request, res: Response, next: NextFunction) {
    try {
      const programs = await ProgramService.getAllPrograms();
      return sendSuccess(res, 200, 'Programs retrieved successfully', programs);
    } catch (error) {
      next(error);
    }
  }

  static async getProgramById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const program = await ProgramService.getProgramById(id as string);
      if (!program) {
        return res.status(404).json({ success: false, message: 'Program not found' });
      }
      return sendSuccess(res, 200, 'Program retrieved successfully', program);
    } catch (error) {
      next(error);
    }
  }

  static async updateProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateProgramSchema.parse(req.body);
      const program = await ProgramService.updateProgram(id as string, validatedData as any);
      return sendSuccess(res, 200, 'Program updated successfully', program);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async deleteProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ProgramService.deleteProgram(id as string);
      return sendSuccess(res, 200, 'Program deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
