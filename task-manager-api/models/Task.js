/**
 * Task Model
 * Defines the schema and structure for tasks in the database
 */

const mongoose = require('mongoose');

// Define status enum
const STATUS_ENUM = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

/**
 * Task Schema
 * Represents a single task in the database with validation rules
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Task title cannot exceed 100 characters'],
      minlength: [1, 'Task title cannot be empty']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Task description cannot exceed 500 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: Object.values(STATUS_ENUM),
        message: `Status must be one of: ${Object.values(STATUS_ENUM).join(', ')}`
      },
      default: STATUS_ENUM.PENDING
    },
    // Timestamps are automatically managed by Mongoose
    // createdAt: creation timestamp
    // updatedAt: last modification timestamp
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: 'tasks' // MongoDB collection name
  }
);

/**
 * Create and export the Task model
 * If the model already exists, retrieve it; otherwise create a new one
 */
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
