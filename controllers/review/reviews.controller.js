import Review from '../../models/reviewModel.js';
import User from '../../models/userModel.js';
import Tour from '../../models/tourModel.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import APIError from '../../utils/APIError.js';
import APIFeatures from '../../utils/APIFeatures.js';

const getAllReviews = asyncCatch(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviews = await features.query;
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

const createReview = asyncCatch(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user)
    return next(
      new APIError('You have to be logged in, in order to create a review', 401)
    );
  const tour = await Tour.findById(req.body.tour);
  if (!tour) return next(new APIError('Invalid tour id', 400));
  const review = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    user: user._id,
    tour: tour._id
  });
  res.status(201).json({
    status: 'success',
    data: review
  });
});

const updateReview = asyncCatch(async (req, res, next) => {});

const deleteReview = asyncCatch(async (req, res, next) => {});

export { createReview, deleteReview, getAllReviews, updateReview };
