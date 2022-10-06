//Models
const { Product } = require('../models/product.model');
const { ProductImg } = require('../models/productImg.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const {
  uploadPostImgs,
  getProductsImgsUrls,
  getProductImgsUrls,
} = require('../utils/firebase.util');

const getUserProducts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const products = await Product.findAll({
    where: { userId: sessionUser.id },
    include: { model: ProductImg },
  });
  await getProductsImgsUrls(products);
  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, categoryId, quantity } = req.body;
  const { sessionUser } = req;

  const newProduct = await Product.create({
    title,
    description,
    price,
    categoryId,
    quantity,
    userId: sessionUser.id,
  });

  uploadPostImgs(req.files, newProduct.id);

  res.status(200).json({
    status: 'success',
    data: { newProduct },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: 'active' },
    include: { model: ProductImg },
  });

  await getProductsImgsUrls(products);
  res.status(200).json({
    status: 'succes',
    data: { products },
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;

  await getProductImgsUrls(product);

  res.status(200).json({
    status: 'succes',
    data: { product },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, price, quantity } = req.body;

  await product.update({ title, description, price, quantity });

  res.status(200).json({
    status: 'succes',
    data: { product },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'deleted' });

  res.status(203).json({
    status: 'succes',
  });
});

module.exports = {
  getUserProducts,
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
