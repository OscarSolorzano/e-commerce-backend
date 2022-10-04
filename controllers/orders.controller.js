// Models
const { Order } = require('../models/order.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const getUserOrders = catchAsync(async (req, res, next) => {
  const user = req.sessionUser;
  const orders = await Order.findAll({ where: { userId: user.id } });

  res.status(200).json({
    status: 'success',
    data: { orders },
  });
});

const getUserOrderById = catchAsync(async (req, res, next) => {
  const { order } = req;

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

module.exports = { getUserOrders, getUserOrderById };
