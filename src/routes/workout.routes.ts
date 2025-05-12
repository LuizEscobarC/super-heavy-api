import { FastifyPluginAsync } from 'fastify';
import { WorkoutController } from '../controllers/workout.controller';
import { createWorkoutSchema, addExerciseToWorkoutSchema, workoutSchema } from '../schemas/workout.schema';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

const workoutRoutes: FastifyPluginAsync = async (fastify) => {
  const workoutController = new WorkoutController();
  const zodFastify = fastify.withTypeProvider<ZodTypeProvider>();

  // Create a new workout
  zodFastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: createWorkoutSchema,
      response: {
        201: workoutSchema
      }
    },
    handler: async (request, reply) => {
      const typedRequest = request as any;
      return workoutController.createWorkout(typedRequest, reply);
    }
  });

};

export default workoutRoutes;
