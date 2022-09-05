const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // shows request info in the console
}

app.use(express.json()); // gives access to request body
app.use(express.static(`${__dirname}/public`)); // serve static files

// Tour middleware
app.use('/api/v1/tours', tourRouter);

// Error route
// eslint-disable-next-line no-unused-vars
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
// It takes 4 parameters (err, req, res, next)
app.use(globalErrorHandler);

module.exports = app;
