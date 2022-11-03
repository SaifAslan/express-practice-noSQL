const express = require("express");

const {
  getProducts,
  getIndex,
  // getCheckout,
  getCart,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
  postOrder,
} = require("../controllers/shop");

const router = express.Router();

router.get("/cart", getCart);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.post("/cart", postCart);

router.post("/cart-delete-item", postCartDeleteProduct);

// router.get("/checkout", getCheckout);

router.get("/orders", getOrders);

router.post("/create-order", postOrder);

router.get("/", getIndex);

module.exports = router;
