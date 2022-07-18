const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync('./src/dev-data/data/tours-simple.json', 'utf-8')
);

// Get all tours
exports.getAllTours = (req, res) => {
  res.status(400).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
};
