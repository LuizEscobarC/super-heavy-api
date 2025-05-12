import Fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySensible from '@fastify/sensible';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import { envConfig } from './config/env';
import { logger } from './utils/logger';
import errorHandler from './plugins/error-handler';
import zodPlugin from './plugins/zod';

import workoutRoutes from './routes/workout.routes';
import workoutLogRoutes from './routes/workout-log.routes';
import exerciseRoutes from './routes/exercise.routes';

export const build = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: envConfig.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
            },
          }
        : undefined,
    },
    ignoreTrailingSlash: true,
  }).withTypeProvider<ZodTypeProvider>();

  // Register plugins
  await fastify.register(fastifyCors);
  await fastify.register(fastifyHelmet);
  await fastify.register(fastifySensible);
  
  // Register Zod plugin
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  
  // Custom error handler
  await fastify.register(errorHandler);

  // Swagger documentation
  await fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Workout Tracking API',
        description: 'API for tracking workouts and exercises',
        version: '1.0.0',
      },
      host: `${envConfig.HOST}:${envConfig.PORT}`,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
    transform: jsonSchemaTransform,
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
  });

  // Register routes
  await fastify.register(workoutRoutes, { prefix: '/workouts' });
  await fastify.register(exerciseRoutes, { prefix: '/exercises' });
  await fastify.register(workoutLogRoutes, { prefix: '' });

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });

  return fastify;
};