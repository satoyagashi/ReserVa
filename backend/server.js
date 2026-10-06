import 'dotenv/config';
import app from './src/app.js';
import { testDbConnection, initDb } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Connect and verify PostgreSQL connection
    await testDbConnection();

    // 2. Ensure database schema is present
    await initDb();

    // 3. Start listening for incoming requests
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown handling
    const shutdown = async () => {
      console.log('\nShutting down server...');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('\n--> Hint: Could not connect to PostgreSQL on port 5432. Make sure your PostgreSQL server or container is running.\n');
    }
    process.exit(1);
  }
}

startServer();
