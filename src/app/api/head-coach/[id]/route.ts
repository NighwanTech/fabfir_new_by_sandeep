import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { HeadCoachService } from '@/modules/head-coach/head-coach.service';

const headCoachService = new HeadCoachService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const coach = await headCoachService.getHeadCoachById(id);
    if (!coach) return errorResponse('Head Coach not found', 404);
    return successResponse('Head Coach retrieved successfully', coach);
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
    const existing = await headCoachService.getHeadCoachById(id);
    if (!existing) return errorResponse('Head Coach not found', 404);

    const body = await request.json();
    const updated = await headCoachService.updateHeadCoach(id, body);
    return successResponse('Head Coach updated successfully', updated);
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
    const existing = await headCoachService.getHeadCoachById(id);
    if (!existing) return errorResponse('Head Coach not found', 404);

    await headCoachService.softDeleteHeadCoach(id);
    return successResponse('Head Coach deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
