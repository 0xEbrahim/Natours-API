/* eslint-disable node/no-unsupported-features/es-syntax */
import express from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateCurrentAuthUser,
  deleteCurrentAuthUser
} from '../controllers/users/users.controller.js';
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
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
router.patch('/resetPassword/:resetPasswordToken', resetPassword);
router.get('/', protect, getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
