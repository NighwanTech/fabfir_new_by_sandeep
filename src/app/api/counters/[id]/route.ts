import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import * as counterService from '@/modules/counter/counter.service';
import { updateCounterSchema } from '@/modules/counter/counter.validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const counter = await counterService.getCounterById(id);
    if (!counter) return errorResponse('Counter not found', 404);
    return successResponse('Counter retrieved successfully', counter);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { id } = await params;
    const existing = await counterService.getCounterById(id);
    if (!existing) return errorResponse('Counter not found', 404);

    const body = await request.json();
    const validatedData = updateCounterSchema.parse(body);
    const updated = await counterService.updateCounter(id, validatedData as any);
    return successResponse('Counter updated successfully', updated);
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
    const existing = await counterService.getCounterById(id);
    if (!existing) return errorResponse('Counter not found', 404);

    await counterService.deleteCounter(id);
    return successResponse('Counter deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
