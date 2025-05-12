import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  
  // PostgreSQL
  DATABASE_URL: z.string(),
  
  // MongoDB
  MONGODB_URI: z.string(),
});

export const envConfig = envSchema.parse(process.env);
