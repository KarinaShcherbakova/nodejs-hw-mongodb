import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';
import contactsRouter from './routes/contacts.js';

dotenv.config();

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(cors());
  app.use(express.json());

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    console.log('Handling request...');
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
  });

  logger.info('Server setup is complete');
};

console.log('Server module loaded.');

