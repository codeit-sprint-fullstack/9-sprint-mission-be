import { z } from 'zod';

const envSchema = z.object({
  ENVIRONMENT: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().min(1000).max(65535),
  MONGO_URI: z.string().startsWith('mongodb+srv://'),
});

const parseEnvironment = () => {
  try {
    return envSchema.parse({
      ENVIRONMENT: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('error.errors', error);
    }
    process.exit(1);
  }
};

export const config = parseEnvironment();

export const isDevelopment = () => config.NODE_ENV === 'development';
export const isProduction = () => config.NODE_ENV === 'production';
export const isTest = () => config.NODE_ENV === 'test';
