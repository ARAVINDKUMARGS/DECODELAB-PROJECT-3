/**
 * Task Routes
 * Defines all API endpoints for task management
 */

const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

/**
 * Task CRUD Routes
 */

// Create a new task
// POST /api/tasks
router.post('/', taskController.createTask);

// Get all tasks with optional filtering, sorting, and pagination
// GET /api/tasks
// Query parameters: status, sortBy, order, limit, page, search
router.get('/', taskController.getAllTasks);

// Get task statistics
// GET /api/tasks/stats/summary
// Must be defined before /:id to avoid conflict
router.get('/stats/summary', taskController.getTaskStats);

// Get a single task by ID
// GET /api/tasks/:id
router.get('/:id', taskController.getTaskById);

// Update a task by ID
// PUT /api/tasks/:id
router.put('/:id', taskController.updateTask);

// Delete a task by ID
// DELETE /api/tasks/:id
router.delete('/:id', taskController.deleteTask);

module.exports = router;
