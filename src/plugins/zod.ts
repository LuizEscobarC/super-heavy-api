import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

/**
 * This plugin enables Zod for fastify type-provider functionality
 * 
 * This plugin doesn't need to do anything special, as the ZodTypeProvider
 * is used directly in the routes via fastify.withTypeProvider<ZodTypeProvider>()
 */
const zodPlugin: FastifyPluginAsync = async (fastify) => {
  // Nothing to do here - the ZodTypeProvider is used directly in routes
};

export default fp(zodPlugin, {
  name: 'zod',
  fastify: '5.x',
});
