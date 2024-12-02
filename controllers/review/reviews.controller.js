import Review from '../../models/reviewModel.js';
import Factory from '../../utils/factoryHandler.js';

const getAllReviews = Factory.getAll(Review);
const getReview = Factory.getOne(Review);
const createReview = Factory.CreateOne(Review);
const updateReview = Factory.updateOne(Review);
const deleteReview = Factory.deleteOne(Review);

export { createReview, deleteReview, updateReview, getReview, getAllReviews };
