import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

/**
 * This plugin enables the JSON Schema validation to work properly with Zod schemas
 * It adds serialization and validation capabilities through the Zod type provider
 */
const zodPlugin: FastifyPluginAsync = async (fastify) => {
  // We don't need to do anything special here
  // The ZodTypeProvider will be used directly in the routes 
  // via fastify.withTypeProvider<ZodTypeProvider>()
};

export default fp(zodPlugin, {
  name: 'zod',
  fastify: '5.x',
});
