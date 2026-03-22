/**
 * Task Controller
 * Handles all business logic for task operations
 * Uses async/await syntax for clean, readable code
 */

const Task = require('../models/Task');

/**
 * Create a new task
 * POST /api/tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Task title is required'
      });
    }

    // Create new task
    const task = await Task.create({
      title,
      description,
      status
    });

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tasks with advanced filtering, sorting, and pagination
 * GET /api/tasks?status=pending&sortBy=createdAt&order=desc&limit=10&page=1&search=title
 * @param {Object} req - Express request object with query parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, sortBy = 'createdAt', order = 'desc', limit = 10, page = 1, search } = req.query;

    // Build filter object
    const filter = {};

    // Apply status filter if provided
    if (status) {
      filter.status = status;
    }

    // Apply search filter (searches in title)
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    // Calculate pagination values
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10)); // Max 100 items per page
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortObj = {};
    const isValidSortField = ['createdAt', 'updatedAt', 'title', 'status'].includes(sortBy);
    const sortField = isValidSortField ? sortBy : 'createdAt';
    sortObj[sortField] = order === 'asc' ? 1 : -1;

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    // Fetch tasks with filters, sorting, and pagination
    const tasks = await Task.find(filter)
      .sort(sortObj)
      .limit(limitNum)
      .skip(skip)
      .lean(); // Use .lean() for better performance in read-only queries

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      message: 'Tasks retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single task by ID
 * GET /api/tasks/:id
 * @param {Object} req - Express request object with task ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format'
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a task by ID
 * PUT /api/tasks/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format'
      });
    }

    // Build update object (only include provided fields)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    // Check if update data is empty
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    // Find and update task, return new document
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return updated document
        runValidators: true // Run validations on update
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task by ID
 * DELETE /api/tasks/:id
 * @param {Object} req - Express request object with task ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format'
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: null,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get task statistics
 * GET /api/tasks/stats/summary
 * Returns count of tasks by status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const formattedStats = {
      total: 0,
      byStatus: {}
    };

    stats.forEach(stat => {
      formattedStats.byStatus[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.status(200).json({
      success: true,
      data: formattedStats,
      message: 'Task statistics retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};
