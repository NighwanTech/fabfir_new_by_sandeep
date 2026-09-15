import prisma from '@/lib/prisma';
import { TransformationStatus } from '@prisma/client';

export const createTransformation = async (data: any) => {
  return prisma.transformation.create({
    data,
  });
};

export const getTransformations = async (includeDrafts = false) => {
  const where: any = includeDrafts ? { deletedAt: null } : { deletedAt: null, status: TransformationStatus.ACTIVE };
  return prisma.transformation.findMany({
    where,
    orderBy: {
      displayOrder: 'asc',
    },
  });
};

export const getTransformationById = async (id: string, includeDrafts = false) => {
  const where: any = { id, deletedAt: null };
  if (!includeDrafts) {
    where.status = TransformationStatus.ACTIVE;
  }
  return prisma.transformation.findFirst({
    where,
  });
};

export const getTransformationBySlug = async (slug: string, includeDrafts = false) => {
  const where: any = { slug, deletedAt: null };
  if (!includeDrafts) {
    where.status = TransformationStatus.ACTIVE;
  }
  return prisma.transformation.findFirst({
    where,
  });
};

export const updateTransformation = async (id: string, data: any) => {
  return prisma.transformation.update({
    where: { id },
    data,
  });
};

export const softDeleteTransformation = async (id: string) => {
  return prisma.transformation.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
