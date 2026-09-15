import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { MembershipPlanService } from '@/modules/membership-plan/membership-plan.service';

const service = new MembershipPlanService();

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status') as any;
    const plans = await service.getPlans(status);
    return successResponse('Membership plans retrieved successfully', plans);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const created = await service.createPlan(body);
    return successResponse('Membership plan created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
