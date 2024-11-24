import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
const deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => +el.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
const createNewTour = async (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        data: {
          newTour,
        },
      });
    }
  );
};
const getSingleTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => +el.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};
const updateTour = (req, res) => {
  const { id } = req.params;
  let tour = tours.find((el) => +el.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  tour = { ...tour, ...req.body };
  tours[id] = tour;
  res.status(201).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getSingleTour);
app.post('/api/v1/tours', createNewTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

app.listen(port, () => {
  console.log(`Application started running on port ${port}`);
});
