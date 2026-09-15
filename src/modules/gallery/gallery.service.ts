import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class GalleryService {
  static async createGallery(data: Prisma.GalleryCreateInput) {
    return await prisma.gallery.create({ data });
  }

  static async getAllGallery(type?: string) {
    const whereClause: any = { deletedAt: null };
    if (type) {
      whereClause.type = type;
    }
    return await prisma.gallery.findMany({
      where: whereClause,
      orderBy: { displayOrder: 'asc' }
    });
  }

  static async getPreviewGallery() {
    const featuredItems = await prisma.gallery.findMany({
      where: { deletedAt: null, status: 'ACTIVE', isFeatured: true },
      orderBy: { displayOrder: 'asc' },
    });

    if (featuredItems.length > 0) {
      return featuredItems;
    }

    return await prisma.gallery.findMany({
      where: { deletedAt: null, status: 'ACTIVE' },
      orderBy: { displayOrder: 'asc' },
      take: 5
    });
  }

  static async getGalleryById(id: string) {
    const item = await prisma.gallery.findFirst({
      where: { id, deletedAt: null }
    });
    if (!item) {
      throw new Error('Gallery item not found');
    }
    return item;
  }

  static async updateGallery(id: string, data: Prisma.GalleryUpdateInput) {
    await this.getGalleryById(id); // Check existence
    return await prisma.gallery.update({
      where: { id },
      data
    });
  }

  static async deleteGallery(id: string) {
    await this.getGalleryById(id);
    return await prisma.gallery.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' }
    });
  }

  static async bulkDeleteGallery(ids: string[]) {
    return await prisma.gallery.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date(), status: 'INACTIVE' }
    });
  }
}
