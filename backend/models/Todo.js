const mongoose = require('mongoose');

/**
 * Todo Schema
 * Represents a todo item that belongs to a board
 */
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Todo title is required'],
      trim: true,
      maxlength: [200, 'Todo title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
todoSchema.index({ boardId: 1, createdAt: -1 });
todoSchema.index({ userId: 1, completed: 1 });

module.exports = mongoose.model('Todo', todoSchema);
