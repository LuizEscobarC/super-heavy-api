import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { WorkoutController } from '../controllers/workout.controller';
import { 
  createWorkoutSchema, 
  addExerciseToWorkoutSchema, 
  workoutSchema, 
  CreateWorkoutInput,
  updateWorkoutExercisesSchema,
  UpdateWorkoutExercisesInput,
  UpdateWorkoutExerciseInput,
  updateWorkoutExerciseSchema
} from '../schemas/workout.schema';
import { z } from 'zod';
import { add } from 'date-fns';

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

  // Update all exercises for a workout
  fastify.route({
    method: 'PUT',
    url: '/:id/exercises',
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      body: updateWorkoutExercisesSchema,
      response: {
        200: z.object({
          count: z.number()
        })
      }
    },
    handler: async (request: FastifyRequest<{ Params: { id: string }, Body: UpdateWorkoutExercisesInput }>, reply) => {
      return workoutController.updateWorkoutExercises(request, reply);
    }
  });

  // Update workout exercise by ID
  fastify.route({
    method: 'PUT',
    url: '/:workoutId/exercises/:id',
    schema: {
      params: z.object({
        workoutId: z.string().uuid(),
        id: z.string().uuid()
      }),
      body: updateWorkoutExerciseSchema,
      response: {
        200: z.object({
          id: z.string().uuid(),
          exerciseId: z.string().uuid(),
          order: z.number(),
          series: z.number(),
          reps: z.number(),
          weight: z.number(),
          rest: z.number()
        })
      }
    },
    handler: async (request: FastifyRequest<{ Params: { workoutId: string, id: string }, Body: UpdateWorkoutExerciseInput }>, reply) => {
      return workoutController.updateWorkoutExercise(request, reply);
    }
  });

  // Delete workout by ID
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      response: {
        204: z.void()
      }
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      return workoutController.deleteWorkout(request, reply);
    }
  });


  // Delete workout exercise by ID
  fastify.route({
    method: 'DELETE',
    url: '/:workoutId/exercises/:id',
    schema: {
      params: z.object({
        workoutId: z.string().uuid(),
        id: z.string().uuid()
      }),
      response: {
        204: z.void()
      }
    },
    handler: async (request: FastifyRequest<{ Params: { workoutId: string, id: string } }>, reply) => {
      return await workoutController.deleteWorkoutExercise(request, reply);
    }
  });
};

export default workoutRoutes;
