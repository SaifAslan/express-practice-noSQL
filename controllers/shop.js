const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, nex) => {
  Product.findAll()
    .then((rows) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "Products",
        path: "/products",
      });
    })
    .then((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, nex) => {
  // Product.findAll({ where: { id: req.params.productId } })
  //   .then((rows, fieldData) => {
  //     res.render("shop/product-detail", {
  //       product: rows[0],
  //       pageTitle: rows[0].title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
  Product.findByPk(req.params.productId)
    .then((row, fieldData) => {
      res.render("shop/product-detail", {
        product: row,
        pageTitle: row.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:['products']}).then((orders) => {
    res.render("shop/orders", {
      orders: orders,
      pageTitle: "Orders",
      path: "/orders",
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        let oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
  // Product.findById(productId, (product) => {
  //   Cart.addProduct(productId, product.price);
  // });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      return products[0].cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((errr) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          order.addProducts(
            products.map((prod) => {
              prod.orderItem = { quantity: prod.cartItem.quantity };
              return prod;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
