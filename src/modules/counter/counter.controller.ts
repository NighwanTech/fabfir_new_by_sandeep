import { Request, Response, NextFunction } from 'express';
import * as counterService from './counter.service';
import { createCounterSchema, updateCounterSchema } from './counter.validation';
import { sendSuccess, sendError } from '../../utils/response';

export const createCounter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createCounterSchema.parse(req.body);
    const counter = await counterService.createCounter(validatedData);
    sendSuccess(res, 201, 'Counter created successfully', counter);
  } catch (error: any) {
    next(error);
  }
};

export const getAllCounters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const counters = await counterService.getAllCounters();
    sendSuccess(res, 200, 'Counters retrieved successfully', counters);
  } catch (error: any) {
    next(error);
  }
};

export const getCounterById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const counter = await counterService.getCounterById(req.params.id as string);
    if (!counter) {
      sendError(res, 404, 'Counter not found');
      return;
    }
    sendSuccess(res, 200, 'Counter retrieved successfully', counter);
  } catch (error: any) {
    next(error);
  }
};

export const updateCounter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = updateCounterSchema.parse(req.body);
    const existingCounter = await counterService.getCounterById(req.params.id as string);
    if (!existingCounter) {
      sendError(res, 404, 'Counter not found');
      return;
    }
    const counter = await counterService.updateCounter(req.params.id as string, validatedData);
    sendSuccess(res, 200, 'Counter updated successfully', counter);
  } catch (error: any) {
    next(error);
  }
};

export const deleteCounter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const existingCounter = await counterService.getCounterById(req.params.id as string);
    if (!existingCounter) {
      sendError(res, 404, 'Counter not found');
      return;
    }
    await counterService.deleteCounter(req.params.id as string);
    sendSuccess(res, 200, 'Counter deleted successfully', null);
  } catch (error: any) {
    next(error);
  }
};

export const bulkDelete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      sendError(res, 400, 'Please provide an array of counter IDs to delete');
      return;
    }

    await counterService.bulkDeleteCounters(ids);
    sendSuccess(res, 200, `${ids.length} counters deleted successfully`, null);
  } catch (error: any) {
    next(error);
  }
};
