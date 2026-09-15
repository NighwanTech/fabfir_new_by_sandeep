import prisma from '@/lib/prisma';
import { HeadCoach, HeadCoachStatus } from '@prisma/client';

export class HeadCoachService {
  async getHeadCoaches() {
    return prisma.headCoach.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getActiveHeadCoach() {
    return prisma.headCoach.findFirst({
      where: {
        status: 'ACTIVE',
        deletedAt: null
      }
    });
  }

  async getHeadCoachById(id: string) {
    return prisma.headCoach.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  async createHeadCoach(data: any) {
    return prisma.headCoach.create({
      data
    });
  }

  async updateHeadCoach(id: string, data: any) {
    return prisma.headCoach.update({
      where: { id },
      data
    });
  }

  async softDeleteHeadCoach(id: string) {
    return prisma.headCoach.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        deletedAt: new Date()
      }
    });
  }
}
