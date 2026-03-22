/**
 * Main Application Server
 * Entry point for the Task Manager API
 * Initializes Express server, connects to MongoDB, and sets up all middleware
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { requestLogger, errorLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

// Initialize Express app
const app = express();

/**
 * ================================
 * MIDDLEWARE SETUP
 * ================================
 */

// CORS middleware - Enable cross-origin requests
app.use(cors());

// Body parser middleware - Parse JSON request bodies
app.use(express.json());

// URL encoded parser middleware - Parse form data
app.use(express.urlencoded({ extended: true }));

// Request logging middleware - Log all incoming requests
app.use(requestLogger);

/**
 * ================================
 * ROUTES
 * ================================
 */

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Task Manager API is running'
  });
});

// API v1 routes
app.use('/api/tasks', taskRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Task Manager API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      tasks: '/api/tasks',
      documentation: '/api/tasks/docs (see README.md)'
    }
  });
});

// 404 Not Found middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`
  });
});

// Error logging middleware
app.use(errorLogger);

// Global error handling middleware (must be last)
app.use(errorHandler);

/**
 * ================================
 * SERVER INITIALIZATION
 * ================================
 */

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start server and connect to database
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║         Task Manager API Server Started                    ║
╚════════════════════════════════════════════════════════════╝

📊 Application Information:
   • Environment: ${NODE_ENV}
   • Port: ${PORT}
   • Server URL: http://localhost:${PORT}
   • API Base URL: http://localhost:${PORT}/api

🔗 Quick Links:
   • Health Check: http://localhost:${PORT}/health
   • Root Endpoint: http://localhost:${PORT}/
   • Task API: http://localhost:${PORT}/api/tasks

📚 Documentation:
   • Setup Guide: See SETUP_GUIDE.md
   • API Docs: See API_DOCUMENTATION.md
   • README: See README.md

✓ Ready to accept requests...
      `);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('✗ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  console.error('✗ Uncaught Exception:', error);
  process.exit(1);
});

/**
 * Handle graceful shutdown
 */
process.on('SIGTERM', () => {
  console.log('✓ SIGTERM received. Gracefully shutting down...');
  app.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

module.exports = app;
