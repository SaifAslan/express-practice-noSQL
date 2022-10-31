const Product = require("../models/product");
const { deleteById } = require("../models/product");

exports.getAddProduct = (req, res, nex) => {
  res.render("admin/edit-product", {
    pageTitle: "Admin - Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = (req, res) => {
  let productId = req.params.productId;
  req.user
    .getProducts({ where: { id: productId } })
    .then((row) => {
      res.render("admin/edit-product", {
        pageTitle: "Admin - Edit Product",
        path: "/products",
        editing: true,
        product: row[0],
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
  Product.findByPk(productId)
    .then((row) => {
      row.title = title;
      row.imageUrl = imageUrl;
      row.description = description;
      row.price = price;
      row.save();
    })
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
  req.user
    .createProduct({
      title,
      imageUrl,
      description,
      price,
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProductsAdmin = (req, res, nex) => {
  req.user
    .getProducts()
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
  Product.destroy({ where: { id: productId } })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
