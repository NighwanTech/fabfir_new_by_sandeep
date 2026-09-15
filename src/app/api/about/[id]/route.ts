import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { AboutService } from '@/modules/about/about.service';
import { updateAboutSchema } from '@/modules/about/about.validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const about = await AboutService.getAboutById(id);
    if (!about) return errorResponse('About not found', 404);
    return successResponse('About fetched successfully', about);
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
    const existing = await AboutService.getAboutById(id);
    if (!existing) return errorResponse('About not found', 404);

    const body = await request.json();
    const validatedData = updateAboutSchema.parse(body);
    const updated = await AboutService.updateAbout(id, validatedData as any);
    return successResponse('About updated successfully', updated);
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
    const existing = await AboutService.getAboutById(id);
    if (!existing) return errorResponse('About not found', 404);

    await AboutService.deleteAbout(id);
    return successResponse('About deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
