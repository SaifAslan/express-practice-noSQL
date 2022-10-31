const express = require("express");
const { getAddProduct, postAddProduct, getProductsAdmin, getEditProduct, postEditProduct, postDeleteProduct } = require("../controllers/admin");


const router = express.Router();


// router.post('/edit-product',putEditProduct)

router.get("/edit-product/:productId", getEditProduct)

router.post("/edit-product", postEditProduct);

router.post("/add-product", postAddProduct );

router.get("/add-product", getAddProduct );

router.post("/delete-product", postDeleteProduct );

router.get("/products",getProductsAdmin)



module.exports = router
