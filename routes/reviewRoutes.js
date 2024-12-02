import express from 'express';
import { protect, restrictTo } from '../controllers/Auth/auth.controller.js';
import {
  createReview,
  getAllReviews,
  getReview
} from '../controllers/review/reviews.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/', protect, getAllReviews);
router.get('/:reviewId', protect, getReview);
router.post('/', protect, restrictTo('user'), createReview);
export default router;
