import { signToken } from './JWT.js';

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
   res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

export { createSendToken };
