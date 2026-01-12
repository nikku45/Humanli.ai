const mongoose = require('mongoose');

/**
 * User Schema
 * Stores user information linked to Firebase UID
 */
const userSchema = new mongoose.Schema(
  {
    firebaseUID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ firebaseUID: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
