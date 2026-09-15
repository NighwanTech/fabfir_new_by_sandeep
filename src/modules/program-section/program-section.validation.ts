import { z } from 'zod';

export const createProgramSectionSchema = z.object({
  badge: z.string().min(1, 'Badge is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).optional(),
});

export const updateProgramSectionSchema = createProgramSectionSchema.partial();
