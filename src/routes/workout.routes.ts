import { FastifyPluginAsync } from 'fastify';
import { WorkoutController } from '../controllers/workout.controller';
import { createWorkoutSchema, addExerciseToWorkoutSchema } from '../schemas/workout.schema';

const workoutRoutes: FastifyPluginAsync = async (fastify) => {
  const workoutController = new WorkoutController();

  // Create a new workout
  fastify.post('/', {
    schema: {
      tags: ['workouts'],
      summary: 'Create a new workout',
      description: 'Creates a new workout with name and description',
      body: createWorkoutSchema,
    },
    handler: workoutController.createWorkout.bind(workoutController),
  });

  // Get all workouts
  fastify.get('/', {
    schema: {
      tags: ['workouts'],
      summary: 'List all workouts',
      description: 'Returns a list of all workouts',
    },
    handler: workoutController.getAllWorkouts.bind(workoutController),
  });

  // Get workout by ID with exercises
  fastify.get('/:id', {
    schema: {
      tags: ['workouts'],
      summary: 'Get workout details',
      description: 'Returns workout details by ID including its exercises',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
    },
    handler: workoutController.getWorkoutById.bind(workoutController),
  });

  // Add exercise to workout
  fastify.post('/:id/exercises', {
    schema: {
      tags: ['workouts'],
      summary: 'Add exercise to workout',
      description: 'Adds an existing exercise to a workout with order and repetitions',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      body: addExerciseToWorkoutSchema,
    },
    handler: workoutController.addExerciseToWorkout.bind(workoutController),
  });
};

export default workoutRoutes;
