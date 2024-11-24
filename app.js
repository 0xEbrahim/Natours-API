import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import fs from 'fs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'SUCCESS',
    results: tours.length,
    data: {
      tours,
    },
  });
});
app.listen(port, () => {
  console.log(`Application started running on port ${port}`);
});
