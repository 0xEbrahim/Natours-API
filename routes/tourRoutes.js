import express from 'express';
import {
  getAllTours,
  getSingleTour as getTour,
  createNewTour as createTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
} from '../controllers/tours/tours.controller.js';

const router = express.Router();

router.param('id', checkId);
router.get('/', getAllTours);
router.get('/:id', getTour);
router.post('/', checkBody, createTour);
router.patch('/:id', updateTour);
router.delete('/:id', deleteTour);

export default router;
