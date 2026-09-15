import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    await prisma.systemStat.upsert({
      where: { id: 'global_stats' },
      update: { totalVisitors: 0 },
      create: { id: 'global_stats', totalVisitors: 0 },
    });
    return successResponse('Visitor count reset to 0');
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
