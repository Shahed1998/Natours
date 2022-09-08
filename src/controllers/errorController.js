/* eslint-disable no-param-reassign */

const saveErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const saveErrProd = (err, res) => {
  // Operational error (trusted error)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error (untrusted)
    // 1. Log error
    process.stderr.write('Error: ', err);
    // 2. Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    saveErrDev(err, res);
  } else {
    saveErrProd(err, res);
  }

  next();
};
