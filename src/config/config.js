import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().min(1000).max(65535),
  POSTGRESQL_URI: z.string().startsWith("postgresql://"),
});

const parseEnviroment = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      POSTGRESQL_URI: process.env.POSTGRESQL_URI,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("error.errors", error);
    }
    process.exit(1);
  }
};

export const config = parseEnviroment();
export const isDevelopment = config.NODE_ENV === "development";
export const isProduction = config.NODE_ENV === "production";
export const isTest = config.NODE_ENV === "test";
