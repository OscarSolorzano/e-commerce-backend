// Models
const { Order } = require('../models/order.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findByPk(id);

  if (!order) return next(new AppError('Order does not exists', 404));

  req.order = order;

  next();
});

const protectUsersOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  const { sessionUser } = req;

  if (order.userId !== sessionUser.id)
    return next(new AppError('This order does not belong to you', 403));

  next();
});

module.exports = { orderExists, protectUsersOrder };
