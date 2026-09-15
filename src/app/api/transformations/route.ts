import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import * as transformationService from '@/modules/transformation/transformation.service';

export async function GET(request: NextRequest) {
  try {
    const isPublic = request.nextUrl.searchParams.get('public') === 'true';
    const items = await transformationService.getTransformations(!isPublic);
    return successResponse('Transformations retrieved successfully', items);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const created = await transformationService.createTransformation(body);
    return successResponse('Transformation card created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
