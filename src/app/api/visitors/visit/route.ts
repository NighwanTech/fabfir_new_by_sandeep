import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import prisma from '@/lib/prisma';

const trackedIPs = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

    if (!trackedIPs.has(clientIp)) {
      trackedIPs.add(clientIp);
      await prisma.systemStat.upsert({
        where: { id: 'global_stats' },
        update: { totalVisitors: { increment: 1 } },
        create: { id: 'global_stats', totalVisitors: 1 },
      });
    }

    return successResponse('Visitor tracked');
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
