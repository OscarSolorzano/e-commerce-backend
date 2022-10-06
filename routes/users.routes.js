const express = require('express');

// Controllers
const {
  createUser,
  updateUser,
  deleteUser,
  login,
} = require('../controllers/users.controller');
const {
  getUserOrders,
  getUserOrderById,
} = require('../controllers/orders.controller');
const { getUserProducts } = require('../controllers/products.controller');

// Middlewares
const { userExists } = require('../middlewares/users.middlewares');
const {
  createUserValidators,
} = require('../middlewares/validators.middlewares');
const {
  protectSession,
  protectUsersAccount,
} = require('../middlewares/auth.middlewares');
const {
  orderExists,
  protectUsersOrder,
} = require('../middlewares/orders.middlewares');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);

usersRouter.post('/login', login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.patch('/:id', userExists, protectUsersAccount, updateUser);

usersRouter.delete('/:id', userExists, protectUsersAccount, deleteUser);

usersRouter.get('/me', getUserProducts);

usersRouter.get('/orders', getUserOrders);

usersRouter.get(
  '/orders/:id',
  orderExists,
  protectUsersOrder,
  getUserOrderById
);

module.exports = { usersRouter };
