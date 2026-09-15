import { Request, Response, NextFunction } from 'express';
import { ServiceModuleService } from './service.service';
import { sendSuccess } from '../../utils/response';

const serviceService = new ServiceModuleService();

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isPublic = req.query.public === 'true';
    if (isPublic) {
      const activeServices = await serviceService.getActiveServices();
      return sendSuccess(res, 200, 'Active Services retrieved successfully', activeServices);
    }
    const services = await serviceService.getAllServices();
    sendSuccess(res, 200, 'Services retrieved successfully', services);
  } catch (error) {
    next(error);
  }
};

export const getServiceByIdOrSlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idOrSlug = req.params.id as string;
    let service;
    
    // First try by ID, if not found or invalid UUID format, try by slug
    service = await serviceService.getServiceById(idOrSlug);
    if (!service) {
      service = await serviceService.getServiceBySlug(idOrSlug);
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    sendSuccess(res, 200, 'Service retrieved successfully', service);
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newService = await serviceService.createService(req.body);
    sendSuccess(res, 201, 'Service created successfully', newService);
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const existing = await serviceService.getServiceById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    const updatedService = await serviceService.updateService(id, req.body);
    sendSuccess(res, 200, 'Service updated successfully', updatedService);
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const existing = await serviceService.getServiceById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await serviceService.deleteService(id);
    sendSuccess(res, 200, 'Service deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
