const express = require('express');

// Controllers
const {
  addProductToCart,
  updateProductInCart,
  removeProductFromCartResponse,
  purchaseCart,
} = require('../controllers/cart.controller');
// Middlewares
const { protectSession } = require('../middlewares/auth.middlewares');
const { productExists } = require('../middlewares/products.middlewares');
const {
  findOrCreateCart,
  checkProductStock,
  isProductInCartAdd,
  cartExists,
  isProductInCart,
  checkZeroQuantity,
  isCartEmpty,
} = require('../middlewares/cart.middlewares');

//Router
const cartRouter = express.Router();

cartRouter.use(protectSession);

cartRouter.post(
  '/add-product',
  findOrCreateCart,
  checkProductStock,
  isProductInCartAdd,
  addProductToCart
);

cartRouter.patch(
  '/update-cart',
  cartExists,
  checkProductStock,
  isProductInCart,
  checkZeroQuantity,
  updateProductInCart
);

cartRouter.delete(
  '/:id',
  cartExists,
  productExists,
  isProductInCart,
  removeProductFromCartResponse
);

cartRouter.post('/purchase', cartExists, isCartEmpty, purchaseCart);

module.exports = { cartRouter };
