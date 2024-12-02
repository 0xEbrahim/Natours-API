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
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', protect, updateCurrentAuthUser);
router.delete('/deleteMe', protect, deleteCurrentAuthUser);
router.get('/getMe', protect, getCurrentAuthUser, getUser);
router.patch('/resetPassword/:resetPasswordToken', resetPassword);
router.get('/', protect, getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', protect, restrictTo('admin'), deleteUser);

export default router;
