import { Request, Response } from 'express';
import { MembershipSectionService } from './membership-section.service';
import { sendSuccess, sendError } from '../../utils/response';
import { createMembershipSectionSchema, updateMembershipSectionSchema } from './membership-section.validation';

const membershipSectionService = new MembershipSectionService();

export class MembershipSectionController {
  static async getActiveSection(req: Request, res: Response) {
    try {
      const section = await membershipSectionService.getActiveSection();
      if (!section) {
        return sendSuccess(res, 200, 'No active membership section found', null);
      }
      return sendSuccess(res, 200, 'Membership section fetched successfully', section);
    } catch (error: any) {
      return sendError(res, 500, error.message || 'Failed to fetch membership section', error);
    }
  }

  static async createSection(req: Request, res: Response) {
    try {
      const validatedData = createMembershipSectionSchema.parse(req.body);
      const newSection = await membershipSectionService.createSection(validatedData);
      return sendSuccess(res, 201, 'Membership section created successfully', newSection);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return sendError(res, 400, 'Validation failed', error.errors);
      }
      return sendError(res, 500, error.message || 'Failed to create membership section', error);
    }
  }

  static async updateSection(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateMembershipSectionSchema.parse(req.body);
      const updatedSection = await membershipSectionService.updateSection(id as string, validatedData);
      return sendSuccess(res, 200, 'Membership section updated successfully', updatedSection);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return sendError(res, 400, 'Validation failed', error.errors);
      }
      return sendError(res, 500, error.message || 'Failed to update membership section', error);
    }
  }

  static async deleteSection(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await membershipSectionService.deleteSection(id as string);
      return sendSuccess(res, 200, 'Membership section deleted successfully');
    } catch (error: any) {
      return sendError(res, 500, error.message || 'Failed to delete membership section', error);
    }
  }
}
