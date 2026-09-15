import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    specialization: z.string().min(1, 'Specialization is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().min(1, 'Image is required'),
    instagramUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    facebookUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional(),
    displayOrder: z.number().int().optional(),
  }),
});

export const updateTeamMemberSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    specialization: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    instagramUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    facebookUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional(),
    displayOrder: z.number().int().optional(),
  }),
});
