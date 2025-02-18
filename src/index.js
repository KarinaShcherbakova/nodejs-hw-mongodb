import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const startApp = async () => {
  try {
    console.log('Initializing MongoDB connection...');
    await initMongoConnection();
    console.log('Mongo connection successfully established!');

    console.log('Starting server...');
    setupServer();
  } catch (error) {
    console.error('Failed to start app:', error.message);
  }
};

startApp();
