import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }
  return successResponse('Authenticated', { admin: auth.payload });
}
