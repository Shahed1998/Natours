const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');

// middleware
app.use(express.json());
app.use(morgan('dev'));

// Tour middleware
app.use(tourRouter);

module.exports = app;
