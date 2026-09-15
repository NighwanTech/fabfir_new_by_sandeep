import { PrismaClient, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const createCounter = async (data: Prisma.CounterCreateInput) => {
  return await prisma.counter.create({
    data,
  });
};

export const getAllCounters = async (includeDeleted = false) => {
  return await prisma.counter.findMany({
    where: includeDeleted ? undefined : { deletedAt: null },
    orderBy: { displayOrder: 'asc' },
  });
};

export const getCounterById = async (id: string) => {
  return await prisma.counter.findFirst({
    where: { id, deletedAt: null },
  });
};

export const updateCounter = async (id: string, data: Prisma.CounterUpdateInput) => {
  return await prisma.counter.update({
    where: { id },
    data,
  });
};

export const deleteCounter = async (id: string) => {
  return await prisma.counter.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'INACTIVE' },
  });
};

export const hardDeleteCounter = async (id: string) => {
  return await prisma.counter.delete({
    where: { id },
  });
};

export const bulkDeleteCounters = async (ids: string[]) => {
  return await prisma.counter.updateMany({
    where: { id: { in: ids } },
    data: { deletedAt: new Date(), status: 'INACTIVE' },
  });
};
