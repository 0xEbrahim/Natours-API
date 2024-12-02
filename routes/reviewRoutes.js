import express from 'express';
import { protect, restrictTo } from '../controllers/Auth/auth.controller.js';
import {
  createReview,
  getAllReviews
} from '../controllers/review/reviews.controller.js';

const router = express.Router();

router.get('/', protect, getAllReviews);
router.post('/', protect, restrictTo('user'), createReview);
export default router;
