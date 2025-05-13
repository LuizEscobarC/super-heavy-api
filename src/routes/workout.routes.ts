import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { WorkoutController } from '../controllers/workout.controller';
import { createWorkoutSchema, addExerciseToWorkoutSchema, workoutSchema, CreateWorkoutInput } from '../schemas/workout.schema';
import { z } from 'zod';

const workoutRoutes: FastifyPluginAsync = async (fastify) => {
  const workoutController = new WorkoutController();
  // Create a new workout
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: createWorkoutSchema,
      response: {
        201: workoutSchema
      }
    },
    handler: async (request: FastifyRequest<{ Body: CreateWorkoutInput }>, reply) => {
      return workoutController.createWorkout(request, reply);
    }
  });

  // Get all workouts
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: z.array(workoutSchema)
      }
    },
    handler: async (request, reply) => {
      return workoutController.getAllWorkouts(request, reply);
    }
  });

  // Get workout by ID with exercises
  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
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
              muscle: z.string().nullable(),
              description: z.string().nullable()
            }),
            order: z.number(),
            series: z.number(),
            reps: z.number(),
            weight: z.number(),
            rest: z.number()
          })).optional()
        })
      }
    },
    handler: async (request, reply) => {
      const typedRequest = request as any;
      return workoutController.getWorkoutById(typedRequest, reply);
    }
  });

  // Add exercise to workout
  fastify.route({
    method: 'POST',
    url: '/:id/exercises',
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      body: addExerciseToWorkoutSchema,
      response: {
        201: z.object({
          id: z.string().uuid(),
          workoutId: z.string().uuid(),
          exerciseId: z.string().uuid(),
          order: z.number(),
          series: z.number(),
          reps: z.number(),
          weight: z.number(),
          rest: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
        })
      }
    },
    handler: async (request, reply) => {
      const typedRequest = request as any;
      return workoutController.addExerciseToWorkout(typedRequest, reply);
    }
  });

  // Get exercises for a workout
  fastify.route({
    method: 'GET',
    url: '/:id/exercises',
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      response: {
        200: z.array(z.object({
          id: z.string().uuid(),
          exerciseId: z.string().uuid(),
          exercise: z.object({
            id: z.string().uuid(),
            name: z.string(),
            muscle: z.string().nullable(),
            description: z.string().nullable()
          }),
          order: z.number(),
          series: z.number(),
          reps: z.number(),
          weight: z.number(),
          rest: z.number()
        }))
      }
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      return workoutController.getWorkoutExercises(request, reply);
    }
  });

  // ´PUT´ workout by ID
  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      body: createWorkoutSchema,
      response: {
        200: workoutSchema
      }
    },
    handler: async (request: FastifyRequest<{ Params: { id: string }, Body: CreateWorkoutInput }>, reply) => {
      const typedRequest = request as any;
      return workoutController.updateWorkout(typedRequest, reply);
    }
  });
};

export default workoutRoutes;
