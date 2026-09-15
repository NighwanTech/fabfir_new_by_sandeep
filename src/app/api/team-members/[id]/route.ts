import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { TeamMemberService } from '@/modules/team-member/team-member.service';

const teamMemberService = new TeamMemberService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await teamMemberService.getTeamMemberById(id);
    if (!member) return errorResponse('Team Member not found', 404);
    return successResponse('Team Member retrieved successfully', member);
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
    const existing = await teamMemberService.getTeamMemberById(id);
    if (!existing) return errorResponse('Team Member not found', 404);

    const body = await request.json();
    const updated = await teamMemberService.updateTeamMember(id, body);
    return successResponse('Team Member updated successfully', updated);
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
    const existing = await teamMemberService.getTeamMemberById(id);
    if (!existing) return errorResponse('Team Member not found', 404);

    await teamMemberService.deleteTeamMember(id);
    return successResponse('Team Member deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
