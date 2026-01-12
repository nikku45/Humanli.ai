const express = require('express');
const router = express.Router();
const {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} = require('../controllers/boardController');
const { authenticate } = require('../middleware/auth');
const { validateBoard } = require('../middleware/validator');

/**
 * @route   GET /api/v1/boards
 * @desc    Get all boards for authenticated user
 * @access  Private
 */
router.get('/', authenticate, getBoards);

/**
 * @route   GET /api/v1/boards/:id
 * @desc    Get a single board by ID
 * @access  Private
 */
router.get('/:id', authenticate, getBoard);

/**
 * @route   POST /api/v1/boards
 * @desc    Create a new board
 * @access  Private
 */
router.post('/', authenticate, validateBoard, createBoard);

/**
 * @route   PUT /api/v1/boards/:id
 * @desc    Update a board
 * @access  Private
 */
router.put('/:id', authenticate, validateBoard, updateBoard);

/**
 * @route   DELETE /api/v1/boards/:id
 * @desc    Delete a board and all its todos
 * @access  Private
 */
router.delete('/:id', authenticate, deleteBoard);

module.exports = router;
