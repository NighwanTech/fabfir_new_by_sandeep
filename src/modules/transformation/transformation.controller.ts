import { Request, Response } from 'express';
import * as transformationService from './transformation.service';

export const createTransformation = async (req: Request, res: Response) => {
  try {
    const transformation = await transformationService.createTransformation(req.body);
    res.status(201).json({ success: true, data: transformation });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransformations = async (req: Request, res: Response) => {
  try {
    const isPublic = req.query.public === 'true';
    const transformations = await transformationService.getTransformations(!isPublic);
    res.status(200).json({ success: true, data: transformations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransformationById = async (req: Request, res: Response) => {
  try {
    const isPublic = req.query.public === 'true';
    const transformation = await transformationService.getTransformationById(req.params.id as string, !isPublic);
    if (!transformation) {
      return res.status(404).json({ success: false, message: 'Transformation not found' });
    }
    res.status(200).json({ success: true, data: transformation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransformationBySlug = async (req: Request, res: Response) => {
  try {
    const isPublic = req.query.public === 'true';
    const transformation = await transformationService.getTransformationBySlug(req.params.slug as string, !isPublic);
    if (!transformation) {
      return res.status(404).json({ success: false, message: 'Transformation not found' });
    }
    res.status(200).json({ success: true, data: transformation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTransformation = async (req: Request, res: Response) => {
  try {
    const transformation = await transformationService.updateTransformation(req.params.id as string, req.body);
    res.status(200).json({ success: true, data: transformation });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Transformation not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTransformation = async (req: Request, res: Response) => {
  try {
    await transformationService.softDeleteTransformation(req.params.id as string);
    res.status(200).json({ success: true, message: 'Transformation deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
