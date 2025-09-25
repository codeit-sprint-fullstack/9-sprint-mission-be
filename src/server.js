import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middlewares/logger.js';
import { requestTimer } from './middlewares/requestTimer.js';
import { config, isDevelopment } from './config/config.js';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

if (isDevelopment) {
  app.use(logger);
  app.use(requestTimer);
}

app.use('/', router);

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
  console.log(`📦 Environment: ${config.ENVIRONMENT}`);
});
