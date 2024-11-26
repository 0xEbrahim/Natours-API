import express from 'express';
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

const router = express.Router();

router.get('/tour-stats', getTourStats);
router.get('/monthly-plan/:year', getMonthlyPlan);
router.get('/top-5-cheap', aliasTop5Tours, getAllTours);
router.get('/', getAllTours);
router.get('/:id', getTour);
router.post('/', createTour);
router.patch('/:id', updateTour);
router.delete('/:id', deleteTour);

export default router;
