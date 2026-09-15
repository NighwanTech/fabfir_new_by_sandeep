import { z } from 'zod';

export const createProgramHighlightSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  displayOrder: z.number().int().optional(),
});

export const updateProgramHighlightSchema = createProgramHighlightSchema.partial();
