import { z } from 'zod';

export const createMembershipSectionSchema = z.object({
  badge: z.string().min(1, 'Badge is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateMembershipSectionSchema = createMembershipSectionSchema.partial();
