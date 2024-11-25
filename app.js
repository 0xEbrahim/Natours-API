
import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tourRoutes.js';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));



app.use('/api/v1/tours', tourRouter);

app.listen(port, () => {
  console.log(`Application started running on port ${port}`);
});
