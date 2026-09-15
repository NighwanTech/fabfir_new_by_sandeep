import { TestimonialStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

export class TestimonialService {
  async getAll(status?: TestimonialStatus) {
    const where = status
      ? { status, deletedAt: null }
      : { deletedAt: null };

    return prisma.testimonial.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
  }

  async getById(id: string) {
    return prisma.testimonial.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async create(data: any) {
    return prisma.testimonial.create({ data });
  }

  async update(id: string, data: any) {
    const existing = await prisma.testimonial.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new Error('Testimonial not found');

    return prisma.testimonial.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const existing = await prisma.testimonial.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new Error('Testimonial not found');

    return prisma.testimonial.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
