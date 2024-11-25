import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));



app.listen(port, () => {
  console.log(`Application started running on port ${port}`);
});
