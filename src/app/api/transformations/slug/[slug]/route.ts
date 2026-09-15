import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import * as transformationService from '@/modules/transformation/transformation.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const item = await transformationService.getTransformationBySlug(slug, false);
    if (!item) return errorResponse('Transformation card not found', 404);
    return successResponse('Transformation card retrieved successfully', item);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
