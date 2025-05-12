import { z } from 'zod';

// Workout schemas
export const workoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createWorkoutSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
});

export const updateWorkoutSchema = createWorkoutSchema.partial();

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

// WorkoutExercise schemas
export const workoutExerciseSchema = z.object({
  id: z.string().uuid(),
  workoutId: z.string().uuid(),
  exerciseId: z.string().uuid(),
  order: z.number().int().positive(),
  sets: z.number().int().positive().default(3),
  reps: z.number().int().positive().default(12),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const addExerciseToWorkoutSchema = z.object({
  exerciseId: z.string().uuid('Invalid exercise ID'),
  order: z.number().int().positive('Order must be positive'),
  sets: z.number().int().positive().default(3),
  reps: z.number().int().positive().default(12),
});

// Types for use in controllers and services
export type Workout = z.infer<typeof workoutSchema>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type WorkoutExercise = z.infer<typeof workoutExerciseSchema>;
export type AddExerciseToWorkoutInput = z.infer<typeof addExerciseToWorkoutSchema>;
