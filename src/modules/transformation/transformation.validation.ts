import { z } from 'zod';

export const createTransformationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    subtitle: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    beforeImage: z.string().min(1, 'Before Image is required'),
    afterImage: z.string().min(1, 'After Image is required'),
    highlights: z.array(z.string()).optional().nullable(),
    stat1Value: z.string().optional().nullable(),
    stat1Label: z.string().optional().nullable(),
    stat2Value: z.string().optional().nullable(),
    stat2Label: z.string().optional().nullable(),
    showInMain: z.boolean().optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional(),
    displayOrder: z.number().int().optional(),
  }),
});

export const updateTransformationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    subtitle: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    beforeImage: z.string().optional(),
    afterImage: z.string().optional(),
    highlights: z.array(z.string()).optional().nullable(),
    stat1Value: z.string().optional().nullable(),
    stat1Label: z.string().optional().nullable(),
    stat2Value: z.string().optional().nullable(),
    stat2Label: z.string().optional().nullable(),
    showInMain: z.boolean().optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional(),
    displayOrder: z.number().int().optional(),
  }),
});
