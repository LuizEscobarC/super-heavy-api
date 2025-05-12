import { z } from 'zod';

// WorkoutLog schemas
export const workoutLogSchema = z.object({
  id: z.string(),
  workoutId: z.string().uuid(),
  startTime: z.date(),
  endTime: z.date().nullable().optional(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'CANCELED']),
  notes: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const startWorkoutSchema = z.object({
  notes: z.string().optional(),
});

export const completeWorkoutSchema = z.object({
  notes: z.string().optional(),
});

// ExerciseLog schemas
export const exerciseSetSchema = z.object({
  weight: z.number().nonnegative('Weight must be non-negative'),
  reps: z.number().int().positive('Reps must be positive'),
  completed: z.boolean().default(true),
  timestamp: z.date().optional().default(() => new Date()),
});

export const exerciseLogSchema = z.object({
  id: z.string(),
  workoutLogId: z.string(),
  exerciseId: z.string().uuid(),
  workoutExerciseId: z.string().uuid(),
  sets: z.array(exerciseSetSchema),
  notes: z.string().nullable().optional(),
  completed: z.boolean().default(false),
  completedAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const addExerciseLogSchema = z.object({
  exerciseId: z.string().uuid('Invalid exercise ID'),
  workoutExerciseId: z.string().uuid('Invalid workout exercise ID'),
  sets: z.array(
    z.object({
      weight: z.number().nonnegative('Weight must be non-negative'),
      reps: z.number().int().positive('Reps must be positive'),
      completed: z.boolean().default(true),
    })
  ),
  notes: z.string().optional(),
});

export const completeExerciseLogSchema = z.object({
  notes: z.string().optional(),
});

// Types for use in controllers and services
export type WorkoutLog = z.infer<typeof workoutLogSchema>;
export type StartWorkoutInput = z.infer<typeof startWorkoutSchema>;
export type CompleteWorkoutInput = z.infer<typeof completeWorkoutSchema>;
export type ExerciseSet = z.infer<typeof exerciseSetSchema>;
export type ExerciseLog = z.infer<typeof exerciseLogSchema>;
export type AddExerciseLogInput = z.infer<typeof addExerciseLogSchema>;
export type CompleteExerciseLogInput = z.infer<typeof completeExerciseLogSchema>;
