import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { MembershipPlanService } from '@/modules/membership-plan/membership-plan.service';

const service = new MembershipPlanService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plan = await service.getPlanById(id);
    if (!plan) return errorResponse('Plan not found', 404);
    return successResponse('Plan retrieved successfully', plan);
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
    const updated = await service.updatePlan(id, body);
    return successResponse('Plan updated successfully', updated);
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
    await service.deletePlan(id);
    return successResponse('Plan deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
