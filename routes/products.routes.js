const express = require('express');

//Controllers

//Middlewares
const { protectSession } = require('../middlewares/auth.middlewares');

const productsRouter = express.Router();

productsRouter.get('/');

productsRouter.get('/:id');

productsRouter.get('categories');

// Protecting below endpoints
productsRouter.use(protectSession);

productsRouter.post('/');

productsRouter.patch('/:id');

productsRouter.delete('/:id');

productsRouter.post('/categories');

productsRouter.patch('/categories/:id');

module.exports = { productsRouter };
