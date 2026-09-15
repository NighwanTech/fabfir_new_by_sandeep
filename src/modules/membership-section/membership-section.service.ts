import prisma from '@/lib/prisma';

export class MembershipSectionService {
  async getActiveSection() {
    return await prisma.membershipSection.findFirst({
      where: {
        deletedAt: null,
      },
      orderBy: [
        { status: 'asc' }, // ACTIVE first
        { updatedAt: 'desc' }
      ]
    });
  }

  async createSection(data: any) {
    return await prisma.membershipSection.create({
      data: {
        badge: data.badge,
        title: data.title,
        description: data.description,
        status: data.status || 'ACTIVE'
      },
    });
  }

  async updateSection(id: string, data: any) {
    return await prisma.membershipSection.update({
      where: { id },
      data,
    });
  }

  async deleteSection(id: string) {
    return await prisma.membershipSection.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }
}
