import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import * as PageStructureService from '@/modules/page-structure/page-structure.service';

export async function GET() {
  try {
    let sections = await PageStructureService.getPageSections();
    if (!sections || sections.length === 0) {
      await PageStructureService.seedInitialSections();
      sections = await PageStructureService.getPageSections();
    }
    return successResponse('Page sections retrieved successfully', sections);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
