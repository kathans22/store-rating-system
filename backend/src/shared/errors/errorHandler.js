const AppError = require('./AppError');

function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    const payload = { message: err.message };
    if (err.details) {
      if (Array.isArray(err.details)) {
        payload.errors = err.details;
      } else {
        payload.details = err.details;
      }
    }
    return res.status(err.statusCode).json(payload);
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({ message: 'Internal server error' });
}

module.exports = errorHandler;
