import { z } from 'zod';

export const createProgramSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  image: z.string().min(1, 'Image is required'),
  icon: z.string().min(1, 'Icon is required'),
  isFeatured: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  displayOrder: z.number().int().optional(),
  
  featuredItem1Title: z.string().nullable().optional(),
  featuredItem1Icon: z.string().nullable().optional(),
  featuredItem2Title: z.string().nullable().optional(),
  featuredItem2Icon: z.string().nullable().optional(),
  featuredItem3Title: z.string().nullable().optional(),
  featuredItem3Icon: z.string().nullable().optional(),
  featuredItem4Title: z.string().nullable().optional(),
  featuredItem4Icon: z.string().nullable().optional(),
});

export const updateProgramSchema = createProgramSchema.partial();
