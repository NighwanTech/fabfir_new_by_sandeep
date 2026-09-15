import { Request, Response } from 'express';
import { MembershipPlanService } from './membership-plan.service';
import { sendSuccess, sendError } from '../../utils/response';

const planService = new MembershipPlanService();

export class MembershipPlanController {
  // --- PLANS ---

  async getPlans(req: Request, res: Response) {
    try {
      const status = req.query.status as any;
      const plans = await planService.getPlans(status);
      return sendSuccess(res, 200, 'Plans retrieved successfully', plans);
    } catch (error) {
      console.error('Get plans error:', error);
      return sendError(res, 500, 'Failed to retrieve plans');
    }
  }

  async getPlanById(req: Request, res: Response) {
    try {
      const plan = await planService.getPlanById(req.params.id as string);
      if (!plan) return sendError(res, 404, 'Plan not found');
      return sendSuccess(res, 200, 'Plan retrieved successfully', plan);
    } catch (error) {
      console.error('Get plan by ID error:', error);
      return sendError(res, 500, 'Failed to retrieve plan');
    }
  }

  async createPlan(req: Request, res: Response) {
    try {
      const plan = await planService.createPlan(req.body);
      return sendSuccess(res, 201, 'Plan created successfully', plan);
    } catch (error) {
      console.error('Create plan error:', error);
      return sendError(res, 500, 'Failed to create plan');
    }
  }

  async updatePlan(req: Request, res: Response) {
    try {
      const plan = await planService.updatePlan(req.params.id as string, req.body);
      return sendSuccess(res, 200, 'Plan updated successfully', plan);
    } catch (error: any) {
      console.error('Update plan error:', error);
      if (error.message === 'Plan not found') {
        return sendError(res, 404, 'Plan not found');
      }
      return sendError(res, 500, 'Failed to update plan');
    }
  }

  async deletePlan(req: Request, res: Response) {
    try {
      await planService.deletePlan(req.params.id as string);
      return sendSuccess(res, 200, 'Plan deleted successfully', null);
    } catch (error) {
      console.error('Delete plan error:', error);
      return sendError(res, 500, 'Failed to delete plan');
    }
  }

  // --- FEATURES (Individual Endpoints) ---

  async getFeatures(req: Request, res: Response) {
    try {
      const features = await planService.getFeaturesByPlanId(req.params.planId as string);
      return sendSuccess(res, 200, 'Features retrieved successfully', features);
    } catch (error) {
      console.error('Get features error:', error);
      return sendError(res, 500, 'Failed to retrieve features');
    }
  }

  async createFeature(req: Request, res: Response) {
    try {
      const feature = await planService.createFeature(req.params.planId as string, req.body);
      return sendSuccess(res, 201, 'Feature created successfully', feature);
    } catch (error) {
      console.error('Create feature error:', error);
      return sendError(res, 500, 'Failed to create feature');
    }
  }

  async updateFeature(req: Request, res: Response) {
    try {
      const feature = await planService.updateFeature(req.params.planId as string, req.params.featureId as string, req.body);
      return sendSuccess(res, 200, 'Feature updated successfully', feature);
    } catch (error: any) {
      console.error('Update feature error:', error);
      if (error.message === 'Feature not found in this plan') {
        return sendError(res, 404, error.message);
      }
      return sendError(res, 500, 'Failed to update feature');
    }
  }

  async deleteFeature(req: Request, res: Response) {
    try {
      await planService.deleteFeature(req.params.planId as string, req.params.featureId as string);
      return sendSuccess(res, 200, 'Feature deleted successfully', null);
    } catch (error: any) {
      console.error('Delete feature error:', error);
      if (error.message === 'Feature not found in this plan') {
        return sendError(res, 404, error.message);
      }
      return sendError(res, 500, 'Failed to delete feature');
    }
  }
}
