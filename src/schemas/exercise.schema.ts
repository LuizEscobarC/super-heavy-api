import { z } from 'zod';

// Exercise schemas
export const exerciseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createExerciseSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();

// Types for use in controllers and services
export type Exercise = z.infer<typeof exerciseSchema>;
export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
