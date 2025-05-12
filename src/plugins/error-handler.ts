import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { AppError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

const errorHandler: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation error',
        validationErrors: error.format(),
      });
    }

    // Handle custom app errors
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: reply.statusMessage,
        message: error.message,
        ...(error instanceof ValidationError && error.errors 
          ? { validationErrors: error.errors } 
          : {}),
      });
    }

    // Log unexpected errors
    logger.error({ 
      err: error, 
      request: { 
        method: request.method, 
        url: request.url, 
        params: request.params, 
        query: request.query 
      } 
    }, 'Unhandled error');

    // In production, don't expose internal error details
    const isProduction = process.env.NODE_ENV === 'production';
    
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: isProduction ? 'An unexpected error occurred' : error.message,
      ...(isProduction ? {} : { stack: error.stack }),
    });
  });
};

export default fp(errorHandler);
