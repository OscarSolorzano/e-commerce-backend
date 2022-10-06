// Models
const { ProductsInCart } = require('../models/productsInCart.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

//Services
const { removeProductFromCart } = require('../middlewares/cart.middlewares');

const addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

  const productInCart = await ProductsInCart.create({
    cartId: cart.id,
    productId,
    quantity,
  });

  res.status(201).json({
    status: 'succes',
    data: { productInCart },
  });
});

const updateProductInCart = catchAsync(async (req, res, next) => {
  const { newQty } = req.body;
  const { productInCart } = req;

  await productInCart.update({ quantity: newQty });

  res.status(201).json({
    status: 'succes',
    data: { productInCart },
  });
});

const removeProductFromCartResponse = catchAsync(async (req, res, next) => {
  await removeProductFromCart(req, res, next);
  res.status(204).json({
    status: 'succes',
  });
});

const purchaseCart = catchAsync(async (req, res, next) => {
  const { cart, productsInCart, sessionUser } = req;

  let totalPrice = 0;

  const productsPromises = productsInCart.map(async (productInCart) => {
    await productInCart.update({ status: 'purchased' });
    const product = await Product.findByPk(productInCart.productId);
    await product.update({
      quantity: product.quantity - productInCart.quantity,
    });
    totalPrice += product.price * productInCart.quantity;
  });

  await Promise.all(productsPromises);

  const order = await Order.create({
    userId: sessionUser.id,
    cartId: cart.id,
    totalPrice,
  });

  res.status(201).json({
    status: 'succes',
    data: { order },
  });
});

module.exports = {
  addProductToCart,
  updateProductInCart,
  removeProductFromCartResponse,
  purchaseCart,
};
