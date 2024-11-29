import User from '../../models/userModel.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import APIError from '../../utils/APIError.js';
import { signToken, verfiyToken } from '../../utils/JWT.js';

const signUp = asyncCatch(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role || undefined
  });
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
});

const login = asyncCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new APIError('Please provide email and password', 400));

  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.matchPassword(password, user.password)))
    return next(new APIError('Wrong email or password', 401));
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token
  });
});

const protect = asyncCatch(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token)
    return next(
      new APIError('You are not logged in, please login first.', 401)
    );

  const decoded = await verfiyToken(token);
  const user = await User.findById(decoded.id);
  if (!user)
    return next(
      new APIError(
        'This token is not valid anymore, this user maybe deleted or banned'
      )
    );
  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new APIError(
        'This token is not valid anymore, User recently changed password',
        401
      )
    );
  req.user = user;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new APIError(
          "You don't have the permission to perform this action.",
          403
        )
      );
    next();
  };
};

export { signUp, login, protect, restrictTo };
