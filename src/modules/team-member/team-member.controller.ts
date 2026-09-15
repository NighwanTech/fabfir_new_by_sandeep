import { Request, Response, NextFunction } from 'express';
import { TeamMemberService } from './team-member.service';
import { sendSuccess } from '../../utils/response';

const teamMemberService = new TeamMemberService();

export const getTeamMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isPublic = req.query.public === 'true';
    if (isPublic) {
      const activeMembers = await teamMemberService.getActiveTeamMembers();
      return sendSuccess(res, 200, 'Active Team Members retrieved successfully', activeMembers);
    }
    const members = await teamMemberService.getTeamMembers();
    sendSuccess(res, 200, 'Team Members retrieved successfully', members);
  } catch (error) {
    next(error);
  }
};

export const getTeamMemberById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const member = await teamMemberService.getTeamMemberById(id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team Member not found' });
    }
    sendSuccess(res, 200, 'Team Member retrieved successfully', member);
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newMember = await teamMemberService.createTeamMember(req.body);
    sendSuccess(res, 201, 'Team Member created successfully', newMember);
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const existing = await teamMemberService.getTeamMemberById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Team Member not found' });
    }
    const updatedMember = await teamMemberService.updateTeamMember(id, req.body);
    sendSuccess(res, 200, 'Team Member updated successfully', updatedMember);
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const existing = await teamMemberService.getTeamMemberById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Team Member not found' });
    }
    await teamMemberService.deleteTeamMember(id);
    sendSuccess(res, 200, 'Team Member deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
