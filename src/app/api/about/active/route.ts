import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { AboutService } from '@/modules/about/about.service';

export async function GET() {
  try {
    const active = await AboutService.getActiveAbout();
    return successResponse('Active about fetched successfully', active);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
