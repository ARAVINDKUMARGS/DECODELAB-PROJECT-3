/**
 * Error Handler Middleware
 * Centralized error handling for the entire application
 * Must be the last middleware to catch all errors
 */

/**
 * Global error handling middleware
 * Catches all errors thrown in the application and sends appropriate responses
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (error, req, res, next) => {
  // Default error values
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    // Extract validation error messages
    const messages = Object.values(error.errors)
      .map(err => err.message)
      .join(', ');
    message = `Validation Error: ${messages}`;
  }

  // Handle Mongoose duplicate key errors
  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyPattern)[0];
    message = `Duplicate value for field: ${field}`;
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${error.kind}: ${error.value}`;
  }

  // Handle JWT errors (if authentication is added later)
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;
