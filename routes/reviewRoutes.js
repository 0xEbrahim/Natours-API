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

router.use(protect);

router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post(
  '/',
  restrictTo('user'),
  handleRequestBeforeCreatingReview,
  createReview
);

router.use(restrictTo('user', 'admin'));

router.delete('/:id', deleteReview);
router.patch('/:id', updateReview);
export default router;
