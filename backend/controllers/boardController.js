const Board = require('../models/Board');
const Todo = require('../models/Todo');

/**
 * Get all boards for the authenticated user
 */
const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: boards.length,
      data: boards,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single board by ID
 */
const getBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).select('-__v');

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new board
 */
const createBoard = async (req, res, next) => {
  try {
    const { title, description, color } = req.body;

    const board = await Board.create({
      title,
      description: description || '',
      color: color || '#3b82f6',
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Board created successfully',
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a board
 */
const updateBoard = async (req, res, next) => {
  try {
    const { title, description, color } = req.body;

    const board = await Board.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(color && { color }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-__v');

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Board updated successfully',
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a board and all its todos
 */
const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
      });
    }

    // Delete all todos in this board
    await Todo.deleteMany({ boardId: board._id });

    // Delete the board
    await Board.deleteOne({ _id: board._id });

    res.status(200).json({
      success: true,
      message: 'Board and all its todos deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
};
