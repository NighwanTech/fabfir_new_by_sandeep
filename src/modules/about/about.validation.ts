import { z } from 'zod';
import { AboutStatus } from '@prisma/client';

export const createAboutSchema = z.object({
  badge: z.string().optional(),
  headingLine1: z.string().min(1, 'Heading Line 1 is required'),
  headingLine2: z.string().optional(),
  description: z.string().optional(),
  checklist: z.any().optional(),
  images: z.any().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional()
});

export const updateAboutSchema = createAboutSchema.partial();
