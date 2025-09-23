import express from "express";
import { connectDB } from "./db/index.js";
import { config, isDevelopment } from "./config/config.js";
import { router } from "./routes/index.js";
import { cors } from "./middlewares/cors.js";
import { logger } from "./middlewares/logger.js";
import { reqTimer } from "./middlewares/reqTimer.js";

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (isDevelopment) {
  app.use(logger);
  app.use(reqTimer);
}

app.use(cors);

app.use("/", router);

app.listen(config.PORT, () => {
  console.log("Server running on http://localhost:" + config.PORT);
});
