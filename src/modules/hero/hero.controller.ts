import { Request, Response, NextFunction } from 'express';
import { HeroService } from './hero.service';
import { sendSuccess } from '../../utils/response';
import { createHeroSchema, updateHeroSchema } from './hero.validation';

export class HeroController {
  static async createHero(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createHeroSchema.parse(req.body);
      const newHero = await HeroService.createHero(validatedData);
      return sendSuccess(res, 201, 'Hero section created successfully!', newHero);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async getAllHeroes(req: Request, res: Response, next: NextFunction) {
    try {
      const heroes = await HeroService.getAllHeroes();
      return sendSuccess(res, 200, 'Hero sections retrieved successfully', heroes);
    } catch (error) {
      next(error);
    }
  }

  static async getHeroById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const hero = await HeroService.getHeroById(id as string);
      return sendSuccess(res, 200, 'Hero section retrieved successfully', hero);
    } catch (error: any) {
      if (error.message === 'Hero section not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async updateHero(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateHeroSchema.parse(req.body);
      const updatedHero = await HeroService.updateHero(id as string, validatedData);
      return sendSuccess(res, 200, 'Hero section updated successfully!', updatedHero);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      if (error.message === 'Hero section not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async deleteHero(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await HeroService.deleteHero(id as string);
      return sendSuccess(res, 200, 'Hero section deleted successfully!');
    } catch (error: any) {
      if (error.message === 'Hero section not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async bulkDeleteHeroes(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Please provide an array of IDs' });
      }
      const result = await HeroService.bulkDeleteHeroes(ids);
      return sendSuccess(res, 200, `${result.count} hero sections deleted successfully!`);
    } catch (error) {
      next(error);
    }
  }
}
