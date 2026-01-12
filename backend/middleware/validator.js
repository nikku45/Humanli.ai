const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Board validation rules
 */
const validateBoard = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Board title is required')
    .isLength({ max: 100 })
    .withMessage('Board title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),
  handleValidationErrors,
];

/**
 * Todo validation rules
 */
const validateTodo = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Todo title is required')
    .isLength({ max: 200 })
    .withMessage('Todo title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  handleValidationErrors,
];

module.exports = {
  validateBoard,
  validateTodo,
  handleValidationErrors,
};
