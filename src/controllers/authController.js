/* eslint-disable no-underscore-dangle */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  // JSON Web Token
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRATION,
  // });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password exits
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // check if user exist and password correct
  const user = await User.findOne({ email }).select('+password'); // specific selection

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // if everything ok, send token to client
  const token = signToken(user._id);
  return res.status(200).json({
    status: 'success',
    token,
  });
});

// Protected routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) get token and check if it's there
  let token;
  if (
    // eslint-disable-next-line operator-linebreak
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    [, token] = req.headers.authorization.split(' ');
  }
  // 2) verify token
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) check if user still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('User with the token does not exist', 401));
  }
  // 4) check if user changed password after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password, please log in again', 401),
    );
  }
  // grant access to protected route
  req.user = freshUser;
  next();
});

// Authorized route
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 404),
      );
    }
    return next();
  };
};

// Forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on post email
  const user = await User.findOne({ email: req.body.email });
  // 2. Generate a random token
  if (!user) {
    return next(new AppError('User with that email does not exist', 404));
  }

  const resetToken = user.generateRandomPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3. Send it to user email
});

// Reset password
exports.resetPassword = (req, res, next) => {};
