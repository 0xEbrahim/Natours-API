import User from '../../models/userModel.js';
import { asyncCatch } from '../../utils/asyncCatch.js';

const signUp = asyncCatch(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user
    }
  });
});

export { signUp };
