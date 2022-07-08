const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

app.use(express.json()); // middleware

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

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

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);
  res.send('done');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
