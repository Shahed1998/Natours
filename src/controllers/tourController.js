const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync('./src/dev-data/data/tours-simple.json', 'utf-8')
);

exports.checkID = (req, res, next, val) => {
  if (val > tours.length) {
    // return is used to avoid returning header after sending status
    return res.status(400).json({ status: 'failed', message: 'Invalid id' });
  }
  next();
};

// Get all tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
};

// Add a tour
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.message) {
    return res.status(400).json({
      status: 'failed',
      message: 'unable to add tour',
    });
  }
  next();
};

exports.addTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'user added successfully',
  });
};
