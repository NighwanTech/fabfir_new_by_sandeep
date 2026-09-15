import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { HeadCoachService } from '@/modules/head-coach/head-coach.service';

const headCoachService = new HeadCoachService();

export async function GET(request: NextRequest) {
  try {
    const isPublic = request.nextUrl.searchParams.get('public') === 'true';
    if (isPublic) {
      const active = await headCoachService.getActiveHeadCoach();
      return successResponse('Active Head Coach retrieved successfully', active);
    }
    const coaches = await headCoachService.getHeadCoaches();
    return successResponse('Head Coaches retrieved successfully', coaches);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const created = await headCoachService.createHeadCoach(body);
    return successResponse('Head Coach created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
