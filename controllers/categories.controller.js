//Models
const { Category } = require('../models/category.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({ where: { status: 'active' } });

  res.status(200).json({
    status: 'succes',
    data: { categories },
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.create({ name });

  res.status(201).json({
    status: 'succes',
    data: { category },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { category } = req;
  category.update({ name });

  res.status(200).json({
    status: 'succes',
    data: { category },
  });
});

module.exports = { getAllCategories, createCategory, updateCategory };
