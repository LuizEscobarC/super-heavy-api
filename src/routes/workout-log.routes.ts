import { FastifyPluginAsync } from 'fastify';
import { WorkoutLogController } from '../controllers/workout-log.controller';
import { addExerciseLogSchema, completeExerciseLogSchema, completeWorkoutSchema, startWorkoutSchema } from '../schemas/workout-log.schema';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const workoutLogRoutes: FastifyPluginAsync = async (fastify) => {
  const workoutLogController = new WorkoutLogController();
  const zodFastify = fastify.withTypeProvider<ZodTypeProvider>();

  // Start a workout (create log)
  zodFastify.post(
    '/workouts/:id/start',
    {
      schema: {
        tags: ['workout-logs'],
        summary: 'Start a workout',
        description: 'Creates a workout log entry to track exercise performance',
        params: z.object({
          id: z.string().uuid()
        }),
        body: startWorkoutSchema,
      },
    },
    workoutLogController.startWorkout.bind(workoutLogController)
  );

  // Complete a workout
  zodFastify.patch(
    '/workouts/:id/logs/:logId/complete',
    {
      schema: {
        tags: ['workout-logs'],
        summary: 'Complete a workout',
        description: 'Marks a workout log as completed',
        params: z.object({
          id: z.string().uuid(),
          logId: z.string(),
        }),
        body: completeWorkoutSchema,
      },
    },
    workoutLogController.completeWorkout.bind(workoutLogController)
  );

  // Add exercise log during workout
  zodFastify.post(
    '/workouts/:id/logs/:logId/exercises',
    {
      schema: {
        tags: ['workout-logs'],
        summary: 'Log exercise performance',
        description: 'Records sets, reps and weight for an exercise during a workout',
        params: z.object({
          id: z.string().uuid(),
          logId: z.string(),
        }),
        body: addExerciseLogSchema,
      },
    },
    workoutLogController.addExerciseLog.bind(workoutLogController)
  );

  // Complete an exercise log
  zodFastify.patch(
    '/workouts/:id/logs/:logId/exercises/:exerciseLogId/complete',
    {
      schema: {
        tags: ['workout-logs'],
        summary: 'Complete an exercise',
        description: 'Marks an exercise log as completed during a workout',
        params: z.object({
          id: z.string().uuid(),
          logId: z.string(),
          exerciseLogId: z.string(),
        }),
        body: completeExerciseLogSchema,
      },
    },
    workoutLogController.completeExerciseLog.bind(workoutLogController)
  );

  // Get all workout logs
  zodFastify.get(
    '/logs',
    {
      schema: {
        tags: ['workout-logs'],
        summary: 'List workout logs',
        description: 'Returns a list of workout logs with optional filtering by workout ID',
        querystring: z.object({
          workoutId: z.string().uuid().optional(),
          limit: z.number().int().default(20),
          page: z.number().int().default(1),
        }),
      },
    },
    workoutLogController.getWorkoutLogs.bind(workoutLogController)
  );

  // Get exercise logs for a workout
  zodFastify.get(
    '/workouts/:id/logs/:logId/exercises',
    {
      schema: {
        tags: ['workout-logs'],
        summary: 'List exercise logs',
        description: 'Returns exercise logs for a specific workout session',
        params: z.object({
          id: z.string().uuid(),
          logId: z.string(),
        }),
      },
    },
    workoutLogController.getExerciseLogs.bind(workoutLogController)
  );
};

export default workoutLogRoutes;
