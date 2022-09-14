// Server
const mongoose = require('mongoose');
require('dotenv').config();

process.on('uncaughtException', (err) => {
  process.stdout.write(
    `Uncaught exception\nError: ${err.name}, ${err.message}`,
  );
  // The server.close() method stops the HTTP server from accepting new connections.
  // All existing connections are kept.
  process.exit(1); // 1 is used for unhandled exceptions
});

const app = require('./app');

// Database connection
(async () => {
  try {
    const dbString = process.env.DB_STRING.replace(
      '<password>',
      process.env.DB_PASSWORD,
    );
    await mongoose.connect(dbString);
    if (process.env.NODE_ENV === 'development') {
      process.stdout.write('Connected with database\n');
    }
  } catch (err) {
    process.stdout.write(`${err}\n`);
  }
})();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  process.stdout.write(`App running on port ${port}\n`);
});

// unhandled promise rejection handling
process.on('unhandledRejection', (err) => {
  process.stdout.write(
    `Unhandled rejection\nError: ${err.name}, ${err.message}`,
  );
  // The server.close() method stops the HTTP server from accepting new connections.
  // All existing connections are kept.
  server.close(() => {
    process.exit(1);
  });
});
