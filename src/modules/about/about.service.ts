import { AboutStatus, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export class AboutService {
  static async getActiveAbout() {
    const about = await prisma.about.findFirst({
      where: {
        status: 'ACTIVE',
        deletedAt: null
      }
    });
    return about;
  }

  static async getAllAbouts() {
    return prisma.about.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getAboutById(id: string) {
    return prisma.about.findFirst({
      where: { id, deletedAt: null }
    });
  }

  static async createAbout(data: Prisma.AboutCreateInput) {
    return prisma.about.create({
      data
    });
  }

  static async updateAbout(id: string, data: Prisma.AboutUpdateInput) {
    return prisma.about.update({
      where: { id },
      data
    });
  }

  static async deleteAbout(id: string) {
    return prisma.about.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' }
    });
  }
}
