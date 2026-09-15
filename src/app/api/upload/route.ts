import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return errorResponse('No file uploaded', 400);
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return errorResponse('Only image and video files are allowed.', 400);
    }

    const IMAGE_LIMIT = 50 * 1024 * 1024;
    const VIDEO_LIMIT = 500 * 1024 * 1024;

    if (isImage && file.size > IMAGE_LIMIT) {
      return errorResponse('Image size must not exceed 50 MB.', 400);
    }
    if (isVideo && file.size > VIDEO_LIMIT) {
      return errorResponse('Video size must not exceed 500 MB.', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadToCloudinary = () => {
      return new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'fabfit',
            resource_type: isVideo ? 'video' : 'auto',
          },
          (error, result) => {
            if (error || !result) {
              return reject(error || new Error('Upload to Cloudinary failed'));
            }
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const result = await uploadToCloudinary();
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: result.secure_url,
      data: { url: result.secure_url }
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return errorResponse(error?.message || 'Error uploading file to Cloudinary', 500);
  }
}
