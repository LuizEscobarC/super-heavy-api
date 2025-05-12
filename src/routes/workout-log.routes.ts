import { FastifyPluginAsync } from 'fastify';
import { WorkoutLogController } from '../controllers/workout-log.controller';
import { 
  startWorkoutSchema, 
  completeWorkoutSchema, 
  addExerciseLogSchema, 
  completeExerciseLogSchema 
} from '../schemas/workout-log.schema';

const workoutLogRoutes: FastifyPluginAsync = async (fastify) => {
  const workoutLogController = new WorkoutLogController();

  // Start a workout (create log)
  fastify.post('/workouts/:id/start', {
    schema: {
      tags: ['workout-logs'],
      summary: 'Start a workout',
      description: 'Creates a workout log entry to track exercise performance',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      body: startWorkoutSchema,
    },
    handler: workoutLogController.startWorkout.bind(workoutLogController),
  });

  // Complete a workout
  fastify.patch('/workouts/:id/logs/:logId/complete', {
    schema: {
      tags: ['workout-logs'],
      summary: 'Complete a workout',
      description: 'Marks a workout log as completed',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          logId: { type: 'string' },
        },
        required: ['id', 'logId'],
      },
      body: completeWorkoutSchema,
    },
    handler: workoutLogController.completeWorkout.bind(workoutLogController),
  });

  // Add exercise log during workout
  fastify.post('/workouts/:id/logs/:logId/exercises', {
    schema: {
      tags: ['workout-logs'],
      summary: 'Log exercise performance',
      description: 'Records sets, reps and weight for an exercise during a workout',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          logId: { type: 'string' },
        },
        required: ['id', 'logId'],
      },
      body: addExerciseLogSchema,
    },
    handler: workoutLogController.addExerciseLog.bind(workoutLogController),
  });

  // Complete an exercise log
  fastify.patch('/workouts/:id/logs/:logId/exercises/:exerciseLogId/complete', {
    schema: {
      tags: ['workout-logs'],
      summary: 'Complete an exercise',
      description: 'Marks an exercise log as completed during a workout',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          logId: { type: 'string' },
          exerciseLogId: { type: 'string' },
        },
        required: ['id', 'logId', 'exerciseLogId'],
      },
      body: completeExerciseLogSchema,
    },
    handler: workoutLogController.completeExerciseLog.bind(workoutLogController),
  });

  // Get all workout logs
  fastify.get('/logs', {
    schema: {
      tags: ['workout-logs'],
      summary: 'List workout logs',
      description: 'Returns a list of workout logs with optional filtering by workout ID',
      querystring: {
        type: 'object',
        properties: {
          workoutId: { type: 'string', format: 'uuid' },
          limit: { type: 'integer', default: 20 },
          page: { type: 'integer', default: 1 },
        },
      },
    },
    handler: workoutLogController.getWorkoutLogs.bind(workoutLogController),
  });

  // Get exercise logs for a workout
  fastify.get('/workouts/:id/logs/:logId/exercises', {
    schema: {
      tags: ['workout-logs'],
      summary: 'List exercise logs',
      description: 'Returns exercise logs for a specific workout session',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          logId: { type: 'string' },
        },
        required: ['id', 'logId'],
      },
    },
    handler: workoutLogController.getExerciseLogs.bind(workoutLogController),
  });
};

export default workoutLogRoutes;
