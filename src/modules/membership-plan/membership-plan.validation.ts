import { z } from 'zod';
import { PlanStatus } from '@prisma/client';

export const featureSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  icon: z.string().optional().nullable(),
  status: z.nativeEnum(PlanStatus).default('ACTIVE'),
  displayOrder: z.number().int().min(0).default(0),
});

export const createMembershipPlanSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    duration: z.number().int().positive('Duration must be positive'),
    price: z.number().positive('Price must be positive'),
    pricePeriod: z.string().min(1, 'Price period is required'),
    isPopular: z.boolean().default(false),
    enquiryText: z.string().min(1, 'Enquiry text is required'),
    enquiryLink: z.string().min(1, 'Enquiry link is required'),
    status: z.nativeEnum(PlanStatus).default('ACTIVE'),
    displayOrder: z.number().int().min(0).default(0),
    features: z.array(featureSchema).optional().default([]),
  }),
});

export const updateMembershipPlanSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid plan ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    duration: z.number().int().positive('Duration must be positive').optional(),
    price: z.number().positive('Price must be positive').optional(),
    pricePeriod: z.string().min(1, 'Price period is required').optional(),
    isPopular: z.boolean().optional(),
    enquiryText: z.string().min(1, 'Enquiry text is required').optional(),
    enquiryLink: z.string().min(1, 'Enquiry link is required').optional(),
    status: z.nativeEnum(PlanStatus).optional(),
    displayOrder: z.number().int().min(0).optional(),
    features: z.array(featureSchema).optional(),
  }),
});

export const createFeatureSchema = z.object({
  params: z.object({
    planId: z.string().uuid('Invalid plan ID'),
  }),
  body: featureSchema.omit({ id: true }),
});

export const updateFeatureSchema = z.object({
  params: z.object({
    planId: z.string().uuid('Invalid plan ID'),
    featureId: z.string().uuid('Invalid feature ID'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    icon: z.string().optional().nullable(),
    status: z.nativeEnum(PlanStatus).optional(),
    displayOrder: z.number().int().min(0).optional(),
  }),
});
