import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { TestimonialService } from '@/modules/testimonial/testimonial.service';

const testimonialService = new TestimonialService();

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status') as any;
    const testimonials = await testimonialService.getAll(status);
    return successResponse('Testimonials fetched successfully', testimonials);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const created = await testimonialService.create(body);
    return successResponse('Testimonial created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
