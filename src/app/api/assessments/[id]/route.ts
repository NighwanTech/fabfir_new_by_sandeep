import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { AssessmentService } from '@/modules/assessment/assessment.service';
import { updateAssessmentSchema } from '@/modules/assessment/assessment.validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { id } = await params;
    const assessment = await AssessmentService.getAssessmentById(id);
    return successResponse('Assessment retrieved successfully', assessment);
  } catch (error: any) {
    return errorResponse(error.message, 404);
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
    const validatedData = updateAssessmentSchema.parse(body);
    const updated = await AssessmentService.updateAssessment(id, validatedData);
    return successResponse('Assessment updated successfully', updated);
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
    await AssessmentService.deleteAssessment(id);
    return successResponse('Assessment deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
