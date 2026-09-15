import { z } from 'zod';
import { HeroStatus } from '@prisma/client';

export const createHeroSchema = z.object({
  badge: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  primaryButtonText: z.string().optional(),
  primaryButtonLink: z.string().optional(),
  secondaryButtonText: z.string().optional(),
  secondaryButtonLink: z.string().optional(),
  backgroundImage: z.string().optional(),
  foregroundImage: z.string().optional(),
  status: z.nativeEnum(HeroStatus).optional(),
  displayOrder: z.number().int().optional()
});

export const updateHeroSchema = createHeroSchema.partial();
