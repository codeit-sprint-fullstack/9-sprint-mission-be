import express from "express";
import { connectDB } from "./db/index.js";
import { config, isDevelopment } from "./config/config.js";
import { router } from "./routes/index.js";
import { cors } from "./middlewares/cors.js";
import { logger } from "./middlewares/logger.js";
import { reqTimer } from "./middlewares/reqTimer.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json" with { type: "json" };

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (isDevelopment) {
  app.use(logger);
  app.use(reqTimer);
  app.use("/api-docs", swaggerUi.serve ,swaggerUi.setup(swaggerFile));
}

app.use(cors);

app.use("/", router);

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log("Server running on http://localhost:" + config.PORT);
});
