const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');

// middleware
app.use(morgan('dev')); // shows request info in the console
app.use(express.json()); // gives access to request body
app.use(express.static(`${__dirname}/public`)); // serve static files

// Tour middleware
app.use('/api/v1/tours', tourRouter);

module.exports = app;
