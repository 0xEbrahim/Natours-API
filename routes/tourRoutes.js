import express from 'express';
import reviewRouter from './reviewRoutes.js';
import {
  getAllTours,
  getSingleTour as getTour,
  createNewTour as createTour,
  updateTour,
  deleteTour,
  aliasTop5Tours,
  getTourStats,
  getMonthlyPlan
} from '../controllers/tours/tours.controller.js';
import { protect, restrictTo } from '../controllers/Auth/auth.controller.js';
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);
router.get('/tour-stats', getTourStats);
router.get(
  '/monthly-plan/:year',
  protect,
  restrictTo('admin', 'lead-guide','guide'),
  getMonthlyPlan
);
router.get('/top-5-cheap', aliasTop5Tours, getAllTours);
router.get('/', getAllTours);
router.get('/:id', getTour);
router.post('/', protect, restrictTo('admin', 'lead-guide'), createTour);
router.patch('/:id', protect, restrictTo('admin', 'lead-guide'), updateTour);
router.delete('/:id', protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
