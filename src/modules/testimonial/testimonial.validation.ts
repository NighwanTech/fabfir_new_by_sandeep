import { z } from 'zod';
import { TestimonialStatus } from '@prisma/client';

export const createTestimonialSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    profession: z.string().min(1, 'Profession is required'),
    quote: z.string().min(1, 'Quote is required'),
    image: z.string().optional().nullable(),

    stat1Value: z.string().optional().nullable(),
    stat1Label: z.string().optional().nullable(),
    stat1Icon: z.string().optional().nullable(),
    stat2Value: z.string().optional().nullable(),
    stat2Label: z.string().optional().nullable(),
    stat2Icon: z.string().optional().nullable(),
    stat3Value: z.string().optional().nullable(),
    stat3Label: z.string().optional().nullable(),
    stat3Icon: z.string().optional().nullable(),

    status: z.nativeEnum(TestimonialStatus).default('ACTIVE'),
    displayOrder: z.number().int().min(0).default(0),
  }),
});

export const updateTestimonialSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid testimonial ID'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    profession: z.string().min(1).optional(),
    quote: z.string().min(1).optional(),
    image: z.string().optional().nullable(),

    stat1Value: z.string().optional().nullable(),
    stat1Label: z.string().optional().nullable(),
    stat1Icon: z.string().optional().nullable(),
    stat2Value: z.string().optional().nullable(),
    stat2Label: z.string().optional().nullable(),
    stat2Icon: z.string().optional().nullable(),
    stat3Value: z.string().optional().nullable(),
    stat3Label: z.string().optional().nullable(),
    stat3Icon: z.string().optional().nullable(),

    status: z.nativeEnum(TestimonialStatus).optional(),
    displayOrder: z.number().int().min(0).optional(),
  }),
});
