// Models
const { Category } = require('../models/category.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const categoryExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);

  if (!category) return next(new AppError('Category does no exists', 404));

  req.category = category;

  next();
});

module.exports = { categoryExists };
