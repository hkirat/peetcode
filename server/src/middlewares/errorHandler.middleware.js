const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err,
    message: err.message || "Internal Server Error",
    statusCode: statusCode,
    success: false,
  });
};

module.exports = errorHandler;
