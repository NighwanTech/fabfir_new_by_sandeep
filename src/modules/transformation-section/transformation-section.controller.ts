import { Request, Response, NextFunction } from 'express';
import { TransformationSectionService } from './transformation-section.service';
import { sendSuccess } from '../../utils/response';

const sectionService = new TransformationSectionService();

export const getSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isPublic = req.query.public === 'true';
    if (isPublic) {
      const activeSection = await sectionService.getActiveSection();
      return sendSuccess(res, 200, 'Active Transformation Section retrieved successfully', activeSection);
    }
    const sections = await sectionService.getAllSections();
    sendSuccess(res, 200, 'Transformation Sections retrieved successfully', sections);
  } catch (error) {
    next(error);
  }
};

export const getSectionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const section = await sectionService.getSectionById(id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Transformation Section not found' });
    }
    sendSuccess(res, 200, 'Transformation Section retrieved successfully', section);
  } catch (error) {
    next(error);
  }
};

export const createSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newSection = await sectionService.createSection(req.body);
    sendSuccess(res, 201, 'Transformation Section created successfully', newSection);
  } catch (error) {
    next(error);
  }
};

export const updateSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const existing = await sectionService.getSectionById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transformation Section not found' });
    }
    const updatedSection = await sectionService.updateSection(id, req.body);
    sendSuccess(res, 200, 'Transformation Section updated successfully', updatedSection);
  } catch (error) {
    next(error);
  }
};

export const deleteSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const existing = await sectionService.getSectionById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transformation Section not found' });
    }
    await sectionService.deleteSection(id);
    sendSuccess(res, 200, 'Transformation Section deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
