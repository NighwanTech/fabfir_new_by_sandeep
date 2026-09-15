import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { ProgramHighlightService } from '@/modules/program-highlight/program-highlight.service';
import { createProgramHighlightSchema } from '@/modules/program-highlight/program-highlight.validation';

export async function GET() {
  try {
    const highlights = await ProgramHighlightService.getAllHighlights();
    return successResponse('Program highlights retrieved successfully', highlights);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const validatedData = createProgramHighlightSchema.parse(body);
    const created = await ProgramHighlightService.createHighlight(validatedData as any);
    return successResponse('Program highlight created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
