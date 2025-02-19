import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const startApp = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start app:', error.message);
  }
};

startApp();
