import { z } from 'zod';
import { AssessmentStatus } from '@prisma/client';

export const createAssessmentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.coerce.number().int().positive().max(120),
  gender: z.string().min(1, "Gender is required"),
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  activityLevel: z.string().min(1, "Activity level is required"),
  primaryGoal: z.string().min(1, "Primary goal is required"),
  experience: z.string().min(1, "Experience is required"),
  frequency: z.string().min(1, "Frequency is required"),
  equipment: z.string().min(1, "Equipment is required"),
  cardio: z.string().min(1, "Cardio is required"),
  occupation: z.string().min(1, "Occupation is required"),
  steps: z.string().min(1, "Steps is required"),
  sleep: z.string().min(1, "Sleep is required"),
  stress: z.string().min(1, "Stress is required"),
  diet: z.string().min(1, "Diet is required"),
  meals: z.string().min(1, "Meals is required"),
  alcohol: z.string().min(1, "Alcohol is required"),
  tobacco: z.string().min(1, "Tobacco is required"),
  supplements: z.string().optional(),
  conditions: z.string().min(1, "Conditions is required"),
  medications: z.string().min(1, "Medications is required"),
  injuries: z.string().min(1, "Injuries is required"),
  allergies: z.string().min(1, "Allergies is required"),
  waist: z.string().min(1, "Waist is required"),
  commitmentLevel: z.coerce.number().int().min(1).max(10),
  notes: z.string().optional(),
  bloodReportUrl: z.string().optional(),
  physiqueImageUrl: z.string().optional()
});

export const updateAssessmentSchema = z.object({
  status: z.nativeEnum(AssessmentStatus).optional(),
  notes: z.string().optional()
});
