import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import * as PageStructureService from '@/modules/page-structure/page-structure.service';

export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { sections } = await request.json();
    if (!sections || !Array.isArray(sections)) {
      return errorResponse('Invalid sections data', 400);
    }
    const updated = await PageStructureService.bulkUpdateSections(sections);
    return successResponse('Page structure updated successfully', updated);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
