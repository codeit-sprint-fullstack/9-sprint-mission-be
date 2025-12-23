import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().min(1000).max(65535).default(8080),
  DATABASE_URL: z.string().startsWith("postgresql://"),
  DIRECT_URL: z.string().startsWith("postgresql://"),
  JWT_SECRET: z.string().min(12, "JWT은 최소 12자 이상이어야 합니다."),
  //  Google OAuth Environment
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID가 누락되었습니다."),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, "GOOGLE_CLIENT_SECRET이 누락되었습니다."),
});

type EnvConfig = z.infer<typeof envSchema>;

//config undefined일 가능성을 없애고 ,  에디터 내 자동완성을 위합
const parseEnvironment = (): EnvConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("환경  변수 검증 실패:");
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    });
    process.exit(1);
  }
  return result.data;
};

export const config = parseEnvironment();
export const isDevelopment = config.NODE_ENV === "development";
export const isProduction = config.NODE_ENV === "production";
export const isTest = config.NODE_ENV === "test";
