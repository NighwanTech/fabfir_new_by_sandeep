import { z } from 'zod';

export const createTransformationSectionSchema = z.object({
  body: z.object({
    badge: z.string().min(1, 'Badge is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    backgroundImage: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional(),
  }),
});

export const updateTransformationSectionSchema = z.object({
  body: z.object({
    badge: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    backgroundImage: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional(),
  }),
});
