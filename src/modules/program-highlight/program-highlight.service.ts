import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export class ProgramHighlightService {
  static async getAllHighlights() {
    return prisma.programHighlight.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: 'asc' }
    });
  }

  static async getHighlightById(id: string) {
    return prisma.programHighlight.findFirst({
      where: { id, deletedAt: null }
    });
  }

  static async createHighlight(data: Prisma.ProgramHighlightCreateInput) {
    return prisma.programHighlight.create({
      data
    });
  }

  static async updateHighlight(id: string, data: Prisma.ProgramHighlightUpdateInput) {
    return prisma.programHighlight.update({
      where: { id },
      data
    });
  }

  static async deleteHighlight(id: string) {
    return prisma.programHighlight.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' }
    });
  }
}
