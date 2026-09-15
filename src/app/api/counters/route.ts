import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import * as counterService from '@/modules/counter/counter.service';
import { createCounterSchema } from '@/modules/counter/counter.validation';

export async function GET() {
  try {
    const counters = await counterService.getAllCounters();
    return successResponse('Counters retrieved successfully', counters);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const validatedData = createCounterSchema.parse(body);
    const counter = await counterService.createCounter(validatedData as any);
    return successResponse('Counter created successfully', counter, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
