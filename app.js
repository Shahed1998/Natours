const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

// middleware
app.use(express.json());
app.use(morgan('dev'));

// Get all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

// Get tours by id
app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  }
});

// add tour
app.post('/api/v1/tours', (req, res) => {
  res.status(201).json({
    status: 'success',
    data: '',
  });
});

// update tour
app.patch((req, res) => {
  res.status(200).json({
    status: 'success',
    data: '',
  });
});

// delete tour
app.delete((req, res) => {
  res.status(204).json({
    status: 'successful',
    data: null,
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
