// Models
const { User } = require('./user.model');
const { Order } = require('./order.model');
const { Cart } = require('./cart.model');
const { Product } = require('./product.model');
const { Category } = require('./category.model');
const { ProductImg } = require('./productImg.model');

const initModels = () => {
  //1 User <---> M Orders
  User.hasMany(Order);
  Order.belongsTo(User);

  //1 Cart <---> 1 Order
  Cart.hasOne(Order);
  Order.belongsTo(Cart);

  // 1User <---> 1 'active' Cart
  Cart.belongsTo(User);

  // M Cart ---> M Products trough ProductsInCart
  Product.belongsToMany(Cart, { through: 'productsInCart' });

  // 1 Product ---> 1 Category
  Product.belongsTo(Category);

  // 1 Product <---> M productImgs
  Product.hasMany(ProductImg);
  ProductImg.belongsTo(Product);

  // 1 User <---> M Product
  User.hasMany(Product);
  Product.belongsTo(User);
};

module.exports = { initModels };
