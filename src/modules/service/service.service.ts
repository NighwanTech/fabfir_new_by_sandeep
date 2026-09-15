import prisma from '@/lib/prisma';

export class ServiceModuleService {
  async getActiveServices() {
    return prisma.service.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });
  }

  async getAllServices() {
    return prisma.service.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });
  }

  async getServiceById(id: string) {
    return prisma.service.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  async getServiceBySlug(slug: string) {
    return prisma.service.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: 'ACTIVE'
      }
    });
  }

  async createService(data: any) {
    return prisma.service.create({
      data
    });
  }

  async updateService(id: string, data: any) {
    return prisma.service.update({
      where: { id },
      data
    });
  }

  async deleteService(id: string) {
    return prisma.service.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }
}
