/* eslint-disable node/no-unsupported-features/es-syntax */
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import { handleUnhandledRoutes } from './errors/handleUnhandledRoutes.js';

dotenv.config();

// variables
const app = express();

// middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', handleUnhandledRoutes);
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});
export default app;
