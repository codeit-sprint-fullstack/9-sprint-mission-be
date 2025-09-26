import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middlewares/logger.js';
import { requestTimer } from './middlewares/requestTimer.js';
import { config, isDevelopment } from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectDB, disconnectDB } from './db/index.js';

const app = express();
connectDB();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

if (isDevelopment) {
  app.use(logger);
  app.use(requestTimer);
}

app.use('/', router);

app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
  console.log(`📦 Environment: ${config.ENVIRONMENT}`);
});

const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    disconnectDB();
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
