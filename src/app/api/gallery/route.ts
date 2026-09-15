import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { GalleryService } from '@/modules/gallery/gallery.service';
import { createGallerySchema } from '@/modules/gallery/gallery.validation';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') || undefined;
    const items = await GalleryService.getAllGallery(type);
    return successResponse('Gallery items fetched successfully', items);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const validatedData = createGallerySchema.parse(body);
    const created = await GalleryService.createGallery(validatedData as any);
    return successResponse('Gallery item created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
