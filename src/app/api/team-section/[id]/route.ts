import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { TeamSectionService } from '@/modules/team-section/team-section.service';

const teamSectionService = new TeamSectionService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const section = await teamSectionService.getTeamSectionById(id);
    if (!section) return errorResponse('Team Section not found', 404);
    return successResponse('Team Section retrieved successfully', section);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { id } = await params;
    const existing = await teamSectionService.getTeamSectionById(id);
    if (!existing) return errorResponse('Team Section not found', 404);

    const body = await request.json();
    const updated = await teamSectionService.updateTeamSection(id, body);
    return successResponse('Team Section updated successfully', updated);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { id } = await params;
    const existing = await teamSectionService.getTeamSectionById(id);
    if (!existing) return errorResponse('Team Section not found', 404);

    await teamSectionService.deleteTeamSection(id);
    return successResponse('Team Section deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
