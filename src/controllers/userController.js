const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const allUsers = await User.find();
  // Sending response
  return res.status(200).json({
    status: 'success',
    results: allUsers.length,
    data: { allUsers },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user creates post data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-my-password',
        404,
      ),
    );
  }

  // 2) Filtered out unwanted field names
  const filterObj = (reqBody, ...fields) => {
    const newObj = {};
    Object.keys(reqBody).forEach((el) => {
      if (fields.includes(el)) {
        newObj[el] = reqBody[el];
      }
    });
    return newObj;
  };

  const filterBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

// Delete user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
