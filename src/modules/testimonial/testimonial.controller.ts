import { Request, Response } from 'express';
import { TestimonialService } from './testimonial.service';
import { sendSuccess, sendError } from '../../utils/response';

const service = new TestimonialService();

export class TestimonialController {
  async getAll(req: Request, res: Response) {
    try {
      const status = req.query.status as any;
      const testimonials = await service.getAll(status);
      return sendSuccess(res, 200, 'Testimonials retrieved successfully', testimonials);
    } catch (error) {
      console.error('Get testimonials error:', error);
      return sendError(res, 500, 'Failed to retrieve testimonials');
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const testimonial = await service.getById(req.params.id as string);
      if (!testimonial) return sendError(res, 404, 'Testimonial not found');
      return sendSuccess(res, 200, 'Testimonial retrieved successfully', testimonial);
    } catch (error) {
      console.error('Get testimonial by ID error:', error);
      return sendError(res, 500, 'Failed to retrieve testimonial');
    }
  }

  async create(req: Request, res: Response) {
    try {
      const testimonial = await service.create(req.body);
      return sendSuccess(res, 201, 'Testimonial created successfully', testimonial);
    } catch (error) {
      console.error('Create testimonial error:', error);
      return sendError(res, 500, 'Failed to create testimonial');
    }
  }

  async update(req: Request, res: Response) {
    try {
      const testimonial = await service.update(req.params.id as string, req.body);
      return sendSuccess(res, 200, 'Testimonial updated successfully', testimonial);
    } catch (error: any) {
      console.error('Update testimonial error:', error);
      if (error.message === 'Testimonial not found') {
        return sendError(res, 404, 'Testimonial not found');
      }
      return sendError(res, 500, 'Failed to update testimonial');
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id as string);
      return sendSuccess(res, 200, 'Testimonial deleted successfully', null);
    } catch (error: any) {
      console.error('Delete testimonial error:', error);
      if (error.message === 'Testimonial not found') {
        return sendError(res, 404, 'Testimonial not found');
      }
      return sendError(res, 500, 'Failed to delete testimonial');
    }
  }
}
