import APIError from '../utils/APIError.js';

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new APIError(message, 400);
};

const handleDublicateErrorDB = err => {
  let value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  value = value[0];
  const message = `Dublicate field value: ${value}. please use another value.`;
  return new APIError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new APIError(message, 400);
};

const sendDevErrors = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendProdErrors = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // error logging
    console.error('Error: ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};
const handleGlobalErrors = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendDevErrors(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDublicateErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    sendProdErrors(error, res);
  }
};
export { handleGlobalErrors };
