import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import * as transformationService from '@/modules/transformation/transformation.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await transformationService.getTransformationById(id, true);
    if (!item) return errorResponse('Transformation card not found', 404);
    return successResponse('Transformation card retrieved successfully', item);
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
    const body = await request.json();
    const updated = await transformationService.updateTransformation(id, body);
    return successResponse('Transformation card updated successfully', updated);
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
    await transformationService.softDeleteTransformation(id);
    return successResponse('Transformation card deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
