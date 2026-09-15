import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { ProgramService } from '@/modules/program/program.service';
import { createProgramSchema } from '@/modules/program/program.validation';

export async function GET() {
  try {
    const programs = await ProgramService.getAllPrograms();
    return successResponse('Programs retrieved successfully', programs);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const validatedData = createProgramSchema.parse(body);
    const created = await ProgramService.createProgram(validatedData as any);
    return successResponse('Program created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
