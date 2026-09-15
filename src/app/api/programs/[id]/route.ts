import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { ProgramService } from '@/modules/program/program.service';
import { updateProgramSchema } from '@/modules/program/program.validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const program = await ProgramService.getProgramById(id);
    if (!program) return errorResponse('Program not found', 404);
    return successResponse('Program retrieved successfully', program);
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
    const existing = await ProgramService.getProgramById(id);
    if (!existing) return errorResponse('Program not found', 404);

    const body = await request.json();
    const validatedData = updateProgramSchema.parse(body);
    const updated = await ProgramService.updateProgram(id, validatedData as any);
    return successResponse('Program updated successfully', updated);
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
    const existing = await ProgramService.getProgramById(id);
    if (!existing) return errorResponse('Program not found', 404);

    await ProgramService.deleteProgram(id);
    return successResponse('Program deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
