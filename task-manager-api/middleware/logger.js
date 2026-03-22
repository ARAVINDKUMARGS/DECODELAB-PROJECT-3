/**
 * Logger Middleware
 * Logs HTTP requests with timestamps and relevant information
 */

/**
 * Request logging middleware
 * Logs method, URL, timestamp, and response time
 */
const requestLogger = (req, res, next) => {
  // Record the start time
  const startTime = Date.now();

  // Store the original response.json method
  const originalJson = res.json;

  // Override the response.json method to log when response is sent
  res.json = function (data) {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    console.log(`
[${timestamp}] ${req.method} ${req.originalUrl}
Status: ${res.statusCode}
Duration: ${duration}ms
IP: ${req.ip}
    `);

    // Call the original json method
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Error logging middleware
 * Logs errors with full stack trace information
 */
const errorLogger = (error, req, res, next) => {
  const timestamp = new Date().toISOString();

  console.error(`
[${timestamp}] ERROR
Method: ${req.method}
URL: ${req.originalUrl}
Status: ${error.status || 500}
Message: ${error.message}
Stack: ${error.stack}
  `);

  next(error);
};

module.exports = { requestLogger, errorLogger };
