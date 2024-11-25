import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`, 'utf-8')
);

const checkId = (req, res, next, id) => {
  const tour = tours.find((el) => +el.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Fail',
      message: 'The name or price is not found',
    });
  }
  next();
};
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
  tour = { ...tour, ...req.body };
  tours[id] = tour;
  res.status(201).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};
export {
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
  createNewTour,
  checkId,
  checkBody,
};
