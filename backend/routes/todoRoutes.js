const express = require('express');
const router = express.Router();
const {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');
const { authenticate } = require('../middleware/auth');
const { validateTodo } = require('../middleware/validator');

/**
 * @route   GET /api/v1/boards/:boardId/todos
 * @desc    Get all todos for a specific board
 * @access  Private
 */
router.get('/boards/:boardId/todos', authenticate, getTodos);

/**
 * @route   GET /api/v1/todos/:id
 * @desc    Get a single todo by ID
 * @access  Private
 */
router.get('/:id', authenticate, getTodo);

/**
 * @route   POST /api/v1/boards/:boardId/todos
 * @desc    Create a new todo in a board
 * @access  Private
 */
router.post('/boards/:boardId/todos', authenticate, validateTodo, createTodo);

/**
 * @route   PUT /api/v1/todos/:id
 * @desc    Update a todo
 * @access  Private
 */
router.put('/:id', authenticate, validateTodo, updateTodo);

/**
 * @route   DELETE /api/v1/todos/:id
 * @desc    Delete a todo
 * @access  Private
 */
router.delete('/:id', authenticate, deleteTodo);

module.exports = router;
