import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import * as counterService from '@/modules/counter/counter.service';

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse('Please provide an array of counter IDs to delete', 400);
    }

    await counterService.bulkDeleteCounters(ids);
    return successResponse(`${ids.length} counters deleted successfully`, null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
