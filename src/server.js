import express from "express";
import { connectDB, disconnectDB } from "./db/prisma.js";
import { config, isDevelopment, isProduction } from "./config/config.js";
import { router } from "./routes/index.js";
import { cors } from "./middlewares/cors.js";
// import { logger } from "./middlewares/logger.js";
import { reqTimer } from "./middlewares/reqTimer.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json" with { type: "json" };
import morgan from "morgan";

const app = express();
let server;

const closeServer = async () => {
  console.log("shutting down server...");

  // 서버 종료(기존 요청 처리 대기)
  if (server) {
    await new Promise((resolve, reject) => {
      if (error) {
        console.error("Error during server close", error);
        reject(error);
      }
      console.log("HTTP server closed");
      resolve();
    });
  }

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

async function bootStrap() {
  try {
    await connectDB();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors);

    if (isDevelopment) {
      app.use(morgan("dev"));
      // app.use(logger);
      app.use(reqTimer);
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
    }

    if (isProduction) {
      app.use(morgan("combined"));
    }

    app.use("/api/v1", router);

    app.use(errorHandler);

    server = app.listen(config.PORT, () => {
      console.log("Server running on http://localhost:" + config.PORT);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", closeServer);
process.on("SIGINT", closeServer);

bootStrap();
