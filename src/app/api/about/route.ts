import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { AboutService } from '@/modules/about/about.service';
import { createAboutSchema } from '@/modules/about/about.validation';

export async function GET() {
  try {
    const abouts = await AboutService.getAllAbouts();
    return successResponse('About list fetched successfully', abouts);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const validatedData = createAboutSchema.parse(body);
    const created = await AboutService.createAbout(validatedData as any);
    return successResponse('About created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
