/* eslint-disable node/no-unsupported-features/es-syntax */
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import { handleUnhandledRoutes } from './errors/handleUnhandledRoutes.js';
import { handleGlobalErrors } from './errors/handleGlobalErrors.js';

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
app.use(handleGlobalErrors);
export default app;
