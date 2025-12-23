import express, { type Express } from "express";
import type { Server } from "http";
import { connectDB, disconnectDB } from "./db/prisma";
import { config, isDevelopment, isProduction } from "./config/config";
import { router } from "./routes/index";
import { cors } from "./middlewares/cors";
import { reqTimer } from "./middlewares/reqTimer";
import { errorHandler } from "./middlewares/errorHandler";
import passport from "./config/passport";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
// import swaggerFile from "./swagger-output.json" with { type: "json" };
import morgan from "morgan";

const app: Express = express();
let server: Server;

/** Server & DB 을 안전하게 종료하는 함수*/
const closeServer = async (): Promise<void> => {
  console.log("shutting down server...");

  // 서버 종료(기존 요청 처리)
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server.close((error?: Error) => {
        if (error) {
          console.error("Error during server close", error);
          return reject(error);
        }
        console.log("HTTP server closed");
        resolve();
      });
    });
  }

  // DB & Process 종료
  try {
    await disconnectDB();
    console.log("DB 연결이 성공적으로 종료되었습니다.");
  } catch (error) {
    console.error("Error during Shutdown:", error);
    process.exit(1);
  } finally {
    console.log("Process exiting now.");
    process.exit(0);
  }
};

/** Express Router */
const setupApp = (): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors);

  if (isDevelopment) {
    app.use(morgan("dev"));
    /** morgan 출력 외 특별한 커스텀이 필요할 때 */
    // app.use(logger);
    /** performance.now() 처럼 특별한 커스텀 포맷이 필요할때만 */
    // app.use(reqTimer);
    // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
  }

  if (isProduction) {
    app.use(morgan("combined"));
  }

  app.use(passport.initialize());

  app.use("/uploads", express.static("uploads"));
  app.use("/api/v1", router);

  app.use(errorHandler);
};

setupApp();

/** APP_START */
async function bootStrap(): Promise<void> {
  try {
    await connectDB();

    server = app.listen(config.PORT, () => {
      console.log("Server running on http://localhost:" + config.PORT);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

/** OS SIGNER (Graceful Shutdown) */
process.on("SIGTERM", closeServer);
process.on("SIGINT", closeServer);

if (process.env.NODE_ENV !== "test") {
  bootStrap();
}

export { app };
