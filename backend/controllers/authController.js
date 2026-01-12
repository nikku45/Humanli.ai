const User = require('../models/User');
const { verifyFirebaseToken } = require('../config/firebase');
const jwt = require('jsonwebtoken');

/**
 * Register/Login user (after Firebase authentication)
 * This endpoint is called after Firebase auth succeeds on frontend
 */
const registerOrLogin = async (req, res, next) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase token is required',
      });
    }

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(firebaseToken);

    // Find or create user
    let user = await User.findOne({ firebaseUID: decodedToken.uid });

    if (!user) {
      user = await User.create({
        firebaseUID: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified || false,
        name: decodedToken.name || null,
      });
    } else {
      // Update user info if changed
      if (user.emailVerified !== decodedToken.email_verified) {
        user.emailVerified = decodedToken.email_verified || false;
      }
      if (decodedToken.name && user.name !== decodedToken.name) {
        user.name = decodedToken.name;
      }
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        userId: user._id.toString(),
        firebaseUID: user.firebaseUID,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
        token: jwtToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerOrLogin,
  getCurrentUser,
};
