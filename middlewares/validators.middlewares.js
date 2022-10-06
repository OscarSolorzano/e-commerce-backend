const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError.util');

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
    const errorMessages = errors.array().map((err) => err.msg);

    const message = errorMessages.join('. ');

    return next(new AppError(message, 400));
  }

  next();
};

const createUserValidators = [
  body('username')
    .isString()
    .withMessage('Username must be a string')
    .notEmpty()
    .withMessage('Username cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  checkValidations,
];

const createProductValidators = [
  body('title')
    .isString()
    .withMessage('title must be a string')
    .notEmpty()
    .withMessage('title cannot be empty'),
  body('description')
    .isString()
    .withMessage('description must be a string')
    .notEmpty()
    .withMessage('description cannot be empty')
    .isLength({ min: 3 })
    .withMessage('description must be at least 3 characters'),
  body('quantity')
    .isInt()
    .withMessage('quantity must be a integer number')
    .notEmpty()
    .withMessage('quantity cannot be empty'),
  body('price')
    .isInt({ min: 0 })
    .withMessage('price must be a integer number')
    .notEmpty()
    .withMessage('price cannot be empty'),
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('categoryId must be a integer number larger than 0')
    .notEmpty()
    .withMessage('categoryId cannot be empty'),
  checkValidations,
];

module.exports = { createUserValidators, createProductValidators };
