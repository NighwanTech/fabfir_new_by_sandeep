import { z } from 'zod';
import { CounterStatus } from '@prisma/client';

export const createCounterSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  suffix: z.string().optional(),
  icon: z.string().optional(),
  status: z.nativeEnum(CounterStatus).optional(),
  displayOrder: z.number().int().optional(),
});

export const updateCounterSchema = z.object({
  label: z.string().min(1, 'Label is required').optional(),
  value: z.string().min(1, 'Value is required').optional(),
  suffix: z.string().optional(),
  icon: z.string().optional(),
  status: z.nativeEnum(CounterStatus).optional(),
  displayOrder: z.number().int().optional(),
});
