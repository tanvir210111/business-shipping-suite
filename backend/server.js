import app from './app.js';
import { initDatabase } from './database/connection.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('[Server] Connecting to database...');
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` BUSINESS SHIPPING SUITE - BACKEND API SERVER RUNNING `);
      console.log(` Port: http://localhost:${PORT}`);
      console.log(` Health: http://localhost:${PORT}/api/health`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('[Server Start Fatal ERROR]', err);
    process.exit(1);
  }
}

startServer();
