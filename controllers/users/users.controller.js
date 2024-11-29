import User from '../../models/userModel.js';
import { asyncCatch } from '../../utils/asyncCatch.js';

const getAllUsers = asyncCatch(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    users
  });
});
const getUser = (req, res) => {};
const createUser = (req, res) => {};
const updateUser = (req, res) => {};
const deleteUser = (req, res) => {};
export { getAllUsers, getUser, createUser, updateUser, deleteUser };
