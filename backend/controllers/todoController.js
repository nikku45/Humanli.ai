const Todo = require('../models/Todo');
const Board = require('../models/Board');

/**
 * Get all todos for a specific board
 */
const getTodos = async (req, res, next) => {
  try {
    // Verify board belongs to user
    const board = await Board.findOne({
      _id: req.params.boardId,
      userId: req.user._id,
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    const todos = await Todo.find({ boardId: req.params.boardId })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single todo by ID
 */
const getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).select('-__v');

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    // Verify board belongs to user
    const board = await Board.findOne({
      _id: todo.boardId,
      userId: req.user._id,
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new todo
 */
const createTodo = async (req, res, next) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;
    const { boardId } = req.params;

    // Verify board belongs to user
    const board = await Board.findOne({
      _id: boardId,
      userId: req.user._id,
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    const todo = await Todo.create({
      title,
      description: description || '',
      completed: completed || false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      boardId,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a todo
 */
const updateTodo = async (req, res, next) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    // Verify board belongs to user
    const board = await Board.findOne({
      _id: todo.boardId,
      userId: req.user._id,
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    // Update todo fields
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    await todo.save();

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a todo
 */
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    // Verify board belongs to user
    const board = await Board.findOne({
      _id: todo.boardId,
      userId: req.user._id,
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    await Todo.deleteOne({ _id: todo._id });

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
};
