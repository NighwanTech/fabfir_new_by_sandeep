import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { TransformationSectionService } from '@/modules/transformation-section/transformation-section.service';

const sectionService = new TransformationSectionService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const section = await sectionService.getSectionById(id);
    if (!section) return errorResponse('Transformation section not found', 404);
    return successResponse('Transformation section retrieved successfully', section);
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
    const existing = await sectionService.getSectionById(id);
    if (!existing) return errorResponse('Transformation section not found', 404);

    const body = await request.json();
    const updated = await sectionService.updateSection(id, body);
    return successResponse('Transformation section updated successfully', updated);
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
    const existing = await sectionService.getSectionById(id);
    if (!existing) return errorResponse('Transformation section not found', 404);

    await sectionService.deleteSection(id);
    return successResponse('Transformation section deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
