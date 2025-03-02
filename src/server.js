import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

import fs from 'fs';
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";


dotenv.config();

cloudinary.api.ping()
  .then(response => {
    console.log("Cloudinary connection successful:", response);
  })
  .catch(error => {
    console.error("Cloudinary connection error:", error);
  });

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3001;

const swaggerFile = fs.readFileSync("./docs/openapi.yaml", "utf8");

const swaggerDocument = yaml.parse(swaggerFile);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};
