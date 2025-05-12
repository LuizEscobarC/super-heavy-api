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
    // schema: {
    //   body: createWorkoutSchema,
    //   response: {
    //     201: workoutSchema
    //   }
    // },
    handler: async (request, reply) => {
      const typedRequest = request as any;
      return workoutController.createWorkout(typedRequest, reply);
    }
  });

  // Get all workouts
  // zodFastify.route({
  //   method: 'GET',
  //   url: '/',
  //   schema: {
  //     response: {
  //       200: z.array(workoutSchema)
  //     }
  //   },
  //   handler: async (request, reply) => {
  //     return workoutController.getAllWorkouts(request, reply);
  //   }
  // });

  // // Get workout by ID with exercises
  // zodFastify.route({
  //   method: 'GET',
  //   url: '/:id',
  //   schema: {
  //     params: z.object({
  //       id: z.string().uuid()
  //     }),
  //     response: {
  //       200: workoutSchema.extend({
  //         exercises: z.array(z.object({
  //           id: z.string().uuid(),
  //           exerciseId: z.string().uuid(),
  //           exercise: z.object({
  //             id: z.string().uuid(),
  //             name: z.string(),
  //             description: z.string().nullable()
  //           }),
  //           order: z.number(),
  //           sets: z.number(),
  //           reps: z.number()
  //         })).optional()
  //       })
  //     }
  //   },
  //   handler: async (request, reply) => {
  //     const typedRequest = request as any;
  //     return workoutController.getWorkoutById(typedRequest, reply);
  //   }
  // });

  // // Add exercise to workout
  // zodFastify.route({
  //   method: 'POST',
  //   url: '/:id/exercises',
  //   schema: {
  //     params: z.object({
  //       id: z.string().uuid()
  //     }),
  //     body: addExerciseToWorkoutSchema,
  //     response: {
  //       201: z.object({
  //         id: z.string().uuid(),
  //         workoutId: z.string().uuid(),
  //         exerciseId: z.string().uuid(),
  //         order: z.number(),
  //         sets: z.number(),
  //         reps: z.number(),
  //         createdAt: z.date(),
  //         updatedAt: z.date(),
  //       })
  //     }
  //   },
  //   handler: async (request, reply) => {
  //     const typedRequest = request as any;
  //     return workoutController.addExerciseToWorkout(typedRequest, reply);
  //   }
  // });
};

export default workoutRoutes;
