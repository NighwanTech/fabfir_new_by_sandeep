import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { GalleryService } from '@/modules/gallery/gallery.service';
import { updateGallerySchema } from '@/modules/gallery/gallery.validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await GalleryService.getGalleryById(id);
    return successResponse('Gallery item fetched successfully', item);
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
    const validatedData = updateGallerySchema.parse(body);
    const updated = await GalleryService.updateGallery(id, validatedData as any);
    return successResponse('Gallery item updated successfully', updated);
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
    await GalleryService.deleteGallery(id);
    return successResponse('Gallery item deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
