import express from 'express';
import { protect, restrictTo } from '../controllers/Auth/auth.controller.js';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview
} from '../controllers/review/reviews.controller.js';
import { handleRequestBeforeCreatingReview } from '../middlewares/handleRequestBeforeReviewRouter.js';

const router = express.Router({ mergeParams: true });

router.get('/', protect, getAllReviews);
router.get('/:id', protect, getReview);
router.post('/', protect, restrictTo('user', 'admin'),handleRequestBeforeCreatingReview, createReview);
router.delete('/:id', protect, deleteReview);
router.patch('/:id', updateReview);
export default router;
