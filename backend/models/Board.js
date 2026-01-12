const mongoose = require('mongoose');

/**
 * Board Schema
 * Represents a board/workspace for organizing todos
 */
const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
      maxlength: [100, 'Board title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    color: {
      type: String,
      default: '#3b82f6', // Default blue color
      match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
boardSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Board', boardSchema);
