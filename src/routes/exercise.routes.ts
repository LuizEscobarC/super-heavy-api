import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { ExerciseController } from '../controllers/exercise.controller';
import { 
  createExerciseSchema, 
  exerciseSchema, 
  updateExerciseSchema,
  CreateExerciseInput,
  UpdateExerciseInput
} from '../schemas/exercise.schema';
import { z } from 'zod';

const exerciseRoutes: FastifyPluginAsync = async (fastify) => {
  const exerciseController = new ExerciseController();
  
  // Create a new exercise
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: createExerciseSchema,
      response: {
        201: exerciseSchema
      }
    },
    handler: async (request: FastifyRequest<{ Body: CreateExerciseInput }>, reply) => {
      return exerciseController.createExercise(request, reply);
    }
  });

  // Get all exercises
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: z.array(exerciseSchema)
      }
    },
    handler: async (request, reply) => {
      return exerciseController.getAllExercises(request, reply);
    }
  });

  // Get exercise by ID
  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      response: {
        200: exerciseSchema
      }
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      return exerciseController.getExerciseById(request, reply);
    }
  });

  // Get exercise by ID with its workouts
  fastify.route({
    method: 'GET',
    url: '/:id/workouts',
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      response: {
        200: exerciseSchema.extend({
          workouts: z.array(z.object({
            id: z.string().uuid(),
            workoutId: z.string().uuid(),
            workout: z.object({
              id: z.string().uuid(),
              name: z.string(),
              description: z.string().nullable()
            }),
            order: z.number(),
            sets: z.number(),
            reps: z.number()
          }))
        })
      }
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      return exerciseController.getExerciseWithWorkouts(request, reply);
    }
  });

  // Update an exercise
  fastify.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      body: updateExerciseSchema,
      response: {
        200: exerciseSchema
      }
    },
    handler: async (request: FastifyRequest<{ Params: { id: string }, Body: UpdateExerciseInput }>, reply) => {
      return exerciseController.updateExercise(request, reply);
    }
  });

  // Delete an exercise
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      response: {
        204: z.undefined()
      }
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      return exerciseController.deleteExercise(request, reply);
    }
  });
};

export default exerciseRoutes;
