import crypto from 'crypto';
import User from '../../models/userModel.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import APIError from '../../utils/APIError.js';
import { verfiyToken } from '../../utils/JWT.js';
import { sendEmail } from '../../utils/email.js';
import { createSendToken } from '../../utils/createSendToken.js';

const signUp = asyncCatch(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role || undefined
  });
  createSendToken(user, 201, res);
});

const login = asyncCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new APIError('Please provide email and password', 400));

  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.matchPassword(password, user.password)))
    return next(new APIError('Wrong email or password', 401));
  createSendToken(user, 201, res);
});

const forgotPassword = asyncCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new APIError('There is not user with this email ', 404));
  const resetPasswordToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetPasswordToken}`;

  const message = `Forgot your password?..,
   send a PATCH request with your new password and password confirmation to this URL: ${resetURL} \n
   If you didn't forgot your password, please skip this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid only for 10 mins)',
      message: message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email, please check it out'
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    user.save({ validateBeforeSave: false });

    return next(
      new APIError(
        'Error occurs while sending the email, please try again later',
        500
      )
    );
  }
});
const resetPassword = asyncCatch(async (req, res, next) => {
  const { resetPasswordToken } = req.params;
  const encodedToken = crypto
    .createHash('sha256')
    .update(resetPasswordToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: encodedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  if (!user)
    return next(new APIError('Invalid or expired password reset token', 400));

  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 201, res);
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

const updatePassword = asyncCatch(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  const currentPassword = req.body.currentPassword;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  if (!(await user.matchPassword(currentPassword, user.password)))
    return next(
      new APIError('You enter the current password incorrectly.', 401)
    );
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
});

export {
  signUp,
  login,
  protect,
  restrictTo,
  updatePassword,
  forgotPassword,
  resetPassword
};
