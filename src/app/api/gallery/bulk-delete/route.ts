import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { GalleryService } from '@/modules/gallery/gallery.service';

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse('Please provide an array of IDs', 400);
    }

    await GalleryService.bulkDeleteGallery(ids);
    return successResponse('Gallery items bulk deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
