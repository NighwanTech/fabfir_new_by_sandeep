import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const [totalAssessments, newAssessments, acceptedClients, statsRecord] = await Promise.all([
      prisma.assessment.count(),
      prisma.assessment.count({ where: { status: 'NEW' } }),
      prisma.assessment.count({ where: { status: 'ACCEPTED' } }),
      prisma.systemStat.findUnique({ where: { id: 'global_stats' } }),
    ]);

    const totalVisitors = statsRecord?.totalVisitors || 0;

    return successResponse('Stats retrieved', {
      totalAssessments,
      newAssessments,
      acceptedClients,
      totalVisitors,
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
