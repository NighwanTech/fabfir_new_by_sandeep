import prisma from '@/lib/prisma';

export class TeamMemberService {
  async getActiveTeamMembers() {
    return prisma.teamMember.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });
  }

  async getTeamMembers() {
    return prisma.teamMember.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });
  }

  async getTeamMemberById(id: string) {
    return prisma.teamMember.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  async createTeamMember(data: any) {
    return prisma.teamMember.create({
      data
    });
  }

  async updateTeamMember(id: string, data: any) {
    return prisma.teamMember.update({
      where: { id },
      data
    });
  }

  async deleteTeamMember(id: string) {
    return prisma.teamMember.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }
}
