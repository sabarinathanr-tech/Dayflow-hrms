export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
    code: 'NOT_FOUND'
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('[Dayflow Error]', err.stack || err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
    code = 'VALIDATION_ERROR';
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}.`;
    code = 'DUPLICATE_ENTRY';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id ${err.value}`;
    code = 'INVALID_ID';
  }

  res.status(statusCode).json({
    success: false,
    message,
    code
  });
};
