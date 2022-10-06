// Models
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { ProductsInCart } = require('../models/productsInCart.model');
const { AppError } = require('../utils/appError.util');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

// Services
const findCart = async (req, res, next) => {
  const { sessionUser } = req;

  let cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
  });

  return { cart, sessionUser };
};

const findProductInCart = async (req, res, next) => {
  const { cart, product } = req;
  const productInCart = await ProductsInCart.findOne({
    where: { cartId: cart.id, productId: product.id },
  });
  if (productInCart) req.productInCart = productInCart;
  return productInCart;
};

const removeProductFromCart = async (req, res, next) => {
  const { productInCart } = req;

  await productInCart.update({ quantity: 0, status: 'removed' });
};

//Middlewares
const findOrCreateCart = catchAsync(async (req, res, next) => {
  let { cart, sessionUser } = await findCart(req, res, next);

  if (!cart) cart = await Cart.create({ userId: sessionUser.id });

  req.cart = cart;

  next();
});

const checkProductStock = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  let quantity = req.body.quantity || req.body.newQty;

  const product = await Product.findOne({
    where: { id: productId, status: 'active' },
  });

  if (!product) return next(new AppError('product not found', 404));
  else if (quantity > product.quantity)
    return next(new AppError('Insuficient stock of product', 400));

  req.product = product;
  next();
});

const isProductInCartAdd = catchAsync(async (req, res, next) => {
  const productInCart = await findProductInCart(req, res, next);

  if (!productInCart) return next();
  else if (productInCart.status === 'active')
    return next(new AppError('product is already in cart', 400));

  const { quantity } = req.body;
  await productInCart.update({ status: 'active', quantity });

  res.status(201).json({
    status: 'succes',
    data: { productInCart },
  });
});

const cartExists = catchAsync(async (req, res, next) => {
  const { cart } = await findCart(req, res, next);

  //   console.log(cart);
  if (!cart)
    return next(
      new AppError(
        'You do not have an active cart, please add a product before updating you cart',
        400
      )
    );

  req.cart = cart;
  next();
});

const isProductInCart = catchAsync(async (req, res, next) => {
  const productInCart = await findProductInCart(req, res, next);

  if (!productInCart || productInCart.status === 'removed')
    return next(
      new AppError(
        'Product not found in cart, please add a product before updating it',
        404
      )
    );
  next();
});

const checkZeroQuantity = catchAsync(async (req, res, next) => {
  const { newQty } = req.body;

  if (newQty === 0) {
    await removeProductFromCart(req, res, next);
    return res.status(203).json({ status: 'succes' });
  }

  next();
});

const isCartEmpty = catchAsync(async (req, res, next) => {
  const { cart } = req;
  const productsInCart = await ProductsInCart.findAll({
    where: { cartId: cart.id, status: 'active' },
  });

  if (productsInCart.length === 0)
    return next(new AppError('Your cart is empty', 400));

  req.productsInCart = productsInCart;

  next();
});

module.exports = {
  findOrCreateCart,
  checkProductStock,
  isProductInCartAdd,
  cartExists,
  isProductInCart,
  checkZeroQuantity,
  removeProductFromCart,
  isCartEmpty,
};
