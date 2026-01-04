import { OAS3Definition, Options } from "swagger-jsdoc";
import { config } from "./config";
import path from "path";

const rootPath = process.cwd();

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "PandaMarket API Documentation",
    version: "1.0.0",
    description: "판다마켓 API 문서입니다.",
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}`,
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
        description: "AccessToken 쿠키를 통해 인증이 진행됩니다.",
      },
      refreshTokenAuth: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description: "RefreshToken 쿠키를 통해 토큰 재발급이 진행됩니다.",
      },
    },
  },
};

export const swaggerOptions: Options = {
  swaggerDefinition,
  apis: [
    path.join(rootPath, "src/routes/*.js"),
    path.join(rootPath, "src/swaggerDocs/**/*.yaml"),
  ],
};
