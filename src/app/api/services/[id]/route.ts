import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { ServiceModuleService } from '@/modules/service/service.service';

const serviceService = new ServiceModuleService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let service = await serviceService.getServiceById(id);
    if (!service) {
      service = await serviceService.getServiceBySlug(id);
    }
    if (!service) return errorResponse('Service not found', 404);
    return successResponse('Service retrieved successfully', service);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { id } = await params;
    const existing = await serviceService.getServiceById(id);
    if (!existing) return errorResponse('Service not found', 404);

    const body = await request.json();
    const updated = await serviceService.updateService(id, body);
    return successResponse('Service updated successfully', updated);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { id } = await params;
    const existing = await serviceService.getServiceById(id);
    if (!existing) return errorResponse('Service not found', 404);

    await serviceService.deleteService(id);
    return successResponse('Service deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
