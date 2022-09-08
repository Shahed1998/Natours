/* eslint-disable no-unused-vars */
const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/ApiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Middleware: alias tour
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Create a tour
exports.addTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  return res.status(201).json({
    status: 'success',
    data: newTour,
  });
});

// Get all tours
exports.getAllTours = catchAsync(async (req, res, next) => {
  // Executing query
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const allTours = await features.query;

  // Sending response
  return res.status(200).json({
    status: 'success',
    results: allTours.length,
    data: { allTours },
  });
});

// Get one tour
exports.getTour = catchAsync(async (req, res, next) => {
  // findByID(req.params.id) is a shorthand of Tour.findOne({_id: req.params.id})
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError(`no tour found with id ${req.params.id}`, 404));
  }

  return res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// Update a tour
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(`no tour found with id ${req.params.id}`, 404));
  }

  return res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// Delete a tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError(`no tour found with id ${req.params.id}`, 404));
  }
  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ----------------------------- Aggregation pipeline ----------------------
// Get tour statistics
// Aggregate method works in stages
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stat = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // _id: '$ratingsAverage', // gives data for all the tours
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' }, // field names in $field_name
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // have to use group name
    },
    // { $match: { _id: { $ne: 'easy' } } }, // we can match multiple times
  ]);

  return res.status(200).json({
    status: 'success',
    data: { stat },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStart: -1 },
    },
  ]);
  return res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
