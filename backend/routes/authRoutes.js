const express = require('express');
const router = express.Router();
const { registerOrLogin, getCurrentUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register or login user with Firebase token
 * @access  Public
 */
router.post('/register', registerOrLogin);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
