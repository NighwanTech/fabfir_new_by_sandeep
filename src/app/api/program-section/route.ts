import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { ProgramSectionService } from '@/modules/program-section/program-section.service';
import { createProgramSectionSchema } from '@/modules/program-section/program-section.validation';

export async function GET() {
  try {
    const sections = await ProgramSectionService.getAllSections();
    return successResponse('Program sections retrieved successfully', sections);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const validatedData = createProgramSectionSchema.parse(body);
    const created = await ProgramSectionService.createSection(validatedData as any);
    return successResponse('Program section created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
