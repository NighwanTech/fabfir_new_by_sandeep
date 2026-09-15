import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { TeamMemberService } from '@/modules/team-member/team-member.service';

const teamMemberService = new TeamMemberService();

export async function GET(request: NextRequest) {
  try {
    const isPublic = request.nextUrl.searchParams.get('public') === 'true';
    if (isPublic) {
      const active = await teamMemberService.getActiveTeamMembers();
      return successResponse('Active Team Members retrieved successfully', active);
    }
    const members = await teamMemberService.getTeamMembers();
    return successResponse('Team Members retrieved successfully', members);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const created = await teamMemberService.createTeamMember(body);
    return successResponse('Team Member created successfully', created, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
