const jwt = require('jsonwebtoken');
const { verifyFirebaseToken } = require('../config/firebase');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies Firebase token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization header must be in format: Bearer <token>',
      });
    }

    const firebaseToken = authHeader.split(' ')[1];

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(firebaseToken);

    // Find or create user in database
    let user = await User.findOne({ firebaseUID: decodedToken.uid });

    if (!user) {
      // Create user if doesn't exist
      user = await User.create({
        firebaseUID: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified || false,
        name: decodedToken.name || null,
      });
    } else {
      // Update email verification status if changed
      if (user.emailVerified !== decodedToken.email_verified) {
        user.emailVerified = decodedToken.email_verified || false;
        await user.save();
      }
    }

    // Generate JWT for session management
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

    // Attach user and tokens to request
    req.user = user;
    req.firebaseToken = decodedToken;
    req.jwtToken = jwtToken;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
};

/**
 * Optional authentication middleware
 * Doesn't fail if token is missing, but attaches user if token is valid
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const firebaseToken = authHeader.split(' ')[1];
      const decodedToken = await verifyFirebaseToken(firebaseToken);
      let user = await User.findOne({ firebaseUID: decodedToken.uid });

      if (user) {
        req.user = user;
        req.firebaseToken = decodedToken;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};
