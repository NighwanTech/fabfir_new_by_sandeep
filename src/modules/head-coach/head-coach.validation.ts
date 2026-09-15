import { z } from 'zod';
import { HeadCoachStatus } from '@prisma/client';

export const createHeadCoachSchema = z.object({
  body: z.object({
    coachName: z.string().min(1, 'Coach name is required'),
    label: z.string().min(1, 'Label is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    heading: z.string().min(1, 'Heading is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().min(1, 'Image is required'),
    badgeText: z.string().optional().nullable(),
    ctaText: z.string().min(1, 'CTA Text is required'),
    ctaLink: z.string().min(1, 'CTA Link is required'),
    status: z.nativeEnum(HeadCoachStatus).optional()
  }),
});

export const updateHeadCoachSchema = z.object({
  body: z.object({
    coachName: z.string().optional(),
    label: z.string().optional(),
    subtitle: z.string().optional(),
    heading: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    badgeText: z.string().optional().nullable(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    status: z.nativeEnum(HeadCoachStatus).optional()
  }),
});
