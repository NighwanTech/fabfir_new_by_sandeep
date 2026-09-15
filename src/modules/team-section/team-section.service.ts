import prisma from '@/lib/prisma';
import { TeamSectionStatus } from '@prisma/client';

export class TeamSectionService {
  async getActiveTeamSection() {
    return prisma.teamSection.findFirst({
      where: {
        status: 'ACTIVE',
        deletedAt: null
      }
    });
  }

  async getTeamSections() {
    return prisma.teamSection.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getTeamSectionById(id: string) {
    return prisma.teamSection.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  async createTeamSection(data: any) {
    if (data.status === 'ACTIVE') {
      await this.handleActiveStatus();
    }
    return prisma.teamSection.create({
      data
    });
  }

  async updateTeamSection(id: string, data: any) {
    if (data.status === 'ACTIVE') {
      await this.handleActiveStatus(id);
    }
    return prisma.teamSection.update({
      where: { id },
      data
    });
  }

  async deleteTeamSection(id: string) {
    return prisma.teamSection.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }

  private async handleActiveStatus(excludeId?: string) {
    // If setting a new one as active, set other active ones to INACTIVE
    const whereClause: any = {
      status: 'ACTIVE',
      deletedAt: null
    };
    
    if (excludeId) {
      whereClause.id = { not: excludeId };
    }
    
    await prisma.teamSection.updateMany({
      where: whereClause,
      data: {
        status: 'INACTIVE'
      }
    });
  }
}
