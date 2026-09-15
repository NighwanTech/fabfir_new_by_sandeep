import { Request, Response, NextFunction } from 'express';
import { GalleryService } from './gallery.service';
import { createGallerySchema, updateGallerySchema } from './gallery.validation';
import { sendSuccess } from '../../utils/response';

export class GalleryController {
  static async createGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createGallerySchema.parse(req.body);
      const item = await GalleryService.createGallery(validatedData as any);
      return sendSuccess(res, 201, 'Gallery item created successfully!', item);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async getAllGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as string;
      const items = await GalleryService.getAllGallery(type);
      return sendSuccess(res, 200, 'Gallery retrieved successfully', items);
    } catch (error) {
      next(error);
    }
  }

  static async getPreviewGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await GalleryService.getPreviewGallery();
      return sendSuccess(res, 200, 'Preview gallery retrieved successfully', items);
    } catch (error) {
      next(error);
    }
  }

  static async getGalleryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const item = await GalleryService.getGalleryById(id as string);
      return sendSuccess(res, 200, 'Gallery item retrieved successfully', item);
    } catch (error: any) {
      if (error.message === 'Gallery item not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async updateGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateGallerySchema.parse(req.body);
      const updatedItem = await GalleryService.updateGallery(id as string, validatedData as any);
      return sendSuccess(res, 200, 'Gallery item updated successfully!', updatedItem);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      if (error.message === 'Gallery item not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async deleteGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await GalleryService.deleteGallery(id as string);
      return sendSuccess(res, 200, 'Gallery item deleted successfully!');
    } catch (error: any) {
      if (error.message === 'Gallery item not found') {
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
      await GalleryService.bulkDeleteGallery(ids);
      return sendSuccess(res, 200, `${ids.length} items deleted successfully!`);
    } catch (error) {
      next(error);
    }
  }
}
