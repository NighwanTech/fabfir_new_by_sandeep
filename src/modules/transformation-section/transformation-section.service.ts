import prisma from '@/lib/prisma';

export class TransformationSectionService {
  async getActiveSection() {
    return prisma.transformationSection.findFirst({
      where: {
        status: 'ACTIVE',
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getAllSections() {
    return prisma.transformationSection.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getSectionById(id: string) {
    return prisma.transformationSection.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  async createSection(data: any) {
    return prisma.transformationSection.create({
      data
    });
  }

  async updateSection(id: string, data: any) {
    return prisma.transformationSection.update({
      where: { id },
      data
    });
  }

  async deleteSection(id: string) {
    return prisma.transformationSection.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }
}
