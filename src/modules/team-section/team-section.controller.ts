import { Request, Response, NextFunction } from 'express';
import { TeamSectionService } from './team-section.service';
import { sendSuccess } from '../../utils/response';

const teamSectionService = new TeamSectionService();

export const getTeamSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isPublic = req.query.public === 'true';
    if (isPublic) {
      const activeSection = await teamSectionService.getActiveTeamSection();
      return sendSuccess(res, 200, 'Active Team Section retrieved successfully', activeSection ? [activeSection] : []);
    }
    const sections = await teamSectionService.getTeamSections();
    sendSuccess(res, 200, 'Team Sections retrieved successfully', sections);
  } catch (error) {
    next(error);
  }
};

export const getTeamSectionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const section = await teamSectionService.getTeamSectionById(id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Team Section not found' });
    }
    sendSuccess(res, 200, 'Team Section retrieved successfully', section);
  } catch (error) {
    next(error);
  }
};

export const createTeamSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newSection = await teamSectionService.createTeamSection(req.body);
    sendSuccess(res, 201, 'Team Section created successfully', newSection);
  } catch (error) {
    next(error);
  }
};

export const updateTeamSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const existing = await teamSectionService.getTeamSectionById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Team Section not found' });
    }
    const updatedSection = await teamSectionService.updateTeamSection(id, req.body);
    sendSuccess(res, 200, 'Team Section updated successfully', updatedSection);
  } catch (error) {
    next(error);
  }
};

export const deleteTeamSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const existing = await teamSectionService.getTeamSectionById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Team Section not found' });
    }
    await teamSectionService.deleteTeamSection(id);
    sendSuccess(res, 200, 'Team Section deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
