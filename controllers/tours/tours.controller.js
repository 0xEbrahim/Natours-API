import Tour from '../../models/tourModel.js';
import APIError from '../../utils/APIError.js';
import APIFeatures from '../../utils/APIFeatures.js';
import { asyncCatch } from '../../utils/asyncCatch.js';

const aliasTop5Tours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

const getAllTours = asyncCatch(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});
const deleteTour = asyncCatch(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) return next(new APIError(`No tour found for ID: ${id}`, 404));

  res.status(204).json({ status: 'success', data: null });
});
const createNewTour = asyncCatch(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  console.log('LOGGED');
  res.status(201).json({
    status: 'success',
    data: {
      newTour
    }
  });
});
const getSingleTour = asyncCatch(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  console.log(id);
  if (!tour) return next(new APIError(`No tour found for ID: ${id}`, 404));
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});
const updateTour = asyncCatch(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) return next(new APIError(`No tour found for ID: ${id}`, 404));

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
});

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
