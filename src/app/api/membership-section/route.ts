import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { MembershipSectionService } from '@/modules/membership-section/membership-section.service';

const service = new MembershipSectionService();

export async function GET() {
  try {
    const section = await service.getActiveSection();
    return successResponse('Membership section retrieved successfully', section);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const created = await service.createSection(body);
    return successResponse('Membership section created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
