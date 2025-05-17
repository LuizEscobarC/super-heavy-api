import { z } from 'zod';
import { exerciseSchema } from './exercise.schema';

// WorkoutExercise schemas
export const workoutExerciseSchema = z.object({
  id: z.string().uuid(),
  workoutId: z.string().uuid(),
  exercise: exerciseSchema,
  order: z.number().int().positive(),
  series: z.number().int().positive().default(3),
  reps: z.number().int().positive().default(12),
  weight: z.number().nonnegative().default(0),
  rest: z.number().int().positive().default(60),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const addExerciseToWorkoutSchema = z.object({
  exercise: z.object({
    id: z.string().uuid('Invalid exercise ID'),
    name: z.string().min(3, 'Name must be at least 3 characters'),
    muscle: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
  }),
  order: z.coerce.number().int().positive('Order must be positive'),
  series: z.coerce.number().int().positive().default(3),
  reps: z.coerce.number().int().positive().default(12),
  weight: z.coerce.number().nonnegative().default(0),
  rest: z.coerce.number().int().positive().default(60),
});

export const updateWorkoutExerciseSchema = addExerciseToWorkoutSchema;

export const workoutExerciseItemSchema = z.object({
  exercise: z.object({
    id: z.string().uuid('Invalid exercise ID'),
    name: z.string().min(3, 'Name must be at least 3 characters'),
    muscle: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
  }),
  order: z.coerce.number().int().positive('Order must be positive'),
  series: z.coerce.number().int().positive().default(3),
  reps: z.coerce.number().int().positive().default(12),
  weight: z.coerce.number().nonnegative().default(0),
  rest: z.coerce.number().int().positive().default(60),
});

export const updateWorkoutExercisesSchema = z.object({
  exercises: z.array(workoutExerciseItemSchema)
});

// Workout schemas
export const workoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().nullable().optional(),
  exercises: z.array(workoutExerciseSchema).nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const updateWorkoutSchema = createWorkoutSchema.partial();


// Types for use in controllers and services
export type Workout = z.infer<typeof workoutSchema>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
export type WorkoutExercise = z.infer<typeof workoutExerciseSchema>;
export type AddExerciseToWorkoutInput = z.infer<typeof addExerciseToWorkoutSchema>;
export type UpdateWorkoutExerciseInput = z.infer<typeof updateWorkoutExerciseSchema>;
export type UpdateWorkoutExercisesInput = z.infer<typeof updateWorkoutExercisesSchema>;
