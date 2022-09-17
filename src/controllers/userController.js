const User = require('../models/userModel');
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
