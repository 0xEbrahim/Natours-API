/* eslint-disable node/no-unsupported-features/es-syntax */
import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateCurrentAuthUser,
  deleteCurrentAuthUser,
  getCurrentAuthUser
} from '../controllers/users/users.controller.js';
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  restrictTo,
  signUp,
  updatePassword
} from '../controllers/Auth/auth.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetPasswordToken', resetPassword);

router.use(protect);

router.patch('/updatePassword', updatePassword);
router.patch('/updateMe', updateCurrentAuthUser);
router.delete('/deleteMe', deleteCurrentAuthUser);
router.get('/getMe', getCurrentAuthUser, getUser);

router.use(restrictTo('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', restrictTo('admin'), updateUser);
router.delete('/:id', restrictTo('admin'), deleteUser);

export default router;
