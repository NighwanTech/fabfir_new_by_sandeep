import prisma from '@/lib/prisma';
import { HeroStatus } from '@prisma/client';

export class HeroService {
  static async createHero(data: any) {
    return await prisma.hero.create({
      data
    });
  }

  static async getAllHeroes() {
    return await prisma.hero.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });
  }

  static async getHeroById(id: string) {
    const hero = await prisma.hero.findFirst({
      where: { id, deletedAt: null }
    });
    if (!hero) {
      throw new Error('Hero section not found');
    }
    return hero;
  }

  static async updateHero(id: string, data: any) {
    await this.getHeroById(id); // Ensure exists
    return await prisma.hero.update({
      where: { id },
      data
    });
  }

  static async deleteHero(id: string) {
    await this.getHeroById(id); // Ensure exists
    return await prisma.hero.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  static async bulkDeleteHeroes(ids: string[]) {
    return await prisma.hero.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null
      },
      data: {
        deletedAt: new Date()
      }
    });
  }
}
