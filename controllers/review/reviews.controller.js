import Review from '../../models/reviewModel.js';
import User from '../../models/userModel.js';
import Tour from '../../models/tourModel.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import APIError from '../../utils/APIError.js';
import APIFeatures from '../../utils/APIFeatures.js';

const getAllReviews = asyncCatch(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const features = new APIFeatures(Review.find(filter), req.query)
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

const getReview = asyncCatch(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.reviewId) req.body.reviewId = req.params.reviewId;
  const tour = await Tour.findById(req.body.tour);
  if (!tour) return next(new APIError('Invalid tour id', 404));
  const review = await Review.findById(req.body.reviewId);
  if (!review) return next('Invalid review Id', 404);
  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

const createReview = asyncCatch(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user;
  const user = await User.findById(req.body.user._id);
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

export { createReview, deleteReview, updateReview, getReview, getAllReviews };
