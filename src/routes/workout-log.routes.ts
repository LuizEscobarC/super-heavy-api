import { FastifyPluginAsync } from 'fastify';
import { WorkoutLogController } from '../controllers/workout-log.controller';
import { addExerciseLogSchema, completeExerciseLogSchema, completeWorkoutSchema, startWorkoutSchema } from '../schemas/workout-log.schema';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const workoutLogRoutes: FastifyPluginAsync = async (fastify) => {
  const workoutLogController = new WorkoutLogController();
  const zodFastify = fastify.withTypeProvider<ZodTypeProvider>();

  // Start a workout (create log)
 
};

export default workoutLogRoutes;
