import { z } from 'zod';

export const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required').toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['IMAGE', 'VIDEO']),
  mediaUrl: z.string().min(1, 'Media URL is required'),
  thumbnailUrl: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).default('ACTIVE'),
  displayOrder: z.number().int().min(0).default(0),
});

export const updateGallerySchema = createGallerySchema.partial();
