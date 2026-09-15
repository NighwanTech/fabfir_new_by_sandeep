import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { TestimonialService } from '@/modules/testimonial/testimonial.service';

const testimonialService = new TestimonialService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonial = await testimonialService.getById(id);
    if (!testimonial) return errorResponse('Testimonial not found', 404);
    return successResponse('Testimonial fetched successfully', testimonial);
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
    const body = await request.json();
    const updated = await testimonialService.update(id, body);
    return successResponse('Testimonial updated successfully', updated);
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
    await testimonialService.delete(id);
    return successResponse('Testimonial deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
