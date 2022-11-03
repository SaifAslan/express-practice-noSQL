const Product = require("../models/product");

exports.getAddProduct = (req, res, nex) => {
  res.render("admin/edit-product", {
    pageTitle: "Admin - Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = (req, res) => {
  let productId = req.params.productId;
  Product.findProductById(productId)
    .then((row) => {
      res.render("admin/edit-product", {
        pageTitle: "Admin - Edit Product",
        path: "/admin/products",
        editing: true,
        product: row,
      });
    })
    .catch((err) => console.log(err));
};
exports.postEditProduct = (req, res) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = +req.body.price;
  const product = new Product(productId, title, price, description, imageUrl,req.user._id);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = +req.body.price;
  const product = new Product(undefined, title, price, description, imageUrl,req.user._id);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getProductsAdmin = (req, res, nex) => {
  Product.fetchAll()
    .then((rows) => {
      res.render("admin/products", {
        prods: rows,
        pageTitle: "Admin - Products List",
        path: "/admin/products",
      });
    })
    .then((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.deleteProductById(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
