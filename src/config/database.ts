import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { envConfig } from './env';

export const prisma = new PrismaClient({
  log: envConfig.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envConfig.MONGODB_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error({ error }, 'Failed to connect to MongoDB');
    process.exit(1);
  }
};

export const disconnectFromMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error({ error }, 'Failed to disconnect from MongoDB');
  }
};
