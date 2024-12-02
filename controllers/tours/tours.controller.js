import Tour from '../../models/tourModel.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import Factory from '../../utils/factoryHandler.js';

const aliasTop5Tours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

const getTourStats = asyncCatch(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 0.0 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numOfRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        priceAverage: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { priceAverage: 1 }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

const getMonthlyPlan = asyncCatch(async (req, res, next) => {
  const year = +req.params.year;
  console.log(year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          $month: '$startDates'
        },
        numTourStarts: {
          $sum: 1
        },
        tours: {
          $push: '$name'
        }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan
    }
  });
});


const getAllTours = Factory.getAll(Tour);
const getSingleTour = Factory.getOne(Tour, { path: 'reviews'});
const createNewTour = Factory.CreateOne(Tour);
const deleteTour = Factory.deleteOne(Tour);
const updateTour = Factory.updateOne(Tour);

export {
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
  createNewTour,
  aliasTop5Tours,
  getTourStats,
  getMonthlyPlan
};
