import mongoose from 'mongoose';

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log('Uncaught exception happened, server is about to shurtdown');
  console.log(err.name, err.message);
  process.exit(1);
});

import app from './app.js';

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log('Connected to database successfully..'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(
    `🌍 Server listening on port ${port} - ${process.env.NODE_ENV} environment`
  );
});

process.on('unhandledRejection', err => {
  console.log(
    'Unhandled rejection happened, your application will be shutdown 💀'
  );
  console.log(err.name, err.message);

  server.close(() => process.exit(1));
});
