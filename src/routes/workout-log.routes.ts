import { FastifyPluginAsync } from 'fastify';
import { WorkoutLogController } from '../controllers/workout-log.controller';
import { addExerciseLogSchema, completeExerciseLogSchema, completeWorkoutSchema, startWorkoutSchema } from '../schemas/workout-log.schema';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const workoutLogRoutes: FastifyPluginAsync = async (fastify) => {
  const workoutLogController = new WorkoutLogController();
  const zodFastify = fastify.withTypeProvider<ZodTypeProvider>();

  // Start a workout (create log)
  // zodFastify.route({
  //   method: 'POST',
  //   url: '/workouts/:id/start',
  //   schema: {
  //     params: z.object({
  //       id: z.string().uuid()
  //     }),
  //     body: startWorkoutSchema,
  //   },
  //   handler: async (request, reply) => {
  //     const typedRequest = request as any;
  //     return workoutLogController.startWorkout(typedRequest, reply);
  //   }
  // });

  // // Complete a workout
  // zodFastify.route({
  //   method: 'PATCH',
  //   url: '/workouts/:id/logs/:logId/complete',
  //   schema: {
  //     params: z.object({
  //       id: z.string().uuid(),
  //       logId: z.string(),
  //     }),
  //     body: completeWorkoutSchema,
  //   },
  //   handler: async (request, reply) => {
  //     const typedRequest = request as any;
  //     return workoutLogController.completeWorkout(typedRequest, reply);
  //   }
  // });

  // // Add exercise log during workout
  // zodFastify.route({
  //   method: 'POST',
  //   url: '/workouts/:id/logs/:logId/exercises',
  //   schema: {
  //     params: z.object({
  //       id: z.string().uuid(),
  //       logId: z.string(),
  //     }),
  //     body: addExerciseLogSchema,
  //   },
  //   handler: async (request, reply) => {
  //     const typedRequest = request as any;
  //     return workoutLogController.addExerciseLog(typedRequest, reply);
  //   }
  // });

  // // Complete an exercise log
  // zodFastify.route({
  //   method: 'PATCH',
  //   url: '/workouts/:id/logs/:logId/exercises/:exerciseLogId/complete',
  //   schema: {
  //     params: z.object({
  //       id: z.string().uuid(),
  //       logId: z.string(),
  //       exerciseLogId: z.string(),
  //     }),
  //     body: completeExerciseLogSchema,
  //   },
  //   handler: async (request, reply) => {
  //     const typedRequest = request as any;
  //     return workoutLogController.completeExerciseLog(typedRequest, reply);
  //   }
  // });

  // // Get all workout logs
  // zodFastify.route({
  //   method: 'GET',
  //   url: '/logs',
  //   schema: {
  //     querystring: z.object({
  //       workoutId: z.string().uuid().optional(),
  //       limit: z.number().int().default(20),
  //       page: z.number().int().default(1),
  //     }),
  //   },
  //   handler: async (request, reply) => {
  //     const typedRequest = request as any;
  //     return workoutLogController.getWorkoutLogs(typedRequest, reply);
  //   }
  // });

  // // Get exercise logs for a workout
  // zodFastify.route({
  //   method: 'GET',
  //   url: '/workouts/:id/logs/:logId',
  //   schema: {
  //     params: z.object({
  //       id: z.string().uuid(),
  //       logId: z.string(),
  //     }),
  //   },
  //   handler: async (request, reply) => {
  //     const typedRequest = request as any;
  //     return workoutLogController.getExerciseLogs(typedRequest, reply);
  //   }
  // });
};

export default workoutLogRoutes;
