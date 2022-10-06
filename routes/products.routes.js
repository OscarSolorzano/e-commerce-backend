const express = require('express');

//Controllers
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller');

const {
  getAllCategories,
  createCategory,
  updateCategory,
} = require('../controllers/categories.controller');

//Middlewares
const { categoryExists } = require('../middlewares/categories.middlewares');
const { productExists } = require('../middlewares/products.middlewares');
const {
  createProductValidators,
} = require('../middlewares/validators.middlewares');
const {
  protectSession,
  protectUsersProduct,
} = require('../middlewares/auth.middlewares');

//Utils
const { upload } = require('../utils/multer.util');

//Router
const productsRouter = express.Router();

productsRouter.get('/', getAllProducts);

productsRouter.get('/categories', getAllCategories);

productsRouter.get('/:id', productExists, getProductById);

// Protecting below endpoints
productsRouter.use(protectSession);

productsRouter.post(
  '/',
  upload.array('productImg', 5),
  createProductValidators,
  createProduct
);

productsRouter.patch('/:id', productExists, protectUsersProduct, updateProduct);

productsRouter.delete(
  '/:id',
  productExists,
  protectUsersProduct,
  deleteProduct
);

productsRouter.post('/categories', createCategory);

productsRouter.patch('/categories/:id', categoryExists, updateCategory);

module.exports = { productsRouter };
