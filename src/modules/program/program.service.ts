import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export class ProgramService {
  static async getAllPrograms() {
    return prisma.program.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: 'asc' }
    });
  }

  static async getProgramById(id: string) {
    return prisma.program.findFirst({
      where: { id, deletedAt: null }
    });
  }

  static async createProgram(data: Prisma.ProgramCreateInput) {
    return prisma.program.create({
      data
    });
  }

  static async updateProgram(id: string, data: Prisma.ProgramUpdateInput) {
    return prisma.program.update({
      where: { id },
      data
    });
  }

  static async deleteProgram(id: string) {
    return prisma.program.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' }
    });
  }
}
