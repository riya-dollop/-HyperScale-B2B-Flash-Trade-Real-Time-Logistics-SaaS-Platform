const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] [${req.method} ${req.url}]:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: err.name || 'Error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;

