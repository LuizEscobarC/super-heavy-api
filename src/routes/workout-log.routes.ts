import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { WorkoutLogController } from '../controllers/workout-log.controller';
import { addExerciseLogSchema, completeExerciseLogSchema, completeWorkoutSchema, responseWorkoutLogSchema, startWorkoutSchema } from '../schemas/workout-log.schema';
import { z } from 'zod';

const workoutLogRoutes: FastifyPluginAsync = async (fastify) => {
  const workoutLogController = new WorkoutLogController();

  // Start a workout (create log)
  fastify.route({
    method: 'POST',
    url: '/workouts/:id/start',
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      body: startWorkoutSchema,
      response: {
        201: responseWorkoutLogSchema,
      }
    },
    handler: async (request, reply) => {
      const typedRequest = request as any;
      return workoutLogController.startWorkout(typedRequest, reply);
    }
  });

  // Complete a workout
  fastify.route({
    method: 'PATCH',
    url: '/workouts/:id/logs/:logId/complete',
    schema: {
      params: z.object({
        id: z.string().uuid(),
        logId: z.string(),
      }),
      body: completeWorkoutSchema,
    },
    handler: async (request, reply) => {
      const typedRequest = request as any;
      return workoutLogController.completeWorkout(typedRequest, reply);
    }
  });

  // Add exercise log during workout
  fastify.route({
    method: 'POST',
    url: '/workouts/:id/logs/:logId/exercises',
    schema: {
      params: z.object({
        id: z.string().uuid(),
        logId: z.string(),
      }),
      body: addExerciseLogSchema,
    },
    handler: async (request, reply) => {
      const typedRequest = request as any;
      return workoutLogController.addExerciseLog(typedRequest, reply);
    }
  });

  // Complete an exercise log
  fastify.route({
    method: 'PATCH',
    url: '/workouts/:id/logs/:logId/exercises/:exerciseLogId/complete',
    schema: {
      params: z.object({
        id: z.string().uuid(),
        logId: z.string(),
        exerciseLogId: z.string(),
      }),
      body: completeExerciseLogSchema,
    },
    handler: async (request, reply) => {
      const typedRequest = request as any;
      return workoutLogController.completeExerciseLog(typedRequest, reply);
    }
  });

  // Get all workout logs
  fastify.route({
    method: 'GET',
    url: '/logs',
    schema: {
      querystring: z.object({
        workoutId: z.string().uuid().optional(),
        limit: z.number().int().default(20),
        page: z.number().int().default(1),
      }),
    },
    handler: async (request, reply) => {
      const typedRequest = request as any;
      return workoutLogController.getWorkoutLogs(typedRequest, reply);
    }
  });

  // Get exercise logs for a workout
  fastify.route({
    method: 'GET',
    url: '/workouts/:id/logs/:logId',
    schema: {
      params: z.object({
        id: z.string().uuid(),
        logId: z.string(),
      }),
    },
    handler: async (request, reply) => {
      const typedRequest = request as any;
      return workoutLogController.getExerciseLogs(typedRequest, reply);
    }
  });

  // await superHeavyApi.get(`${STORAGE_KEY}/${workoutId}/has-in-progress`);
  fastify.route({
    method: 'GET',
    url: '/workouts/:id/in-progress-workout',
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
      response: {
        200: responseWorkoutLogSchema,
      }
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      return workoutLogController.getWorkoutInProgress(request, reply);
    }
  });
};

export default workoutLogRoutes;
