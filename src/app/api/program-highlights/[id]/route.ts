import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { ProgramHighlightService } from '@/modules/program-highlight/program-highlight.service';
import { updateProgramHighlightSchema } from '@/modules/program-highlight/program-highlight.validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const highlight = await ProgramHighlightService.getHighlightById(id);
    if (!highlight) return errorResponse('Program highlight not found', 404);
    return successResponse('Program highlight retrieved successfully', highlight);
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
    const existing = await ProgramHighlightService.getHighlightById(id);
    if (!existing) return errorResponse('Program highlight not found', 404);

    const body = await request.json();
    const validatedData = updateProgramHighlightSchema.parse(body);
    const updated = await ProgramHighlightService.updateHighlight(id, validatedData as any);
    return successResponse('Program highlight updated successfully', updated);
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
    const existing = await ProgramHighlightService.getHighlightById(id);
    if (!existing) return errorResponse('Program highlight not found', 404);

    await ProgramHighlightService.deleteHighlight(id);
    return successResponse('Program highlight deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
