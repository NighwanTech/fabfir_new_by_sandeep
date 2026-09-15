import { Request, Response, NextFunction } from 'express';
import { HeadCoachService } from './head-coach.service';
import { sendSuccess } from '../../utils/response';

const headCoachService = new HeadCoachService();

export const getHeadCoaches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isPublic = req.query.public === 'true';
    if (isPublic) {
      const activeHeadCoach = await headCoachService.getActiveHeadCoach();
      return sendSuccess(res, 200, 'Active Head Coach retrieved successfully', activeHeadCoach ? [activeHeadCoach] : []);
    }
    const headCoaches = await headCoachService.getHeadCoaches();
    sendSuccess(res, 200, 'Head Coaches retrieved successfully', headCoaches);
  } catch (error) {
    next(error);
  }
};

export const getHeadCoachById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const headCoach = await headCoachService.getHeadCoachById(id);
    if (!headCoach) {
      return res.status(404).json({ success: false, message: 'Head Coach not found' });
    }
    sendSuccess(res, 200, 'Head Coach retrieved successfully', headCoach);
  } catch (error) {
    next(error);
  }
};

export const createHeadCoach = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const headCoach = await headCoachService.createHeadCoach(req.body);
    sendSuccess(res, 201, 'Head Coach created successfully', headCoach);
  } catch (error) {
    next(error);
  }
};

export const updateHeadCoach = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const existing = await headCoachService.getHeadCoachById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Head Coach not found' });
    }
    const headCoach = await headCoachService.updateHeadCoach(id, req.body);
    sendSuccess(res, 200, 'Head Coach updated successfully', headCoach);
  } catch (error) {
    next(error);
  }
};

export const deleteHeadCoach = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const existing = await headCoachService.getHeadCoachById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Head Coach not found' });
    }
    await headCoachService.softDeleteHeadCoach(id);
    sendSuccess(res, 200, 'Head Coach deleted successfully');
  } catch (error) {
    next(error);
  }
};
