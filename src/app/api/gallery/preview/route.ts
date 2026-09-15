import { successResponse, errorResponse } from '@/lib/apiResponse';
import { GalleryService } from '@/modules/gallery/gallery.service';

export async function GET() {
  try {
    const preview = await GalleryService.getPreviewGallery();
    return successResponse('Gallery preview fetched successfully', preview);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
