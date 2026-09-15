import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { ProgramSectionService } from '@/modules/program-section/program-section.service';
import { updateProgramSectionSchema } from '@/modules/program-section/program-section.validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const section = await ProgramSectionService.getSectionById(id);
    if (!section) return errorResponse('Program section not found', 404);
    return successResponse('Program section retrieved successfully', section);
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
    const existing = await ProgramSectionService.getSectionById(id);
    if (!existing) return errorResponse('Program section not found', 404);

    const body = await request.json();
    const validatedData = updateProgramSectionSchema.parse(body);
    const updated = await ProgramSectionService.updateSection(id, validatedData as any);
    return successResponse('Program section updated successfully', updated);
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
    const existing = await ProgramSectionService.getSectionById(id);
    if (!existing) return errorResponse('Program section not found', 404);

    await ProgramSectionService.deleteSection(id);
    return successResponse('Program section deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
