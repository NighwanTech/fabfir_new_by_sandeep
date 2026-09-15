import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { TeamSectionService } from '@/modules/team-section/team-section.service';

const teamSectionService = new TeamSectionService();

export async function GET(request: NextRequest) {
  try {
    const isPublic = request.nextUrl.searchParams.get('public') === 'true';
    if (isPublic) {
      const active = await teamSectionService.getActiveTeamSection();
      return successResponse('Active Team Section retrieved successfully', active);
    }
    const sections = await teamSectionService.getTeamSections();
    return successResponse('Team Sections retrieved successfully', sections);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const created = await teamSectionService.createTeamSection(body);
    return successResponse('Team Section created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
