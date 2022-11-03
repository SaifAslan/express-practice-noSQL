const Product = require("../models/product");

exports.getProducts = (req, res, nex) => {
  Product.fetchAll()
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
  Product.findProductById(req.params.productId)
    .then((row) => {
      console.log(row);
      res.render("shop/product-detail", {
        product: row,
        pageTitle: row.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
    .then((prods) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: prods,
      });
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
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
  Product.findProductById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("product added", result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((errr) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
