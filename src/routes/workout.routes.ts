import { FastifyPluginAsync } from 'fastify';
import { WorkoutController } from '../controllers/workout.controller';
import { createWorkoutSchema, addExerciseToWorkoutSchema, workoutSchema } from '../schemas/workout.schema';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

const workoutRoutes: FastifyPluginAsync = async (fastify) => {
  const workoutController = new WorkoutController();
  // Use the type provider consistently
  const zodFastify = fastify.withTypeProvider<ZodTypeProvider>();

  // Create a new workout
  zodFastify.post(
    '/',
    {
      schema: {
        tags: ['workouts'],
        summary: 'Create a new workout',
        description: 'Creates a new workout with name and description',
        body: createWorkoutSchema,
        response: {
          201: workoutSchema
        }
      }
    }, 
    async (request, reply) => {
      return workoutController.createWorkout(request, reply);
    }
  );

  // Get all workouts
  zodFastify.get(
    '/', 
    {
      schema: {
        tags: ['workouts'],
        summary: 'List all workouts',
        description: 'Returns a list of all workouts',
        response: {
          200: z.array(workoutSchema)
        }
      }
    }, 
    async (request, reply) => {
      return workoutController.getAllWorkouts(request, reply);
    }
  );

  // Get workout by ID with exercises
  zodFastify.get(
    '/:id', 
    {
      schema: {
        tags: ['workouts'],
        summary: 'Get workout details',
        description: 'Returns workout details by ID including its exercises',
        params: z.object({
          id: z.string().uuid()
        }),
        response: {
          200: workoutSchema.extend({
            exercises: z.array(z.object({
              id: z.string().uuid(),
              exerciseId: z.string().uuid(),
              exercise: z.object({
                id: z.string().uuid(),
                name: z.string(),
                description: z.string().nullable()
              }),
              order: z.number(),
              sets: z.number(),
              reps: z.number()
            })).optional()
          })
        }
      }
    }, 
    async (request, reply) => {
      return workoutController.getWorkoutById(request, reply);
    }
  );

  // Add exercise to workout - Convert this to use ZodTypeProvider too
  zodFastify.post(
    '/:id/exercises',
    {
      schema: {
        tags: ['workouts'],
        summary: 'Add exercise to workout',
        description: 'Adds an existing exercise to a workout with order and repetitions',
        params: z.object({
          id: z.string().uuid()
        }),
        body: addExerciseToWorkoutSchema
      }
    },
    async (request, reply) => {
      return workoutController.addExerciseToWorkout(request, reply);
    }
  );
};

export default workoutRoutes;
