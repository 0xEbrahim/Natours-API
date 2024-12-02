import User from '../../models/userModel.js';
import APIError from '../../utils/APIError.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { filterBody } from '../../utils/filteringBody.js';
import Factory from '../../utils/factoryHandler.js';


const updateCurrentAuthUser = asyncCatch(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new APIError("You can't update password on this page", 400));

  const filteredBody = filterBody(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

const deleteCurrentAuthUser = asyncCatch(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});



const getAllUsers = Factory.getAll(User);
const getUser = Factory.getOne(User);
const updateUser = Factory.updateOne(User);
const deleteUser = Factory.deleteOne(User);

export {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateCurrentAuthUser,
  deleteCurrentAuthUser
};
