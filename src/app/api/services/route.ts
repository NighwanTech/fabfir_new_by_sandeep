import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { ServiceModuleService } from '@/modules/service/service.service';

const serviceService = new ServiceModuleService();

export async function GET(request: NextRequest) {
  try {
    const isPublic = request.nextUrl.searchParams.get('public') === 'true';
    if (isPublic) {
      const active = await serviceService.getActiveServices();
      return successResponse('Active Services retrieved successfully', active);
    }
    const all = await serviceService.getAllServices();
    return successResponse('Services retrieved successfully', all);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const created = await serviceService.createService(body);
    return successResponse('Service created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
