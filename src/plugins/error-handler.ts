import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { AppError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

// Função utilitária para obter o nome do erro com base no código de status
function getErrorName(statusCode: number): string {
  const statusMessages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout'
  };
  
  return statusMessages[statusCode] || 'Error';
}

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
        error: getErrorName(error.statusCode),
        message: error.message,
        ...(error instanceof ValidationError && 'errors' in error 
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
