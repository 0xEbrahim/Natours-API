import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import tourRouter from './routes/tourRoutes.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);



app.use('/api/v1/tours', tourRouter);

app.listen(port, () => {
  console.log(`Application started running on port ${port}`);
});
