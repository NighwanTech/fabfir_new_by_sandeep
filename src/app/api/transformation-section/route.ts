import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { TransformationSectionService } from '@/modules/transformation-section/transformation-section.service';

const sectionService = new TransformationSectionService();

export async function GET(request: NextRequest) {
  try {
    const isPublic = request.nextUrl.searchParams.get('public') === 'true';
    if (isPublic) {
      const active = await sectionService.getActiveSection();
      return successResponse('Active Transformation Section retrieved successfully', active);
    }
    const sections = await sectionService.getAllSections();
    return successResponse('Transformation Sections retrieved successfully', sections);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const created = await sectionService.createSection(body);
    return successResponse('Transformation section created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
