import { build } from './app';
import { envConfig } from './config/env';
import { logger } from './utils/logger';
import { connectToMongoDB, disconnectFromMongoDB, prisma } from './config/database';

const start = async () => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Build Fastify app
    const app = await build();

    // Start server
    await app.listen({ 
      port: envConfig.PORT, 
      host: envConfig.HOST === 'localhost' ? '0.0.0.0' : envConfig.HOST 
    });
    
    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...');
      await app.close();
      await disconnectFromMongoDB();
      await prisma.$disconnect();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
