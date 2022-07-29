const Tour = require('../models/tourModel');

// Create a tour
exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Get all tours
exports.getAllTours = async (req, res) => {
  try {
    const allTours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: allTours.length,
      data: { allTours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Get one tour
exports.getTour = async (req, res) => {
  try {
    // findByID(req.params.id) is a shorthand of Tour.findOne({_id: req.params.id})
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
