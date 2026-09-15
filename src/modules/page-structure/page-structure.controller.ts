import { Request, Response } from 'express';
import * as PageStructureService from './page-structure.service';

export const getSections = async (req: Request, res: Response) => {
  try {
    // First, check if we need to seed the initial data
    await PageStructureService.seedInitialSections();
    
    // Fetch all sections
    const sections = await PageStructureService.getPageSections();
    
    res.status(200).json({
      success: true,
      data: sections
    });
  } catch (error: any) {
    console.error('Error fetching page sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page sections',
      error: error.message
    });
  }
};

export const bulkUpdateSections = async (req: Request, res: Response) => {
  try {
    const { sections } = req.body;

    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected an array of sections.'
      });
    }

    const updatedSections = await PageStructureService.bulkUpdateSections(sections);

    res.status(200).json({
      success: true,
      message: 'Page structure updated successfully',
      data: updatedSections
    });
  } catch (error: any) {
    console.error('Error updating page sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update page structure',
      error: error.message
    });
  }
};
